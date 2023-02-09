"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genDownCommands = exports.genUpCommands = exports.generateMigrationCommands = void 0;
const genForeignKeysCommands_1 = require("./genForeignKeysCommands");
const genIndexesCommands_1 = require("./genIndexesCommands");
const genTableCommands_1 = require("./genTableCommands");
const genUniqueConstraintsCommands_1 = require("./genUniqueConstraintsCommands");
const generateMigrationCommands = (template, upCommands, downCommands) => {
    return template
        .replace(`{upCommands}`, `${upCommands.join(' ')}`)
        .replace(`{downCommands}`, `${downCommands.join(' ')}`);
};
exports.generateMigrationCommands = generateMigrationCommands;
const genUpCommands = (model) => {
    var _a;
    return [
        [genTableCommands_1.genCreateTableCommand(model.name, model.columns)],
        genForeignKeysCommands_1.genAddForeignKeysCommands(model.name, model.foreignKeys),
        genIndexesCommands_1.genAddIndexesCommands(model.name, (_a = model.options) === null || _a === void 0 ? void 0 : _a.underscored, model.indexes),
        genUniqueConstraintsCommands_1.genAddUniqueContraintsCommands(model.name, model.uniqueConstraints),
    ];
};
exports.genUpCommands = genUpCommands;
const genDownCommands = (model) => {
    return [
        genUniqueConstraintsCommands_1.genRemoveUniqueConstraintsCommands(model.name, model.uniqueConstraints),
        genForeignKeysCommands_1.genRemoveForeignKeysCommands(model.name, model.foreignKeys),
        genIndexesCommands_1.genRemoveIndexesCommands(model.name, model.indexes),
        [genTableCommands_1.genDropTableCommand(model.name)],
    ];
};
exports.genDownCommands = genDownCommands;
