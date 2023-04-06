const mailService = require('./mailService');

const sendContactMail = async (req, res) => {
    try {
        const response = await mailService.sendContactMail(req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};


module.exports = {
    sendContactMail,
}