const ticketsService = require('./ticketsService');

const getCount = async (req, res) => {
    try {
        const response = await ticketsService.getCount(req.query);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const findAll = async (req, res) => {
    try {
        if (!req.role.includes('Admin') &&
        !req.role.includes('Employee')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour accéder à cette ressource." });
            return;
        }

        const response = await ticketsService.findAll();
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const findPerPage = async (req, res) => {
    try {
        if (!req.role.includes('Admin') && !req.role.includes('Employee')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour accéder à cette ressource." });
            return;
        }

        const response = await ticketsService.findPerPage(req.query);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const findOne = async (req, res) => {
    try {
        if (!req.role.includes('Admin') && !req.role.includes('Employee')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour accéder à cette ressource." });
            return;
        }

        const response = await ticketsService.findOne(req.query);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const getTicket = async (req, res) => {
    try {
        const response = await ticketsService.getTicket(req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

const create = async (req, res) => {
    try {
        if (!req.role.includes('Admin')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour créer un ticket." });
            return;
        }

        const response = await ticketsService.create(req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
};

const updateTicket = async (req, res) => {
    try {
        const response = await ticketsService.updateTicket(req.userId, req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const update = async (req, res) => {
    try {
        // if (!req.role.includes('Admin') && !req.role.includes('Employee')) {
        //     res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour mettre à jour ce ticket." });
        //     return;
        // }

        const response = await ticketsService.update(req.params.id, req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const del = async (req, res) => { // 'delete' is not allowed as variable name
    try {
        // if (!req.role.includes('Admin')) {
        //     res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour supprimer ce ticket." });
        //     return;
        // }

        const response = await ticketsService.del(req.params.id);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
};

const printTicket = async (req, res) => {
    try {
        if (!req.role.includes('Admin') && !req.role.includes('Checkout')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour imprimer ce ticket." });
            return;
        }

        const response = await ticketsService.printTicket();
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
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