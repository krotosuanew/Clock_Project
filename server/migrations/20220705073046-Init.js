'use strict';
const sequelizeConnection = require("../dist/db");
const {ROLES} = require("../dist/dto/global");
const {STATUS} = require("../dist/dto/order.dto");

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cities', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING, unique: true, allowNull: false,
                    validate: {notEmpty: true}
                },
                price: {type: Sequelize.INTEGER}
            },
            {
                tableName: 'cities',
                modelName: 'city',
                sequelize: sequelizeConnection,
                timestamps: false
            });
        await queryInterface.createTable('users', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                email: {
                    type: Sequelize.STRING, unique: true, allowNull: false,
                    validate: {
                        isEmail: true,
                    }
                },
                password: {
                    type: Sequelize.STRING,
                },
                isActivated: {type: Sequelize.BOOLEAN, defaultValue: false},
                role: {type: Sequelize.ENUM(ROLES.ADMIN, ROLES.CUSTOMER, ROLES.MASTER), defaultValue: ROLES.CUSTOMER},
                activationLink: {type: Sequelize.STRING}
            },
            {
                tableName: 'users',
                modelName: 'user',
                sequelize: sequelizeConnection,
                timestamps: false
            })
        await queryInterface.createTable('masters', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING, allowNull: false,
                    validate: {notEmpty: true,}
                },
                rating: {
                    type: Sequelize.DOUBLE, allowNull: false,
                    validate: {
                        min: 0,
                        max: 5
                    }, defaultValue: 0
                },
                userId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'users',
                        key: 'id',
                        as: 'userId',
                    }
                },
                isActivated: {type: Sequelize.BOOLEAN, defaultValue: false}
            },
            {
                tableName: 'masters',
                modelName: 'master',
                sequelize: sequelizeConnection,
                timestamps: false
            });
        await queryInterface.createTable('cities_masters', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                cityId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    primaryKey: true,
                },
                masterId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    primaryKey: true,
                }
            },
            {
                tableName: 'cities_masters',
                modelName: 'cities_masters',
                sequelize: sequelizeConnection,
                timestamps: false
            });
        await queryInterface.createTable('customers', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING, allowNull: false,
                    validate: {notEmpty: true}
                },
                userId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'users',
                        key: 'id',
                        as: 'userId',
                    }
                }
            },
            {
                tableName: 'customers',
                modelName: 'customer',
                sequelize: sequelizeConnection,
                timestamps: false
            })
        await queryInterface.createTable('sizeClocks', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING, unique: true, allowNull: false,
                    validate: {notEmpty: true}
                },
                date: {type: Sequelize.TIME}
            },
            {
                tableName: 'sizeClocks',
                modelName: 'sizeClock',
                sequelize: sequelizeConnection,
                timestamps: false
            })

        await queryInterface.createTable('orders', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull:false,
                    validate: {
                        notEmpty: true,
                        len: [3, 30]
                    }
                },
                cityId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'cities',
                        key: 'id',
                        as: 'cityId',
                    }
                },
                masterId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'masters',
                        key: 'id',
                        as: 'masterId',
                    }
                },
                sizeClockId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'sizeClocks',
                        key: 'id',
                        as: 'sizeClockId',
                    }
                },
                userId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'users',
                        key: 'id',
                        as: 'userId',
                    }
                },
                time: {type: Sequelize.DATE,},
                endTime: {type: Sequelize.DATE},
                status: {
                    type: Sequelize.ENUM(STATUS.WAITING, STATUS.REJECTED, STATUS.ACCEPTED, STATUS.DONE),
                    defaultValue: STATUS.WAITING
                },
                price: {type: Sequelize.INTEGER},
                ratingLink: {type: Sequelize.STRING}
            },
            {
                tableName: 'orders',
                modelName: 'order',
                sequelize: sequelizeConnection,
                timestamps: false
            })
        await queryInterface.createTable('rating', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                rating: {
                    type: Sequelize.DOUBLE, allowNull: false,
                    validate: {
                        min: 0,
                        max: 5
                    }, defaultValue: 0
                }, masterId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'masters',
                        key: 'id',
                        as: 'masterId',
                    }
                },
                orderId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'orders',
                        key: 'id',
                        as: 'orderId',
                    }
                },
                userId: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'users',
                        key: 'id',
                        as: 'userId',
                    }
                },
                review: {type: Sequelize.TEXT, allowNull: true}
            },
            {
                tableName: 'rating',
                modelName: 'rating',
                sequelize: sequelizeConnection,
                timestamps: false
            })
    },
    down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.dropAllTables()
            ]);
        });
    }
};