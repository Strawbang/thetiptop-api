const authService = require('./authService');

const signup = async (req, res) => {
    try {
        const response = await authService.signup(req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        console.log(e);
    }
}

const signin = async (req, res) => {
    try {
        const response = await authService.signin(req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        console.log(e);
    }
}

const signinGoogle = async (req, res) => {
    try {
        const response = await authService.signinGoogle();
        await res.status(response.status).send(response.data);        
    } catch (e) {
        console.log(e);
    }
}

const resetPassword = async (req, res) => {
    try {
        const response = await authService.resetPassword(req.body.email);
        await res.status(response.status).send
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    signup,
    signin,
    signinGoogle,
    resetPassword
}