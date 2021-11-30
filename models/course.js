'use strict'

const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Model {
    }

    Course.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please, enter a title for the course'
                },
                notEmpty: {
                    msg: 'Please provide a course title'
                },
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please, enter a course description'
                },
                notEmpty: {
                    msg: 'Please provide a course description'
                },
            },
        },
        estimatedTime: {
            type: DataTypes.STRING
        },
        materialsNeeded: {
            type: DataTypes.STRING
        }
    }, {sequelize});

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    };

    return Course;
}