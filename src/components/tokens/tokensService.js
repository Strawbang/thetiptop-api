const models = process.env.ENV === 'test' ?  require('../../config/models/modelAssociationMock') : require('../../config/models/modelAssociation')
const Token = models.tokens;
const User = models.users;

const findAll = async() => {
    try {
        const response = await Token.findAll().then(async (tokens) => {
            return {
                status: 200,
                data : {
                    tokens: tokens,
                    successful: true,
                },
            };
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération des tokens. Veuillez réessayer.",
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
        
        const response = await Token.findAndCountAll({
            offset: offset,
            limit: limit,
            order: [
                ['id', 'ASC']
            ],
        }).then(async (result) => {
            return {
                status: 200,
                data: {
                    tokens: result,
                    successful: true,
                },
            };            
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération des tokens. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        }
    }
};


const findOne = async(data) => {
    try {
        let whereStatement = {};

        if (parseInt(data.id) > 0) {
            whereStatement.id = parseInt(data.id);
        }

        if (data.userid !== undefined) {
            whereStatement.userId = parseInt(data.userid);
        }
        
        const response = await Token.findOne({
            where: whereStatement, 
        }).then(async (token) => {
            if (!(token instanceof Token)) {
                return {
                    status: 404,
                    data : {
                        message: "Ce token n'existe pas.",
                        successful: false,
                    },
                };
            }

            return {
                status: 200,
                data : {
                    token: token,
                    successful: true,
                },
            };
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                error: {
                    message: e.message,
                    text: "Une erreur est survenue lors de la récupération du token demandé. Veuillez réessayer.",
                    details: e.constructor.name,
                },
                successful: false,
            }
        };
    }
};


const create = async(data) => {
    try {
        const response = await Token.create({
            value: data.value,
            type: data.type,
            expiresAt: data.expiresAt,
            used: false,
        }).then( async (token) => {
            const user = await User.findOne({
                where: { id: data.userId }
            });

            token.setUser(user);

            return {
                status: 200,
                data: {
                    message: 'Le token a bien a été créé !',
                    successful: true,
                    token: token,
                }
            }
        });

        return response;
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return {
                status: 422,
                data: {
                    error: {
                        text: "Un token possède déjà cette valeur.",
                        message: e.message,
                        details: e.constructor.name,
                    },
                    successful: false
                }
            };
        }

        return {
            status: 400,
            data: {
                error: {
                    text: "Une erreur est survenue lors de la création du token. Veuillez réessayer.",
                    message: e.message,
                    details: e.constructor.name,
                },
                successful: false
            }
        };
    }
};

const update = async(tokenId, data) => {
    try {
        const response = await Token.findOne({
            where: { id: tokenId }
        }).then( async (token) => {
            if (token instanceof Token) {
                await token.update({ name: data.name });

                return {
                    status: 200,
                    data : {
                        message: 'Le token a été mis à jour !',
                        successful: true,
                        token: token,
                    },
                };
            }
            else {
                return {
                    status: 404,
                    data : {
                        error: {
                            text: "Ce token n'a pas été mis à jour car il n'existe pas.",
                            message: "nonexistent_token",
                            details: e.constructor.name,
                        },
                        successful: false,
                    },
                };
            }
        });

        return response;
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return {
                status: 422,
                data: {
                    error: {
                        text: "Un token possède déjà cette valeur.",
                        message: "existent_token",
                        details: e.constructor.name,
                    },
                    successful: false
                }
            };
        }
        
        return {
            status: 400,
            data: {
                error: {
                    text: "Une erreur est survenue lors de la mise à jour du token. Veuillez réessayer.",
                    message: e.message,
                    details: e.constructor.name,
                },
                successful: false,
            }
        };
    }
};


const del = async(id) => {
    try {
        const response = await Token.findOne({
            where: { id : id }
        }).then (async (token) => {
            if (token instanceof Token) {
                token.destroy();

                return {
                    status: 200,
                    data : {
                        message: 'Le token a été supprimé !',
                        successful: true,
                    },
                };
            }
            else {
                return {
                    status: 404,
                    data : {
                        error: {
                            text: "Le token demandé n'a pas été supprimé car il n'existe pas.",
                            message: "nonexistent_token",
                            details: e.constructor.name,
                        },
                        successful: false,
                    },
                };
            } 
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                error: {
                    text: "Une erreur est survenue pendant la suppression d'un token. Veuillez réessayer.",
                    message: e.message,
                    details: e.constructor.name,
                },
                successful: false,
            }
        };
    }
};

const consume = (_token) => {
    try {
        const response = Token.findOne({
            where: { value: _token, },
        }).then( async (token) => {
            if (token instanceof Token) {
                const user = await User.findOne({
                    where: { id: token.userId }
                });

                if (!(user instanceof User) || (user && user.active) ||
                token.used || (Date.now() > token.expiresAt)) {
                    let message, text;

                    if (!(user instanceof User)) {
                        text = 'Aucun compte ne correspond à ce token.';
                        message = 'user_not_found';
                    }
                    else if (user && user.active) {
                        text = 'Ce compte est déjà actif.';
                        message = 'account_already_active';
                    }
                    else if (token.used) {
                        text = 'Ce token a déjà été utilisé.';
                        message = 'token_already_used';
                    }
                    else if (Date.now() > token.expiresAt) {
                        text = 'Ce token a expiré.';
                        message = 'expired_token';
                    }

                    return {
                        status: 400,
                        data : {
                            error: {
                                message: message,
                                text: text,
                            },
                            successful: false,
                        },
                    };
                }

                await token.update({
                    used: true,
                });
                await User.update({
                        active: true,
                    },
                    { where: { id: token.userId },
                });

                return {
                    status: 200,
                    data : {
                        message: "Ce token a été consommé avec succès.",
                        successful: true,
                    },
                };
            }
            else {
                return {
                    status: 404,
                    data : {
                        error: {
                            text: "Ce token n'existe pas.",
                            message: "nonexistent_token",
                        },
                        successful: false,
                    },
                };
            }
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                error: {
                    text: "Une erreur est survenue pendant la tentative de consommation du token. Veuillez réessayer.",
                    message: e.message,
                    details: e.constructor.name,
                },
                successful: false,
            },
        };
    }
}
module.exports = {
    findAll,
    findOne,
    create,
    update,
    del,
    findPerPage,
    consume,
};
