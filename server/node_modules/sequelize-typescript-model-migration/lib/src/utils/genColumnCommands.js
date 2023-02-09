"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRemoveColumnCommand = exports.genAddColumnCommand = void 0;
const loadTemplates_1 = require("./loadTemplates");
const parse_1 = require("./parse");
const genAddColumnCommand = (tableName, columnName, attribute) => {
    return loadTemplates_1.loadAddColumnTemplate()
        .replace('{tableName}', `'${tableName}'`)
        .replace('{column}', `'${columnName}'`)
        .replace('{attribute}', parse_1.parseObject(attribute));
};
exports.genAddColumnCommand = genAddColumnCommand;
const genRemoveColumnCommand = (tableName, columnName) => {
    return loadTemplates_1.loadRemoveColumnTemplate()
        .replace('{tableName}', `'${tableName}'`)
        .replace('{column}', `'${columnName}'`);
};
exports.genRemoveColumnCommand = genRemoveColumnCommand;
