const controller = require('.//usersController');
const { authJwt } = require('../../components/auth');

module.exports = (app) =>{
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });

    app.route('/api/user/count')
        .get([authJwt.verifyToken], function(req, res) {
            controller.getCount(req, res);
        });

    app.route('/api/profile')
        .get([authJwt.verifyToken], function(req, res) {
            controller.findOne(req, res);
        });

    app.route('/api/user')
        .get([authJwt.verifyToken], function(req, res, next) {
            if (req.query.id) {
                next();
            }
            else {
                controller.findAll(req, res);
            }
        }, controller.findOne)
        .post([authJwt.verifyToken], controller.create)
        .put([authJwt.verifyToken], controller.update)
        .delete([authJwt.verifyToken], controller.del);


    app.route('/api/user/:id')
        .put([authJwt.verifyToken], controller.update)
        .delete([authJwt.verifyToken], controller.del);

    app.get('/api/user/tickets', [authJwt.verifyToken], controller.getTickets);
    
    app.get('/api/user/page', [authJwt.verifyToken], controller.findPerPage);

    app.post('/api/user/passwordUpdate', [authJwt.verifyToken], controller.updatePassword);
};
