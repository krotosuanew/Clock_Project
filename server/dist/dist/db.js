"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPassword = exports.dbDriver = exports.dbPort = exports.dbHost = exports.dbUser = exports.dbName = void 0;
const cls_hooked_1 = __importDefault(require("cls-hooked"));
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("./config/config"));
const namespace = cls_hooked_1.default.createNamespace('my-namespace');
sequelize_1.Sequelize.useCLS(namespace);
const isTest = process.env.NODE_ENV === 'test';
exports.dbName = isTest ? config_1.default.test.database : config_1.default.development.database;
exports.dbUser = isTest ? config_1.default.test.username : config_1.default.development.username;
exports.dbHost = isTest ? config_1.default.test.host : config_1.default.development.host;
exports.dbPort = isTest ? Number(process.env.DB_TEST_PORT) : Number(process.env.DB_PORT);
exports.dbDriver = 'postgres';
exports.dbPassword = isTest ? config_1.default.test.password : config_1.default.development.password;
const sequelizeConnection = new sequelize_1.Sequelize(exports.dbName, exports.dbUser, exports.dbPassword, {
    host: exports.dbHost,
    port: exports.dbPort,
    dialect: exports.dbDriver,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});
exports.default = sequelizeConnection;
