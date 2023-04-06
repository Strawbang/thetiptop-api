var SequelizeMock = require('sequelize-mock');

var dbMock = new SequelizeMock();

const userModel = dbMock.define(
    'users',
    {},
    { autoQueryFallback: true }
);

userModel.$queryInterface.$useHandler(function(query, queryOptions, done) {
});

module.exports = userModel;