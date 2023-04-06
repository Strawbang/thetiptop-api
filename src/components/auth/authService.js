const generator = require('generate-password');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const config = require('../../config')
const models = process.env.ENV === 'test' ?  require('../../config/models/modelAssociationMock') : require('../../config/models/modelAssociation')
const ticketsService = require('../tickets/ticketsService');
const mailService = require('../mail/mailService');
const tokenService = require('../tokens/tokensService');
const elasticsearch = require('../elastichsearch');
const User = models.users;

const signup = async (data) => {
    try {
        const response = await User.create({
            email: data.user.email,
            password: data.user.password,
            firstname: data.user.firstname,
            lastname: data.user.lastname,
            birthdate: data.user.birthdate,
            address: data.user.address,
            city: data.user.city,
            postcode: data.user.postcode,
            newsletter: data.user.newsletter,
        }).then((user) => user.setRoles([3]).then(async () => {
            const ticket = {
                number: data.user.number,
                userId: user.id,
            }

            await ticketsService.updateTicket(ticket);

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                config.secret, {
                    expiresIn: 86400, // 24 hours
                },
            );

            await tokenService.create({
                value: token,
                type: 'confirmation',
                expiresAt: Date.now() + (1000 * 60 * 60 * 24),
                userId: user.id,
            });

            console.log(user, token, ticket.number)
            const confEmail = await mailService.sendConfirmationEmail(user, token, ticket.number);
            
            console.log(confEmail);

            if (!confEmail) {
                return {
                    status: 200,
                    data: {
                        message: 'Le compte a bien été créé mais le mail n\'a pas été envoyé.', successful: true,
                        isMailSent: false,
                        userId: user.id,
                    },
                }
            }

            if (process.env.ENV === 'production') {
                elasticsearch.run('signup.successful', `Le compte ${user.id} à bien été créé et le mail de confirmation a était envoyé`, 200)
            }

            return {
                status: 200,
                data: {
                    message: 'Le compte a bien été créé et le mail de confirmation a bien été envoyé.',
                    successful: true,
                    userId: user.id,
                    isMailSent: true,
                },
            };
        }));
        return response;
    } catch (e) {
        if (process.env.ENV === 'production') {
            elasticsearch.run('signup.failed', `Une erreur inattendue est survenue. Veuillez réessayer. ${e.message}`, 400)
        }

        return {
            status: 400,
            data: {
                error: {
                    message: "Une erreur inattendue est survenue. Veuillez réessayer.",
                    status: e.message,
                },
                successful: false,
            }
        };
    }
};

const signin = async (data) => {
    try {
        const email = data.user.email;
        const response = await User.findOne({ where: { email }})
            .then(async (user) => {
            if (!(user instanceof User)) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('signin.failedusername', `Le nom d'utilisateur que vous avez entré est invalide. ${email}`, 400)
                }

                return {
                    status: 404,
                    data: {
                        message: "Le nom d'utilisateur que vous avez entré est invalide.",
                        successful: false,
                        error: "user_not_found",
                    },
                }
            }

            const passwordIsValid = bcrypt.compareSync(data.user.password, user.password);
            
            if (!passwordIsValid){
                if (process.env.ENV === 'production') {
                    elasticsearch.run('signin.failedpassword', `Le mot de passe que vous avez entré est invalide. ${user.email}`, 401);
                }
                
                return {
                    status: 401,
                    data: {
                        message: "Le mot de passe que vous avez entré est invalide.",
                        successful: false,
                        error: "invalid_credentials",
                    }
                };
            }
            
            if (!user.active) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('signin.inactiveuser', `Vous ne pouvez pas vous connecter à votre compte car celui-ci est encore inactif. Veuillez confirmer votre compte à l'aide du mail de confirmation qui vous a été envoyé. ${user.email}`, 401)
                }

                return {
                    status: 401,
                    data: {
                        message: "Vous ne pouvez pas vous connecter à votre compte car celui-ci est encore inactif. Veuillez confirmer votre compte à l'aide du mail de confirmation qui vous a été envoyé.",
                        successful: false,
                        error: "inactive_user",
                    }
                };
            }

            const ticket = {
                number: data.user.number,
                userId: user.id,
            }
            await ticketsService.updateTicket(ticket);

            const authorities = [];
            const token = await user.getRoles().then(async (roles) => {
                for (let i = 0; i < roles.length; i += 1) {
                    authorities.push(roles[`${i}`].name);
                }

                return jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        role: authorities,
                    },
                    config.secret, {
                        expiresIn: 86400, // 24 hours
                    },
                );
            }).catch((e) => {
                throw new Error(e.message);
            });

            if (data.from) {
                if (data.from === 'back') {
                    if (authorities.includes('Client') &&
                        !authorities.includes('Admin') &&
                        !authorities.includes('Employee')) {
                        if (process.env.ENV === 'production') {
                            elasticsearch.run('signin.adminloginfail', `Vous n'avez pas accès au site d'administration. ${user.email}`, 403)
                        }

                        return {
                            status: 403,
                            data: {
                                message: "Vous n'avez pas accès au site d'administration.",
                                error: 'client_login_attempt',
                            },
                        };
                    }
                }
            }

            if (process.env.ENV === 'production') {
                elasticsearch.run('signin.success', `Utilisateur ${user.email} authentifié`, 200)
            }

            return {
                status: 200,
                data: {
                    accessToken: token,
                    user: user,
                },
            };

        });
        return response;
    } catch (e) {
        if(!data.user) {
            data.user = {};
        }

        if (process.env.ENV === 'production') {
            elasticsearch.run('signin.error', `Une erreur inattendue est survenue. Veuillez réessayer. ${data.user.email}\n` + e.message, 500);
        }

        return {
            status: 500,
            data: {
                message: "Une erreur inattendue est survenue. Veuillez réessayer.",
                error: e.message,
            }
        };
    }
}

const resetPassword = async (email) => {
    try {
        User.findOne(
            {
                where: {
                    email,
                },
            },
        ).then(async (user) => {
            if (!user) {
                return { status: 404, data: { successful: false, message: 'Adresse email introuvable' } };
            }
            const password = generator.generate({
                length: 10,
                numbers: true,
            });
            console.log('Test : ', password);
            const newPassword = bcrypt.hashSync(password, 8);
            User.update(
                {
                    password: newPassword,
                },
                {
                    where: {
                        email,
                    },
                },
            );
            await mailService.sendPasswordEmail(user.email, user.firstname, password);
        });

        return { status: 200, data: { successful: true, message: 'Votre mot de passe vient de vous être envoyé par email' } };
    } catch (e) {
        return { status: 500, data: { successful: false, message: 'Une erreur s\'est produite lors de la réinitialisation de votre mot de passe' } };
    }
};

module.exports = {
    signup,
    resetPassword,
    signin,
}