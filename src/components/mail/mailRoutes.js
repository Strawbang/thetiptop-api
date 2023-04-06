const controller = require('./mailController');

module.exports = (app) => {
    app.post('/api/contact', controller.sendContactMail);
};
