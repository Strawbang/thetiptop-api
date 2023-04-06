const jwt = require('jsonwebtoken');
const config = require('../../config');
const db = process.env.ENV === 'test' ?  require('../../config/models/modelAssociationMock') : require('../../config/models/modelAssociation')
const User = db.users;

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({
            message: "Vous n'êtes pas connecté",
        });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Connexion non autorisée',
            });
        }
        req.userId = decoded.id;
        req.role = decoded.role;

        next();
    });
};

const isUser = (req, res, next) => {
    if (req.role.find((role) => role === 'User') !== undefined) {
        next();
        return;
    }
    res.status(403).send({
        message: 'Require User Role!',
    });
};

const isAdmin = (req, res, next) => {
    if (req.role.find((role) => role === 'Admin') !== undefined) {
        next();
        return;
    }
    res.status(403).send({
        message: 'Require User Role!',
    });
};

const isModerator = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i += 1) {
                if (roles[`${i}`].name === 'Moderator') {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require Moderator Role!',
            });
        });
    });
};

const isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i += 1) {
                if (roles[`${i}`].name === 'Moderator') {
                    next();
                    return;
                }

                if (roles[`${i}`].name === 'Admin') {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require Moderator or Admin Role!',
            });
        });
    });
};

const isAdminOrOrganisme = (req, res, next) => {
    User.findByPk(req.userId).then(async (user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i += 1) {
                if (roles[`${i}`].name === 'Admin') {
                    req.isAdmin = true;
                    next();
                    return;
                }

                if (roles[`${i}`].name === 'Organisme') {
                    req.isOrganisme = true;
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require Moderator or Admin Role!',
            });
        });
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
    isUser,
    isAdminOrOrganisme,
};
module.exports = authJwt;
