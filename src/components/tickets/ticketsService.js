const { Op, where } = require('sequelize');
const models = process.env.ENV === 'test' ?  require('../../config/models/modelAssociationMock') : require('../../config/models/modelAssociation')

const Ticket = models.tickets;
const User = models.users;
const mailService = require('../mail/mailService');
const Sequelize = require('sequelize');
const elasticsearch = require('../elastichsearch');

const getCount = async(data) => {
    try {
        let whereStatement = {};
        
        if (typeof data.printed !== "undefined") {
            whereStatement.printed = data.printed;
        }

        if (typeof data.claimed !== "undefined") {
            if (data.claimed == 1) {
                whereStatement.userId = {
                    [Op.ne]: null // not null
                }
            }
            else {
                whereStatement.userId = null;
            }
        }

        const response = await Ticket.count({
            where : whereStatement
        }).then( (count) => {
            return {
                status: 200,
                data: {
                    count: count,
                    successful: true,
                },
            };

        });

        return response;
    } catch (e) {
        console.log(e);
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération du nombre de tickets. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const findAll = async () => {
    try {
        const response = await Ticket.findAll({
        }).then(async (tickets) => {
            return {
                status: 200,
                data: {
                    tickets: tickets,
                    successful: true,
                },
            };
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération des tickets. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        }
    }
};

const findPerPage = async (data) => {
    try {
        let offset = data.offset === undefined ? 0 : parseInt(data.offset),
            limit = data.limit === undefined ? 20 : parseInt(data.limit),
            whereStatement = {};

        if (typeof data.printed !== "undefined") {
            whereStatement.printed = data.printed;
        }

        if (typeof data.claimed !== "undefined") {
            if (data.claimed == 1) {
                whereStatement.userId = {
                    [Op.ne]: null // not null
                }
            }
            else {
                whereStatement.userId = null;
            }
        }
        
        const response = await Ticket.findAndCountAll({
            where: whereStatement,
            offset: offset,
            limit: limit,
            order: [
                ['id', 'ASC']
            ],
        }).then(async (result) => {
            let response = {
                status: 200,
                data: {
                    tickets: result,
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
                message: "Une erreur est survenue lors de la récupération des tickets. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        }
    }
};

const findOne = async (data) => {
    try {
        let whereStatement = {};
        let order = [];

        if (parseInt(data.id) > 0) {
            whereStatement.id = data.id;
        }

        if (data.userid !== undefined) {
            if (parseInt(data.userid) === 0) {
                whereStatement.userId = null;
            }
            else if (parseInt(data.userid) === 1) {
                whereStatement.userId = {
                    [Op.ne]: null,
                };
            }
        }

        if (data.printed !== undefined) {
            if (parseInt(data.printed) === 0) {
                whereStatement.printed = false;
            }
            else if (parseInt(data.printed) === 1) {
                whereStatement.printed = true;
            }
        }

        if (data.rand !== undefined) {
            if (parseInt(data.rand) === 1) {
                order = [
                    Sequelize.literal('RAND()'),
                ];
            }
        }

        const response = await Ticket.findOne({
            where: whereStatement,
            include: User,
            order: order,
        }).then( (ticket) => {
            let response;

            if ( !(ticket instanceof Ticket) ) {
                response = {
                    status: 404,
                    data: {
                        message: "Le ticket demandé n'existe pas.",
                        successful: false,
                    }
                };
            }
            else {
                response = {
                    status: 200,
                    data: {
                        ticket: ticket,
                        successful: true,
                    }
                };
            }
            
            return response;
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la récupération du ticket demandé. Veuillez réessayer."
            }
        }
    }
};

const getTicket = async(data) => {
    try {
        const response = await Ticket.findOne({
            where: {number: data.number}
        }).then(async (ticket) => {
            if (!ticket) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('getticket.nonexistent', `Ce ticket n'existe pas. ${data.number}`, 404)
                }

                return { status: 404, data: { message: "Ce ticket n'existe pas.", successful: false } };
            }
            else if(ticket.userId != null) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('getticket.claimed', `Ce ticket a déjà été validé. ${data.number}`, 401)
                }

                return { status: 401, data: { message: 'Ce ticket a déjà été validé.', successful: false } };
            }
            else if (!ticket.printed) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('getticket.notprinted', `Ce ticket est invalide. ${data.number}`, 400)
                }

                return { status: 400, data: { message: 'Ce ticket est invalide.', successful: false } };
            }
            
            if (process.env.ENV === 'production') {
                elasticsearch.run('getticket.success', `Ticket validé. ${data.number}`, 200)
            }

            return {
                status: 200,
                data: {
                    ticket,
                    successful: true
                }
            };
        });
        return response;
    } catch (e) {
        if (process.env.ENV === 'production') {
            elasticsearch.run('getticket.error', `Une erreur inattendue est survenue. Veuillez réessayer. ${e.message}`)
        }

        return { status: 400, data: { message: "Une erreur inattendue est survenue. Veuillez réessayer.", successful: false, error: e.message } };
    }
}

const create = async (data) => {
    try {
        const response = await Ticket.create(data).then( (ticket) => {
            return {
                status: 200,
                data: {
                    message: "Le ticket a bien été créé !",
                    successful: true,
                    ticket: ticket,
                }
            };
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la création d'un ticket. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
}

const updateTicket = async(userId, data) => {
    try {
        let id;
        if(userId){
            id = userId;
        }
        else{
            id = data.userId;
        }
        
        const response = await Ticket.findOne({
            where: {number: data.number}
        }).then(async (ticket) => {
            if ( !(ticket instanceof Ticket) ) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('updateticket.unexisted', `Ce ticket n'a pas pu être assigné car il n'existe pas. ${data.number} user: ${id}`, 404)
                }

                return {
                    status: 404,
                    data: {
                        text: "Ce ticket n'a pas pu être assigné car il n'existe pas.",
                        message: "nonexistent_ticket",
                        successful: false,
                    }
                }
            }
            else if (ticket.userId) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('updateticket.used', `Ce ticket n'a pas pu être assigné car il a déjà été validé par un autre utilisateur. ${data.number} user: ${id}`, 403)
                }

                return {
                    status: 403,
                    data: {
                        text: "Ce ticket n'a pas pu être assigné car il a déjà été validé par un autre utilisateur.",
                        message: "ticket_already_used",
                        successful: false,
                    }
                }
            }
            else if (!ticket.printed) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('updateticket.notprinted', `Ce numéro de ticket est invalide. ${data.number} user: ${id}`, 403)
                }

                return {
                    status: 403,
                    data: {
                        text: "Ce numéro de ticket est invalide.",
                        message: "ticket_not_printed",
                        successful: false,
                    }
                }
            }
            
            await ticket.update({userId: id});
            
            const user = await User.findOne({ where: { id: id } });
            
            if (!(user instanceof User)) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('updateticket.usernotfound', `Cet utilisateur n'existe pas. ${id}`, 404)
                }

                return {
                    status: 404,
                    data: {
                        text: "Cet utilisateur n'existe pas.",
                        message: "user_not_found",
                        successful: false,
                    },
                }
            }

            const confEmail = await mailService.sendWelcomeMail(user);

            if (!confEmail) {
                if (process.env.ENV === 'production') {
                    elasticsearch.run('updateticket.emailnotsend', `Le ticket a bien été mis à jour mais le mail de bienvenue n'a pas été envoyé. ${data.number} user:${id}`, 200)
                }

                return {
                    status: 200,
                    data: {
                        text: "Le ticket a bien été mis à jour mais le mail de bienvenue n'a pas été envoyé.",
                        message: 'success_but_welcome_mail_not_delivered',
                        successful: true,
                    },
                }
            }

            if (process.env.ENV === 'production') {
                elasticsearch.run('updateticket.success', `Le ticket a été mis à jour avec succès. ${data.number} user:${id}`, 200)
            }

            return {
                status: 200,
                data : {
                    text: "Le ticket a été mis à jour avec succès.",
                    successful: true
                }
            };
        });
        return response;
    } catch (e) {
        if (process.env.ENV === 'production') {
            elasticsearch.run('updateticket.fail', `Une erreur inattendue est survenue lors de la tentative de mise à jour du ticket. Veuillez réessayer. ${e.message}`, 400)
        }

        return {
            status: 400,
            data: {
                text: "Une erreur inattendue est survenue lors de la tentative de mise à jour du ticket. Veuillez réessayer.",
                message: e.message,
                successful: false
            }
        };
    }
};

