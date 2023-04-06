const db = {};

db.tickets = require('../../components/tickets/ticketsModelMock');
db.users = require('../../components/users/usersModelMock');
db.roles = require('../../components/roles/rolesModelMock');
db.tokens = require('../../components/tokens/tokensModelMock');
const mockData = require('./mockData');

db.users.belongsToMany(db.roles, { through: 'user_roles', foreignKey: 'user_id', otherKey: 'role_id' })
db.users.hasMany(db.tickets);
db.users.hasMany(db.tokens);
db.roles.belongsToMany(db.users, { through: 'user_roles', foreignKey: 'role_id', otherKey: 'user_id' })
db.tickets.belongsTo(db.users);
db.tokens.belongsTo(db.users);

mockData.loadData();

module.exports = db;