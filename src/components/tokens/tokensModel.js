const { Model } = require ('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Token extends Model {
        static associate(User){
            Token.belongsTo(User);
        }
    }

    Token.init({
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            unique: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAlpha: true,
            },
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            validate: {
                notEmpty: true,    
            },
            defaultValue: false,
        },  
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
                isDate: true,
            },
        },
    },
    {
        sequelize,
        modelName: 'token',
    });

    return Token;
};
