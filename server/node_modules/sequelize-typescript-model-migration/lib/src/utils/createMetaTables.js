"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetaTable = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const createMetaTable = (sequelize) => {
    const queryInterface = sequelize.getQueryInterface();
    return queryInterface.createTable('SequelizeMeta', {
        name: sequelize_typescript_1.DataType.STRING,
    });
};
exports.createMetaTable = createMetaTable;