const update = async(id, data) => {
    try {
        const response = await Ticket.findOne({
            where: {id: id}
        }).then(async (ticket) => {
            if ( !(ticket instanceof Ticket) ) {
                return {
                    status: 404,
                    data: {
                        message: "La mise à jour du ticket demandée a échouée car ce ticket n'existe pas.",
                        successful: false,
                    }
                }
            }

            ticket.update(data);
            return {
                status: 200,
                data : {
                    ticket: ticket,
                    successful: true,
                },
            };
        });

        return response;
    } catch (e) {
        return {
            status: 400,
            data: {
                message: "Une erreur est survenue lors de la mise à jour du ticket demandé. Veuillez réessayer.",
                error: e.message,
                successful: false,
            }
        };
    }
};

const del = async (id) => {
    try {
        const response = await Ticket.findOne({ where: { id: id } }).then(async (ticket) => {
            if ( !(ticket instanceof Ticket) ) {
                return {
                    status: 404,
                    data: {
                        message: "La suppression de ce ticket a échoué car ce ticket n'existe pas.",
                        successful: false,
                    }
                };
            }
    
            await ticket.destroy();
    
            return  {
                status: 200,
                data: {
                    message: "Le ticket demandé a bien été supprimé.",
                    successful: true,
                }
            };
        });
        
        return response;
    } catch (e) {
        return {
            status: 400,
            message: "Une erreur est survenue lors de la suppression du ticket demandé. Veuillez réesayer.",
            error: e.message,
            successful: false,
        }
    }
};

const printTicket = async () => {
    try {
        const response = await Ticket.findOne({
            where: {
                printed: false,
                userId: null,
            },
            order: [
                Sequelize.literal('RAND()'),
            ],
        }).then(async (ticket) => {
            if (!(ticket instanceof Ticket)) {
                return {
                    status: 404,
                    data: {
                        error: {
                            text: "Ce ticket n'existe pas.",
                            message: "ticket_not_found",
                        },
                        successful: false,
                    },
                };
            }

            await ticket.update({ printed: true });
            
            if (process.env.ENV === 'production') {
                elasticsearch.run('printticket.success', `Iicket ${ticket.number} imprimé.`, 200)
            }

            return {
                status: 200,
                data: {
                    ticket: ticket,
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
                    text: "Une erreur est survenue lors de la tentative d'impression du ticket.",
                    message: e.message,
                },
                successful: false,
            },
        }
    }
};

module.exports = {
    getCount,
    findAll,
    findPerPage,
    findOne,
    getTicket,
    create,
    updateTicket,
    update,
    del,
    printTicket,
}