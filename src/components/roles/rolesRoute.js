const controller = require('./rolesController');
const { authJwt } = require('../auth');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });

    app.route('/api/role/count')
        .get([authJwt.verifyToken], function(req, res, next) {
            controller.getCount(req, res)
        });
        
    app.route('/api/role')
        .get([authJwt.verifyToken], function(req, res, next) {
            if (req.query.id) {
                next(); // response is returned from controller.findOne
            }
            else {
                controller.findAll(req, res)
            }
        }, controller.findOne)
        .post([authJwt.verifyToken], controller.create);
    
    app.route('/api/role/:id')
        .put([authJwt.verifyToken], controller.update)
        .delete([authJwt.verifyToken], controller.del);

    app.get('/api/role/page', [authJwt.verifyToken], controller.findPerPage)   ;
};
