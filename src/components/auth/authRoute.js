const passport = require('passport');
const jwt = require('jsonwebtoken');
const { authJwt, authVerifySignup } = require ('./index');
const controller = require('./authController');
const config = require('../../config')
require('./authPassportGoogle');
require('./authPassportFacebook');
const authService = require('./authService')
var util = require('util');
const { query } = require('express');
const { resourceLimits } = require('worker_threads');


module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });

    app.post('/api/auth/signup-local', [authVerifySignup.checkDuplicateEmail], controller.signup);

    //Auth with google
    app.get('/api/auth/googleAuth',
    function(req,res,next){
        if (typeof req.query['ticket'] === 'undefined'){
            ticket = 0
        } else {
            ticket = req.query['ticket']
        }
        passport.authenticate(
            'googleAuth', 
            { 
                scope: ['profile', 'email'],
                prompt : "select_account",
                state : JSON.stringify(dticket = ticket)
            }
        )(req,res,next);
    });

    // callback route for google to redirect to
    app.get('/api/auth/google/redirect', passport.authenticate('googleAuth') ,function(req, res, next) {
        if(!req.user.errors) {
            if(!req.user.ticket || req.user.ticket === '0') {
                let tk = jwt.sign(
                    {
                        id: req.user.id,
                        email: req.user.email,
                        firstname: req.user.firstname,
                        lastname: req.user.lastname,
                        role: req.user.roles[0].name,
                    },
                    config.secret, {
                        expiresIn: 86400, // 24 hours
                    },
                );
                let accessToken = tk;
                res.cookie('accessToken', accessToken)
                res.redirect(process.env.BASE_URL + '/dashboard')
            } else {
                let tk = jwt.sign(
                    {
                        id: req.user.id,
                        email: req.user.email,
                        firstname: req.user.firstname,
                        lastname: req.user.lastname,
                        role: req.user.roles[0].name,
                    },
                    config.secret, {
                        expiresIn: 86400, // 24 hours
                    },
                );
                let accessToken = tk;

                res.cookie('accessToken', accessToken)
                res.cookie('ticket', req.user.ticket)
                res.redirect(process.env.BASE_URL + '/participate')
            }
        } else {
            res.redirect(process.env.BASE_URL + '/participate/errorsGoogle')
        }
    });

    //Auth with facebook
    app.get('/api/auth/facebookAuth',
    function(req,res,next){
        if (typeof req.query['ticket'] === 'undefined'){
            ticket = 0
        } else {
            ticket = req.query['ticket']
        }
        passport.authenticate(
            'facebookAuth', 
            { 
                scope: ['email'],
                prompt : "select_account",
                state : JSON.stringify({ticket})
            }
        )(req,res,next);
    });

    // callback route for facebook to redirect to
    app.get('/api/auth/facebook/redirect', passport.authenticate('facebookAuth'), function(req, res, next) {
        if(!req.user.errors) {
            if(!req.user.ticket) {
                let tk = jwt.sign(
                    {
                        id: req.user.id,
                        email: req.user.email,
                        firstname: req.user.firstname,
                        lastname: req.user.lastname,
                        role: req.user.roles[0].name,
                    },
                    config.secret, {
                        expiresIn: 86400, // 24 hours
                    },
                );
                let accessToken = tk;
                res.cookie('accessToken', accessToken)
                res.redirect(process.env.BASE_URL + '/dashboard')
            } else {
                let tk = jwt.sign(
                    {
                        id: req.user.id,
                        email: req.user.email,
                        firstname: req.user.firstname,
                        lastname: req.user.lastname,
                        role: req.user.roles[0].name,
                    },
                    config.secret, {
                        expiresIn: 86400, // 24 hours
                    },
                );
                let accessToken = tk;
                res.cookie('accessToken', accessToken)
                res.cookie('ticket', req.user.ticket)
                res.redirect(process.env.BASE_URL + '/participate')
            }
        } else {
            res.redirect(process.env.BASE_URL + '/participate/errorsGoogle')
        }
    });

    //LOGOUT
    app.get('/api/logout', function(req,res){
        req.logout();

        if (req.session) {
            req.session.destroy(function (err) {
                if (err) { 
                    return next(err);
                }
            });
        }
        
        res.redirect(200, process.env.BASE_URL);
    })

    app.post('/api/auth/signin-local', controller.signin);

    app.post('/api/auth/reset-password', controller.resetPassword);
}
