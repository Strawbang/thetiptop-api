var SequelizeMock = require('sequelize-mock-v5');

var DBConnectionMock = new SequelizeMock();

const tokens = DBConnectionMock.define('token');

module.exports = tokens;