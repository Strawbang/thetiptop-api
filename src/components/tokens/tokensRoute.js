const controller = require('./tokensController');
const { authJwt } = require('../auth');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });

    app.route('/api/token')
        .get([authJwt.verifyToken], function(req, res, next) {
            if (req.query.id) {
                next();
            }
            else {
                controller.findAll();
            }
        }, controller.findOne)
        .post([], controller.create);
    
    app.route('/api/token/:token')
        .put([authJwt.verifyToken], controller.update)
        .delete([authJwt.verifyToken], controller.del);

    app.get('/api/token/page', [authJwt.verifyToken], controller.findPerPage);

    app.post('/api/token/consume', [], controller.consume);
};
