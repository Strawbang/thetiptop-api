const { Model } = require ('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {

    class User extends Model{

        static associate(Role, Ticket, Token){
            User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id', otherKey: 'role_id' });
            User.hasMany(Ticket);
            User.hasMany(Token);
        }
    }
    
    User.init({
        facebook_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        google_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 50],
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 50],
            }
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate : {
                notEmpty: true,
                isDate: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true,
            },
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [8, 38],
            }
        },
        postcode: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: 5,
                isNumeric: true,
            },
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 45]
            }
         },
        newsletter: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            validate: {
                notEmpty: true,
            },
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'user',
    });

    User.beforeCreate(async (user, options) => {
        let date = new Date();
        
        date.setHours(0, 0, 0);
        date.setFullYear(date.getFullYear() - 18);
        
        if (date < new Date(user.birthdate)) {
            throw new Error("user_not_adult");
        }
      
        if (user.password.length < 8) {
            throw new Error("password_too_short");
        }

        const hashedPassword = bcrypt.hashSync(user.password, 8);
        user.password = hashedPassword;
    });

    User.beforeUpdate(async (user, options) => {
        let date = new Date();
        
        date.setHours(0, 0, 0);
        date.setFullYear(date.getFullYear() - 18);
        
        if (date < new Date(user.birthdate)) {
            throw new Error("user_not_adult");
        }

        if (user.password.length < 8) {
            throw new Error("password_too_short");
        }

        const hashedPassword = bcrypt.hashSync(user.password, 8);
        user.password = hashedPassword;
    });

    return User;
}