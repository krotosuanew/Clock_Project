"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRemoveIndexesCommands = exports.genRemoveIndexCommand = exports.genAddIndexesCommands = exports.genAddIndexCommand = void 0;
const parse_1 = require("./parse");
const loadTemplates_1 = require("./loadTemplates");
const genAddIndexCommand = (tableName, isUnderscore, option) => {
    let str = '';
    for (const [k, v] of Object.entries(option)) {
        if (!v) {
            continue;
        }
        if (Array.isArray(v)) {
            str = `${str}${k}:[${v
                .map((vv) => vv.name
                ? `'${isUnderscore ? parse_1.camelToSnakeCase(vv.name) : vv.name}'`
                : `'${isUnderscore ? parse_1.camelToSnakeCase(vv) : vv}'`)
                .join(',')}],`;
            continue;
        }
        str = `${str}${parse_1.parseKeyValue(k, v)},`;
    }
    return loadTemplates_1.loadAddIndexTemplate()
        .replace('{tableName}', `'${tableName}'`)
        .replace('{options}', `{${str}}`);
};
exports.genAddIndexCommand = genAddIndexCommand;
const genAddIndexesCommands = (tableName, isUnderscore = false, options) => {
    let addIndexes = [];
    for (const option of Object.values(options)) {
        addIndexes.push(exports.genAddIndexCommand(tableName, isUnderscore, option));
    }
    return addIndexes;
};
exports.genAddIndexesCommands = genAddIndexesCommands;
const genRemoveIndexCommand = (tableName, idxName) => loadTemplates_1.loadRemoveIndexTemplate()
    .replace('{tableName}', `'${tableName}'`)
    .replace('{indexName}', `'${idxName}'`);
exports.genRemoveIndexCommand = genRemoveIndexCommand;
const genRemoveIndexesCommands = (tableName, options) => {
    const commands = [];
    for (const option of Object.values(options)) {
        commands.push(exports.genRemoveIndexCommand(tableName, option.name));
    }
    return commands;
};
exports.genRemoveIndexesCommands = genRemoveIndexesCommands;
