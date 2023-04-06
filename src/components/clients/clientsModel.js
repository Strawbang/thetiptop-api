const { Model } = require ('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Client extends Model{
        static associate(Ticket, User) {
            Client.hasMany(Ticket);
            Client.hasOne(User, { foreignKey: 'client_id' })
        }
    }

    Client.init({
        address: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
        postcode: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
        city: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
        newsletter: { type: DataTypes.BOOLEAN, allowNull: false, validate: { notEmpty: true } },
    },
    {
        sequelize,
        modelName: 'client',
    });

    return Client;
}