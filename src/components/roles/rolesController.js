const roleService = require('./rolesService');

const getCount = async (req, res) => {
    try {
        const response = await roleService.getCount();
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

        const response = await roleService.findPerPage(req.query);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const findAll = async (req, res) => {
    try {
        if (!req.role.includes('Admin') && !req.role.includes('Employee')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour accéder à cette ressource." });
            return;
        }

        const response = await roleService.findAll();
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const findOne = async (req, res) => {
    try {
        if (!req.role.includes('Admin') && !req.role.includes('Employee')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour accéder à ce rôle." });
            return;
        }

        const response = await roleService.findOne(req.query.id);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const create = async (req, res) => {
    try {
        if (!req.role.includes('Admin')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour créer un rôle." });
            return;
        }

        const response = await roleService.create(req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
};

const update = async (req, res) => {
    try {
        if (!req.role.includes('Admin')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour modifier un rôle." });
            return;
        }

        const response = await roleService.update(req.params.id, req.body);
        await res.status(response.status).send(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

const del = async (req, res) => { // 'delete' is not allowed as variable name
    try {
        if (!req.role.includes('Admin')) {
            res.status(403).send({ message: "Vous n'avez pas les droits nécessaires pour supprimer un rôle." });
            return;
        }

        const response = await roleService.del(req.params.id);
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
    findOne,
    create,
    update,
    del,
    findPerPage,
};
