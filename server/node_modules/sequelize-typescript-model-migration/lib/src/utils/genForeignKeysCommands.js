"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRemoveForeignKeysCommands = exports.genRemoveForeignKeyCommand = exports.genAddForeignKeysCommands = exports.genAddForeignKeyCommand = void 0;
const parse_1 = require("./parse");
const loadTemplates_1 = require("./loadTemplates");
const genAddForeignKeyCommand = (tableName, key) => {
    return loadTemplates_1.loadAddForeignKeysTemplate()
        .replace('{tableName}', `'${tableName}'`)
        .replace('{options}', `${parse_1.parseObject(key)}`);
};
exports.genAddForeignKeyCommand = genAddForeignKeyCommand;
const genAddForeignKeysCommands = (tableName, keys) => {
    const commands = [];
    for (const key of Object.values(keys)) {
        commands.push(exports.genAddForeignKeyCommand(tableName, key));
    }
    return commands;
};
exports.genAddForeignKeysCommands = genAddForeignKeysCommands;
const genRemoveForeignKeyCommand = (tableName, key) => loadTemplates_1.loadRemoveForeignKeysTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{foreignKey}', `'${key}'`);
exports.genRemoveForeignKeyCommand = genRemoveForeignKeyCommand;
const genRemoveForeignKeysCommands = (tableName, keys) => {
    const commands = [];
    for (const key of Object.keys(keys)) {
        commands.push(exports.genRemoveForeignKeyCommand(tableName, key));
    }
    return commands;
};
exports.genRemoveForeignKeysCommands = genRemoveForeignKeysCommands;
