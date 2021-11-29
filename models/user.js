'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A First Name is Required'
                },
                notEmpty: {
                    msg: 'Please provide a first name'
                },
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A Last Name is Required'
                },
                notEmpty: {
                    msg: 'Please provide a Last Name'
                },
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
                notNull: {
                    msg: 'An email address is required'
                },
                notEmpty: {
                    msg: 'Please provide an email address'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 8,
                max: 20,
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                }
            }
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    };

    return User;
}