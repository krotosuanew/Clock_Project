"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genDropTableCommand = exports.genCreateTableCommand = void 0;
const loadTemplates_1 = require("./loadTemplates");
const genCreateTableCommand = (tableName, columns) => {
    let modelText = '';
    for (const [k, v] of Object.entries(columns)) {
        let str = '';
        for (const [kk, vv] of Object.entries(v)) {
            str = `${str}${kk}:${typeof vv === 'object'
                ? JSON.stringify(vv)
                : kk !== 'onDelete' &&
                    kk !== 'onUpdate' &&
                    !(kk === 'unique' && typeof vv === 'string')
                    ? vv
                    : `'${vv}'`},`;
        }
        modelText = `${modelText}${k}:{${str}},`;
    }
    return loadTemplates_1.loadCreateTableTemplate()
        .replace('{tableName}', `'${tableName}'`)
        .replace('{tableProperties}', `{${modelText}}`);
};
exports.genCreateTableCommand = genCreateTableCommand;
const genDropTableCommand = (tableName) => {
    return loadTemplates_1.loadDropTableTemplate().replace('{tableName}', `'${tableName}'`);
};
exports.genDropTableCommand = genDropTableCommand;
