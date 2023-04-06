const { Model } = require ('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Ticket extends Model{
        static associate(User) {
            Ticket.belongsTo(User);
        }
    }

    Ticket.init({
        number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAlphanumeric: true,
            }
        },
        prize: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        printed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        sequelize,
        modelName: 'ticket',
    });

    return Ticket;
}