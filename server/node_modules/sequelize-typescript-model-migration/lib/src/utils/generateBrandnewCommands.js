"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBrandnewCommands = void 0;
const genCommands_1 = require("./genCommands");
const generateBrandnewCommands = (models, [migrationTpl]) => {
    const createTableCommands = [];
    const createIndexesCommands = [];
    const addForeignKeyCmdsCommands = [];
    const addUniqueConstraintsCommands = [];
    const dropTableCommands = [];
    const removeIndexesCommands = [];
    const removeForeignKeyCommands = [];
    const removeUniqueConstraintsCommands = [];
    for (const model of Object.values(models)) {
        const [createTableCmd, addForeignKeyCmds, createIndexesCmds, uniqueConstraintsCmds,] = genCommands_1.genUpCommands(model);
        createTableCommands.push(...createTableCmd);
        createIndexesCommands.push(...createIndexesCmds);
        addForeignKeyCmdsCommands.push(...addForeignKeyCmds);
        addUniqueConstraintsCommands.push(...uniqueConstraintsCmds);
        const [removeUniqueConstraintsCmds, removeForeignKeyCmds, removeIndexesCmd, dropTableCmds,] = genCommands_1.genDownCommands(model);
        removeUniqueConstraintsCommands.push(...removeUniqueConstraintsCmds);
        dropTableCommands.push(...dropTableCmds);
        removeIndexesCommands.push(...removeIndexesCmd);
        removeForeignKeyCommands.push(...removeForeignKeyCmds);
    }
    return genCommands_1.generateMigrationCommands(migrationTpl, [
        ...createTableCommands,
        ...addForeignKeyCmdsCommands,
        ...createIndexesCommands,
        ...addUniqueConstraintsCommands,
    ], [
        ...removeUniqueConstraintsCommands,
        ...removeForeignKeyCommands,
        ...removeIndexesCommands,
        ...dropTableCommands,
    ]);
};
exports.generateBrandnewCommands = generateBrandnewCommands;
