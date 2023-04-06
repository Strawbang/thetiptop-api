var SequelizeMock = require('sequelize-mock');

var DBConnectionMock = new SequelizeMock();

const roleMock = DBConnectionMock.define(
    'roles',
    {},
    { autoQueryFallback: false }
);
module.exports = roleMock;