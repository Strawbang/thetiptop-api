const Sequelize = require('sequelize');
const config = require('../index');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const sequelize = new Sequelize(config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models
db.users = require('../../components/users/usersModel')(sequelize, Sequelize);
db.tickets = require('../../components/tickets/ticketsModel')(sequelize, Sequelize);
db.roles = require('../../components/roles/rolesModel')(sequelize, Sequelize);
db.tokens = require('../../components/tokens/tokensModel')(sequelize, Sequelize);
// db.clients = require('../../components/clients/clientsModel')(sequelize, Sequelize);

//Relations
db.roles.associate(db.users);
db.users.associate(db.roles, db.tickets, db.tokens);
// db.clients.associate(db.tickets, db.users);
db.tickets.associate(db.users);
db.tokens.associate(db.users);

module.exports = db;