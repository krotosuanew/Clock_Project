"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRemoveUniqueConstraintsCommands = exports.genRemoveUniqueConstraintsCommand = exports.genAddUniqueContraintsCommands = exports.genAddUniqueConstraintCommand = void 0;
const parse_1 = require("./parse");
const loadTemplates_1 = require("./loadTemplates");
const genAddUniqueConstraintCommand = (tableName, uniqueConstraint) => {
    let str = '';
    for (const [k, v] of Object.entries(uniqueConstraint)) {
        if (!v) {
            continue;
        }
        if (Array.isArray(v)) {
            str = `${str}${k}:[${v
                .map((vv) => (typeof vv === 'string' ? `'${vv}'` : vv))
                .join(',')}],`;
            continue;
        }
        str = `${str}${parse_1.parseKeyValue(k, v)},`;
    }
    return loadTemplates_1.loadAddUniqueConstraints()
        .replace('{tableName}', `'${tableName}'`)
        .replace('{options}', `{${str}}`);
};
exports.genAddUniqueConstraintCommand = genAddUniqueConstraintCommand;
const genAddUniqueContraintsCommands = (tableName, constraints) => {
    const cmds = [];
    for (const constraint of Object.values(constraints)) {
        cmds.push(exports.genAddUniqueConstraintCommand(tableName, constraint));
    }
    return cmds;
};
exports.genAddUniqueContraintsCommands = genAddUniqueContraintsCommands;
const genRemoveUniqueConstraintsCommand = (tableName, constraintName) => {
    return loadTemplates_1.loadRemoveUniqueConstraints()
        .replace('{tableName}', `'${tableName}'`)
        .replace('{contraints}', `'${constraintName}'`);
};
exports.genRemoveUniqueConstraintsCommand = genRemoveUniqueConstraintsCommand;
const genRemoveUniqueConstraintsCommands = (tableName, keys) => {
    const commands = [];
    for (const key of Object.keys(keys)) {
        commands.push(exports.genRemoveUniqueConstraintsCommand(tableName, key));
    }
    return commands;
};
exports.genRemoveUniqueConstraintsCommands = genRemoveUniqueConstraintsCommands;
