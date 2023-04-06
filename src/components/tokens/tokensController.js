const tokenService = require('./tokensService');

const findPerPage = async(req, res) => {
    try {
        if (!req.role.includes('Admin') && !req.role.includes('Employee')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour accéder à cette ressource." });
            return;
        }

        const response = await tokenService.findPerPage(req.query);
        await res.status(response.status).send(response.data);
    } catch(e) {
        return { message: e.message };
    }
}

const findAll = async(req, res) => {
    try {
        if (!req.role.includes('Admin') && !req.role.includes('Employee')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour accéder à cette ressource." });
            return;
        }

        const response = await tokenService.findPerPage(req.query);
        await res.status(response.status).send(response.data);
    } catch (e) {
        return { message: e.message };
    }
};

const findOne = async (req, res) => {
    try {
        if (!req.role.includes('Admin') && !req.role.includes('Employee')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour accéder à ce rôle." });
            return;
        }

        const response = await tokenService.findOne(req.query);
        await res.status(response.status).send(response.data);
    } catch (e) {
        return { message: e.message };
    }
};

const create = async (req, res) => {
    try {
        if (!req.role.includes('Admin')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour créer un token." });
            return;
        }

        const response = await tokenService.create(req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        return { message: e.message };
    }
};

const update = async (req, res) => {
    try {
        if (!req.role.includes('Admin')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour modifier un token." });
            return;
        }

        const response = await tokenService.update(req.params.id, req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        return { message: e.message };
    }
};

const del = async (req, res) => { // 'delete' is not allowed as variable name
    try {
        if (!req.role.includes('Admin')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour supprimer un token." });
            return;
        }

        const response = await tokenService.del(req.params.id);
        await res.status(response.status).send(response.data);
    } catch (e) {
        return { message: e.message };
    }
};

const consume = async (req, res) => {
    try {
        const response = await tokenService.consume(req.body.token);
        await res.status(response.status).send(response.data);
    } catch (e) {
        return { message: e.message };
    }
};

module.exports = {
    findAll,
    findOne,
    create,
    update,
    del,
    findPerPage,
    consume,
};
