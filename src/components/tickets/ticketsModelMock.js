var SequelizeMock = require('sequelize-mock');

var DBConnectionMock = new SequelizeMock();

const ticketMock = DBConnectionMock.define(
    'tickets',
    {},
    { autoQueryFallback: false }
);

module.exports = ticketMock;