const models = process.env.ENV === 'test' ?  require('../../config/models/modelAssociationMock') : require('../../config/models/modelAssociation')

const Role = models.roles;

const getCount = async() => {
    try {
        const response = await Role.count({}).then( (count) => {
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
                message: "Une erreur est survenue lors de la récupération du nombre de rôles. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const findAll = async() => {
    try {
        const response = await Role.findAll().then(async (roles) => {
            const response = {
                status: 200,
                data : {
                    roles: roles,
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
                message: "Une erreur est survenue lors de la récupération des rôles. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const findPerPage = async (data) => {
    try {
        let offset = data.offset === undefined ? 0 : parseInt(data.offset),
            limit = data.limit === undefined ? 10 : parseInt(data.limit);
        
        const response = await Role.findAndCountAll({
            offset: offset,
            limit: limit,
            order: [
                ['id', 'ASC']
            ],
        }).then(async (result) => {
            let response = {
                status: 200,
                data: {
                    roles: result,
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
                message: "Une erreur est survenue lors de la récupération des rôles. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        }
    }
};

const findOne = async(id) => {
    try {
        const response = await Role.findOne({
            where: { id: id } 
        }).then(async (role) => {
            let response;
            
            if (role == null) {
                response = {
                    status: 404,
                    data : {
                        message: "Le rôle demandé n'existe pas.",
                        successful: false,
                    },
                };
            }
            else {
                response = {
                    status: 200,
                    data : {
                        role: role,
                        successful: true,
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
                message: "Une erreur est survenue lors de la récupération du rôle demandé. Veuillez réessayer.",
                error: e.message,
                successful: false,
                details: e.constructor.name,
            }
        };
    }
};

const create = async(data) => {
    try {
        const response = await Role.create({
            name: data.name,
        }).then( (role) => {
            return {
                status: 200,
                data: {
                    message: 'Le rôle ' + role.name + ' a été créé !',
                    successful: true,
                    role: role,
                }
            }
        });

        return response;
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return {
                status: 422,
                data: {
                    message: "Un rôle possède déjà ce nom.",
                    error: e.message,
                    successful: false
                }
            };
        }

        return {
            data: {
                message: "Une erreur est survenue lors de la création du rôle. Veuillez réessayer.",
                error: e.message,
                successful: false
            }
        };
    }
};

const update = async(roleId, data) => {
    try {
        let id;

        if (roleId) {
            id = roleId;
        }

        const response = await Role.findOne({
            where: { id: id }
        }).then( async (role) => {
            let response;

            if (role instanceof Role) {
                await role.update({ name: data.name });

                response = {
                    status: 200,
                    data : {
                        message: 'Le rôle ' + role.name + ' a été mis à jour !',
                        successful: true,
                        role: role,
                    },
                };
            }
            else {
                response = {
                    status: 404,
                    data : {
                        message: "Le rôle demandé n'a pas été mis à jour car il n'existe pas.",
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
                    message: "Un rôle possède déjà ce nom.",
                    error: e.message,
                    successful: false
                }
            };
        }
        
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la mise à jour du rôle demandé. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const del = async(id) => {
    try {
        const response = await Role.findOne({
            where: { id : id }
        }).then (async (role) => {
            let response;

            if (role instanceof Role) {
                role.destroy();

                response = {
                    status: 200,
                    data : {
                        message: 'Le rôle ' + role.name + ' a été supprimé !',
                        successful: true,
                    },
                };
            }
            else {
                response = {
                    status: 404,
                    data : {
                        message: "Le rôle demandé n'a pas été supprimé car il n'existe pas.",
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
                message: "Une erreur est survenue pendant la suppression d'un rôle. Veuillez réessayer.",
                error: e.message
            }
        };
    }
};

module.exports = {
    getCount,
    findAll,
    findOne,
    create,
    update,
    del,
    findPerPage,
}