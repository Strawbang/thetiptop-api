const models = process.env.ENV === 'test' ?  require('../../config/models/modelAssociationMock') : require('../../config/models/modelAssociation')
const User = models.users;
const Role = models.roles;
const Ticket = models.tickets;
const bcrypt = require('bcryptjs');
const { response } = require('express');
const { Op } = require("sequelize");

const getCount = async(data) => {
    try {
        let whereStatement = {};
        let includeStatement = {
            model: Role,
            required: false,
        };;

        if (data) {
            if (typeof data.newsletter !== "undefined") {
                whereStatement.newsletter = data.newsletter;
            }

            if (typeof data.city !== "undefined") {
                whereStatement.city = data.city;
            }

            if (typeof data.signupDate !== "undefined") {
                whereStatement.signupDate = data.signupDate;
            }

            if (typeof data.clients !== "undefined") {
                includeStatement.required = true;
                includeStatement.where = {
                    name: 'Client',
                };
            }
        }

        const response = await User.count({
            where: whereStatement,
            include: [
                includeStatement,
            ],
        }).then( (count) => {
            const response = {
                status: 200,
                data: {
                    count: count,
                    successful: true,
                },
            };

            return response;
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération du nombre d'utilisateurs. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const findAll = async() => {
    try {
        const response = await User.findAll({
            include: Role,
            attributes: { exclude: 'password' },
        }).then(async (users) => {
            const response = {
                status: 200,
                data : {
                    users,
                    successful: true,
                },
            };

            return response;
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération des utilisateurs. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const findPerPage = async (data) => {
    try {
        let offset = data.offset === undefined ? 0 : parseInt(data.offset),
            limit = data.limit === undefined ? 20 : parseInt(data.limit);
        
        const response = await User.findAndCountAll({
            include: Role,
            offset: offset,
            limit: limit,
            order: [
                ['id', 'ASC']
            ],
            attributes: { exclude: 'password' },
        }).then(async (result) => {
            let response = {
                status: 200,
                data: {
                    users: result,
                    successful: true,
                },
            };
            
            return response;
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération des utilisateurs. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        }
    }
};

const findOne = async (userId) => {
    try {
        const userCollection = await User.findOne({
            where: { id: userId },
            include: [Role, Ticket],
            attributes: { exclude: 'password' },
        });

        if (!userCollection) {
            return {
                status: 400,
                data: { message: 'L\'utilisateur demandé n\'existe pas' }
            };
        }

        return {
            status: 200,
            data: userCollection,
        };
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération de l'utilisateur demandé. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const getUserPassword = async (userId) => {
    try {
        const userCollection = await User.findOne({
            where: { id: userId }
        });

        const password = userCollection.password

        if (!userCollection) {
            return {
                status: 400,
                data: { 
                    message: 'L\'utilisateur demandé n\'existe pas',
                    successful: false,
                }
            };
        }

        return {
            status: 200,
            data: password,
        };
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération de l'utilisateur demandé. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
}

const create = async(data) => {
    try {
        if (!data.user.roles) {
            return {
                status: 400,
                data: {
                    message: "Il est obligatoire de renseigner un rôle pour l'utilisateur.",
                    successful: false
                }
            };
        };  
        
        roles = await Role.findAll({
            where: {
                id: {
                    [Op.or]: data.user.roles
                }
            }
        });

        const response = await User.create(data.user).then( (user) => {
            user.setRoles(roles);

            return {
                status: 200,
                data: {
                    message: "L'utilisateur a été créé !",
                    successful: true,
                }
            }
        });

        return response;
    }
    catch (e) {        
        if (e.name === 'SequelizeUniqueConstraintError') {
            return {
                status: 422,
                data: {
                    message: "Un utilisateur utilise déjà cette adresse email.",
                    error: e.message,
                    successful: false
                }
            };
        }

        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la création de l'utilisateur. Veuillez réessayer.",
                error: e.message,
                successful: false
            }
        };
    }
};

const update = async(userId, data) => {
    try {
        let id;

        if (userId) {
            id = userId;
        }

        const response = await User.findOne({
            where: { id: id },
            include : Role
        }).then( async (u) => {
            let response;

            if (u instanceof User) {
                await u.update(data);

                if (data.roles) {
                    roles = await Role.findAll({
                        where: {
                            id: {
                                [Op.or]: data.roles
                            }
                        }
                    });

                    u.setRoles(roles);
                }

                response = {
                    status: 200,
                    data : {
                        message: "L'utilisateur demandé a été mis à jour !",
                        successful: true,
                    },
                };
            }
            else {
                response = {
                    status: 404,
                    data : {
                        message: "L'utilisateur demandé n'a pas été mis à jour car il n'existe pas.",
                        successful: false,
                    },
                };
            }

            return response;
        });

        return response;
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return {
                status: 422,
                data: {
                    message: "Un utilisateur utilise déjà cette adresse email.",
                    error: e.message,
                    successful: false
                }
            };
        }
        
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la mise à jour de l'utilisateur demandé. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const updatePassword = async(userId, dataD) => {
    try {
        let id;
        if (userId) {
            id = userId;
        }
        const testOldPassword = dataD.oldPassword;
        const testNewPassword1 = dataD.newPassword1;
        const testNewPassword2 = dataD.newPassword2;

        const userOldPassword = await getUserPassword(id);
        
        const passwordIsValid = bcrypt.compareSync(testOldPassword, userOldPassword.data);
        console.log(passwordIsValid)
        const update = {'password': testNewPassword1};

        if (!passwordIsValid) {
            console.log('aaa')
            let response = {
                status: 200,
                data : {
                    message: "Votre ancien mot de passe ne correspond pas.",
                    successful: false,
                },
            };
            return response;
        } else {
            if (testNewPassword1 != testNewPassword2) {
                let response = {
                    status: 200,
                    data : {
                        message: "Vos nouveau mot de passe doivent être identique.",
                        successful: false,
                    },
                }
                return response
            } else {
                const response = await User.findOne({
                    where: { id: id }
                }).then( async (u) => {
                    let response;
                    if (u instanceof User) {
                        await u.update(update);
                        response = {
                            status: 200,
                            data : {
                                message: "Le mot de passe de l'utilisateur a été mis à jour !",
                                successful: true,
                            },
                        };
                    }
                    else {
                        response = {
                            status: 404,
                            data : {
                                message: "Le mot de passe de l'utilisateur n'a pas été mis à jour !",
                                successful: false,
                            },
                        };
                    }
                    return response;
                });
                return response;
            }
        }
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la mise à jour du mot de passe utilisateur. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const del = async(id) => {
    try {
        const response = await User.findOne({
            where: { id : id }
        }).then (async (user) => {
            let response;

            if (user instanceof User) {
                await user.destroy();

                response = {
                    status: 200,
                    data : {
                        message: " L'utilisateur demandé a été supprimé !",
                        successful: true,
                    },
                };
            }
            else {
                response = {
                    status: 404,
                    data : {
                        message: "L'utilisateur demandé n'a pas été supprimé car il n'existe pas.",
                        successful: false,
                    },
                };
            }
            
            return response;
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue pendant la suppression d'un de l'utilisateur demandé. Veuillez réessayer.",
                error: e.message
            }
        };
    }
};

const getTickets = async (id) => {
    try {
        const response = await Ticket.findAll({ where: { userId: id } }).then((tickets) => {
            let response;

            response = {
                status: 200,
                data: {
                    tickets: tickets,
                    successful: true,
                },
            };

            return response;
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: e.message,
                successful: false,
            },
        };
    }
}

module.exports = {
    getCount,
    findAll,
    findOne,
    create,
    update,
    del,
    getTickets,
    findPerPage,
    getUserPassword,
    updatePassword,
}