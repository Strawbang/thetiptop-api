const jwt = require('jsonwebtoken');
const db = process.env.ENV === 'test' ?  require('../../config/models/modelAssociationMock') : require('../../config/models/modelAssociation')
const config = require('../../config');

const User = db.users;

const checkDuplicateEmail = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            message: 'Vous n\'êtes pas connecté',
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Connexion non autorisée',
            });
        }
        req.userId = decoded.id;
        req.role = decoded.role;
    });

    const email = req.body.email || (req.body.user ? req.body.user.email : req.body.email);

    User.findOne({
        where: {
            email,
        },
    }).then((user) => {
        if (user) {
            if (user.id != req.userId) {
                // logger.info(`Email déjà enregistré (${req.body.email})`);
                res.status(400).send({
                    message: 'Cet email est déjà utilisé',
                });
                return;
            }
        }

        next();
    });
};

const checkDuplicateEmailToAnother = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({
            message: 'Vous n\'êtes pas connecté',
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Connexion non autorisée',
            });
        }
        req.userId = decoded.id;
        req.role = decoded.role;
    });

    User.findOne({
        where: {
            email: req.body.email,
        },
    }).then((user) => {
        if (user) {
            if (user.id != req.params.userId) {
                // logger.info(`Email déjà enregistré (${req.body.email})`);
                res.status(400).send({
                    message: 'Cet email est déjà utilisé',
                });
                return;
            }
        }

        next();
    });
};

const verifyEmail = {
    checkDuplicateEmail,
    checkDuplicateEmailToAnother,
};

module.exports = verifyEmail;
