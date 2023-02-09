"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnsAttribute = void 0;
const parseDataType_1 = require("./parseDataType");
const getColumnsAttribute = (modelAttribute) => {
    return {
        [modelAttribute.field]: parseDataType_1.extractColumns([
            'type',
            'allowNull',
            'unique',
            'primaryKey',
            'autoIncrement',
            'autoIncrementIdentity',
            'comment',
            'validate',
        ], modelAttribute),
    };
};
exports.getColumnsAttribute = getColumnsAttribute;
