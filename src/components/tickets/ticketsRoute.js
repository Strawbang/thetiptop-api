const controller = require('./ticketsController');
const { authJwt } = require('../../components/auth');

module.exports = (app) => {
    app.all('/', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
    
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });

    app.get('/api/ticket/count', [], controller.getCount);

    app.route('/api/ticket')
        .get([authJwt.verifyToken], function(req, res, next) {
            if (req.query.id) {
                next(); // response is returned from controller.findOne
            }
            else {
                controller.findAll(req, res)
            }
        }, controller.findOne)
        .post([authJwt.verifyToken], controller.create)
        .put([authJwt.verifyToken], controller.updateTicket);
    
    app.route('/api/ticket/:id')
        .put([authJwt.verifyToken], controller.update)
        .delete([authJwt.verifyToken], controller.del);

    app.post('/api/number/ticket', controller.getTicket);
    app.get('/api/ticket/page', [authJwt.verifyToken], controller.findPerPage);
    app.post('/api/ticket/print', [authJwt.verifyToken], controller.printTicket);

};