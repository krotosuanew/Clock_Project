"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.SizeClock = exports.Rating = exports.Customer = exports.Master = exports.Order = exports.City = exports.CitiesMasters = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const order_dto_1 = require("../dto/order.dto");
const global_1 = require("../dto/global");
class City extends sequelize_1.Model {
}
exports.City = City;
class CitiesMasters extends sequelize_1.Model {
}
exports.CitiesMasters = CitiesMasters;
class Customer extends sequelize_1.Model {
}
exports.Customer = Customer;
class Master extends sequelize_1.Model {
}
exports.Master = Master;
class Order extends sequelize_1.Model {
}
exports.Order = Order;
class Rating extends sequelize_1.Model {
}
exports.Rating = Rating;
class SizeClock extends sequelize_1.Model {
}
exports.SizeClock = SizeClock;
class User extends sequelize_1.Model {
}
exports.User = User;
CitiesMasters.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'cities_masters',
    modelName: 'cities_masters',
    sequelize: db_1.default,
    timestamps: false
});
City.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false,
        validate: { notEmpty: true }
    },
    price: { type: sequelize_1.DataTypes.INTEGER }
}, {
    tableName: 'cities',
    modelName: 'city',
    sequelize: db_1.default,
    timestamps: false
});
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    isActivated: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    role: { type: sequelize_1.DataTypes.ENUM(global_1.ROLES.ADMIN, global_1.ROLES.CUSTOMER, global_1.ROLES.MASTER), defaultValue: global_1.ROLES.CUSTOMER },
    activationLink: { type: sequelize_1.DataTypes.STRING },
    facebookId: { type: sequelize_1.DataTypes.BIGINT, unique: true, defaultValue: null }
}, {
    tableName: 'users',
    modelName: 'user',
    sequelize: db_1.default,
    timestamps: false
});
Customer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING, allowNull: false,
        validate: { notEmpty: true }
    },
}, {
    tableName: 'customers',
    modelName: 'customer',
    sequelize: db_1.default,
    timestamps: false
});
Master.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING, allowNull: false,
        validate: { notEmpty: true }
    },
    rating: {
        type: sequelize_1.DataTypes.DOUBLE, allowNull: false,
        validate: {
            min: 0,
            max: 5
        }, defaultValue: 0
    },
    isActivated: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'masters',
    modelName: 'master',
    sequelize: db_1.default,
    timestamps: false
});
SizeClock.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false,
        validate: { notEmpty: true }
    },
    date: { type: sequelize_1.DataTypes.TIME }
}, {
    tableName: 'sizeClocks',
    modelName: 'sizeClock',
    sequelize: db_1.default,
    timestamps: false
});
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 30]
        }
    },
    cityId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: City,
            key: 'id'
        }
    },
    time: { type: sequelize_1.DataTypes.DATE, },
    endTime: { type: sequelize_1.DataTypes.DATE },
    status: {
        type: sequelize_1.DataTypes.ENUM(order_dto_1.STATUS.WAITING, order_dto_1.STATUS.REJECTED, order_dto_1.STATUS.ACCEPTED, order_dto_1.STATUS.DONE),
        defaultValue: order_dto_1.STATUS.WAITING
    },
    price: { type: sequelize_1.DataTypes.INTEGER },
    ratingLink: { type: sequelize_1.DataTypes.STRING },
    photoLinks: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), defaultValue: null },
    payPalId: { type: sequelize_1.DataTypes.STRING, defaultValue: null },
}, {
    tableName: 'orders',
    modelName: 'order',
    sequelize: db_1.default,
    timestamps: false
});
Rating.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: sequelize_1.DataTypes.DOUBLE, allowNull: false,
        validate: {
            min: 0,
            max: 5
        }, defaultValue: 0
    },
    review: { type: sequelize_1.DataTypes.TEXT, allowNull: true }
}, {
    tableName: 'rating',
    modelName: 'rating',
    sequelize: db_1.default,
    timestamps: false
});
Master.hasMany(Order, {
    foreignKey: 'masterId'
});
Order.belongsTo(Master, {
    foreignKey: 'masterId'
});
Master.hasMany(Rating, { onDelete: 'CASCADE', foreignKey: 'masterId' });
Rating.belongsTo(Master, {
    foreignKey: 'masterId'
});
Master.belongsToMany(City, { through: CitiesMasters, foreignKey: 'cityId' });
City.belongsToMany(Master, { through: CitiesMasters, foreignKey: 'masterId' });
City.hasMany(Order, { foreignKey: 'cityId' });
Order.belongsTo(City, { foreignKey: 'cityId' });
User.hasOne(Rating, {
    foreignKey: 'userId'
});
Rating.belongsTo(User, {
    foreignKey: 'userId'
});
User.hasMany(Order, {
    foreignKey: 'userId'
});
Order.belongsTo(User, {
    foreignKey: 'userId'
});
User.hasOne(Customer, {
    foreignKey: 'userId'
});
Customer.belongsTo(User, {
    foreignKey: 'userId'
});
User.hasOne(Master, {
    onDelete: 'CASCADE', foreignKey: 'userId'
});
Master.belongsTo(User, { onDelete: 'CASCADE', foreignKey: 'userId' });
Order.hasOne(Rating, { onDelete: 'CASCADE', foreignKey: 'orderId' });
Rating.belongsTo(Order, {
    foreignKey: 'orderId'
});
SizeClock.hasMany(Order, {
    foreignKey: 'sizeClockId'
});
Order.belongsTo(SizeClock, {
    foreignKey: 'sizeClockId'
});
