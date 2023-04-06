const { Model } = require ('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Role extends Model{

        static associate(User){
            Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id', otherKey: 'user_id' });
        }
    }

    Role.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isAlpha: true,
            },
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'role',
    });

    return Role;
}