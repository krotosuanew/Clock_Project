"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChangesCommands = exports.orderCommands = void 0;
const deep_diff_1 = require("deep-diff");
const createSnapshot_1 = require("./createSnapshot");
const genColumnCommands_1 = require("./genColumnCommands");
const genCommands_1 = require("./genCommands");
const genForeignKeysCommands_1 = require("./genForeignKeysCommands");
const genIndexesCommands_1 = require("./genIndexesCommands");
const genTableCommands_1 = require("./genTableCommands");
const loadTemplates_1 = require("./loadTemplates");
const orderCommands = (commands = []) => commands
    .sort((a, b) => a.order - b.order)
    .map((v) => v.cmds)
    .reduce((prev, curr) => {
    prev.push(...curr);
    return prev;
}, []);
exports.orderCommands = orderCommands;
const generateChangesCommands = (prevState, curState) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const difference = deep_diff_1.diff(prevState, createSnapshot_1.sanitizeModelsFields(curState));
    if (!difference) {
        return '';
    }
    const upCommands = [];
    const downCommands = [];
    for (const dif of difference) {
        if (dif.rhs === undefined &&
            dif.lhs === undefined &&
            dif.item === undefined) {
            continue;
        }
        switch (dif.kind) {
            case 'N':
                if (dif.path.length === 1) {
                    const model = dif.rhs;
                    upCommands.push({
                        order: 0,
                        cmds: [genTableCommands_1.genCreateTableCommand(model.name, model.columns)],
                    });
                    upCommands.push({
                        order: 2,
                        cmds: genForeignKeysCommands_1.genAddForeignKeysCommands(model.name, createSnapshot_1.revertSanitizeFields(model.foreignKeys)),
                    });
                    upCommands.push({
                        order: 3,
                        cmds: genIndexesCommands_1.genAddIndexesCommands(model.name, (_a = model.options) === null || _a === void 0 ? void 0 : _a.underscored, createSnapshot_1.revertSanitizeFields(model.indexes)),
                    });
                    downCommands.push({
                        order: 0,
                        cmds: genForeignKeysCommands_1.genRemoveForeignKeysCommands(model.name, createSnapshot_1.revertSanitizeFields(model.foreignKeys)),
                    });
                    downCommands.push({
                        order: 1,
                        cmds: genIndexesCommands_1.genRemoveIndexesCommands(model.name, createSnapshot_1.revertSanitizeFields(model.indexes)),
                    });
                    downCommands.push({
                        order: 3,
                        cmds: [genTableCommands_1.genDropTableCommand(model.name)],
                    });
                    break;
                }
                if (dif.path.length > 1 && dif.path[1] === 'columns') {
                    upCommands.push({
                        order: 1,
                        cmds: [genColumnCommands_1.genAddColumnCommand(dif.path[0], dif.path[2], dif.rhs)],
                    });
                    downCommands.push({
                        order: 2,
                        cmds: [genColumnCommands_1.genRemoveColumnCommand(dif.path[0], dif.path[2])],
                    });
                    break;
                }
                if (dif.path.length > 1 && dif.path[1] === 'indexes') {
                    dif.rhs.fields = dif.rhs.fields
                        ? createSnapshot_1.convertObjectToArray(dif.rhs.fields)
                        : [];
                    upCommands.push({
                        order: 3,
                        cmds: [
                            genIndexesCommands_1.genAddIndexCommand(dif.path[0], !!((_b = curState[dif.path[0]].options) === null || _b === void 0 ? void 0 : _b.underscored), dif.rhs),
                        ],
                    });
                    downCommands.push({
                        order: 1,
                        cmds: [genIndexesCommands_1.genRemoveIndexCommand(dif.path[0], dif.rhs.name)],
                    });
                    break;
                }
                if (dif.path.length > 1 && dif.path[1] === 'foreignKeys') {
                    upCommands.push({
                        order: 2,
                        cmds: [genForeignKeysCommands_1.genAddForeignKeyCommand(dif.path[0], dif.rhs)],
                    });
                    downCommands.push({
                        order: 0,
                        cmds: [genForeignKeysCommands_1.genRemoveForeignKeyCommand(dif.path[0], dif.rhs.name)],
                    });
                }
                break;
            case 'D':
                if (dif.path.length === 1) {
                    upCommands.push({
                        order: 4,
                        cmds: genForeignKeysCommands_1.genRemoveForeignKeysCommands(dif.path[0], dif.lhs.foreignKeys),
                    });
                    upCommands.push({
                        order: 5,
                        cmds: genIndexesCommands_1.genRemoveIndexesCommands(dif.path[0], dif.lhs.indexes),
                    });
                    upCommands.push({
                        order: 7,
                        cmds: [genTableCommands_1.genDropTableCommand(dif.path[0])],
                    });
                    downCommands.push({
                        order: 2,
                        cmds: genForeignKeysCommands_1.genAddForeignKeysCommands(dif.path[0], createSnapshot_1.revertSanitizeFields(dif.lhs.foreignKeys)),
                    });
                    downCommands.push({
                        order: 3,
                        cmds: genIndexesCommands_1.genAddIndexesCommands(dif.path[0], !!((_d = (_c = prevState[dif.path[0]]) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.underscored), createSnapshot_1.revertSanitizeFields(dif.lhs.indexes)),
                    });
                    downCommands.push({
                        order: 0,
                        cmds: [genTableCommands_1.genCreateTableCommand(dif.path[0], dif.lhs.columns)],
                    });
                    break;
                }
                if (dif.path.length > 1 && dif.path[1] === 'indexes') {
                    upCommands.push({
                        order: 5,
                        cmds: [genIndexesCommands_1.genRemoveIndexCommand(dif.path[0], dif.path[2])],
                    });
                    downCommands.push({
                        order: 3,
                        cmds: [
                            genIndexesCommands_1.genAddIndexCommand(dif.path[0], !((_e = prevState[dif.path[0]].options) === null || _e === void 0 ? void 0 : _e.underscored), createSnapshot_1.revertSanitizeFields({
                                [dif.path[2]]: prevState[dif.path[0]].indexes[dif.path[2]],
                            })),
                        ],
                    });
                    break;
                }
                if (dif.path.length > 1 && dif.path[1] === 'columns') {
                    upCommands.push({
                        order: 6,
                        cmds: [genColumnCommands_1.genRemoveColumnCommand(dif.path[0], dif.path[2])],
                    });
                    downCommands.push({
                        order: 1,
                        cmds: [genColumnCommands_1.genAddColumnCommand(dif.path[0], dif.path[2], dif.lhs)],
                    });
                    break;
                }
                if (dif.path.length > 1 && dif.path[1] === 'foreignKeys') {
                    upCommands.push({
                        order: 4,
                        cmds: [genForeignKeysCommands_1.genRemoveForeignKeyCommand(dif.path[0], dif.path[2])],
                    });
                    downCommands.push({
                        order: 2,
                        cmds: [
                            genForeignKeysCommands_1.genAddForeignKeyCommand(dif.path[0], createSnapshot_1.revertSanitizeFields({ [dif.lhs.name]: dif.lhs })),
                        ],
                    });
                    break;
                }
                break;
            case 'E':
                if (dif.path.length > 1 && dif.path[1] === 'indexes') {
                    upCommands.push({
                        order: 5,
                        cmds: [genIndexesCommands_1.genRemoveIndexCommand(dif.path[0], dif.path[2])],
                    }, {
                        order: 3,
                        cmds: [
                            genIndexesCommands_1.genAddIndexCommand(dif.path[0], !((_f = curState[dif.path[0]].options) === null || _f === void 0 ? void 0 : _f.underscored), createSnapshot_1.revertSanitizeFields({
                                [dif.path[2]]: curState[dif.path[0]].indexes[dif.path[2]],
                            })),
                        ],
                    });
                    downCommands.push({
                        order: 5,
                        cmds: [genIndexesCommands_1.genRemoveIndexCommand(dif.path[0], dif.path[2])],
                    }, {
                        order: 3,
                        cmds: [
                            genIndexesCommands_1.genAddIndexCommand(dif.path[0], !((_g = curState[dif.path[0]].options) === null || _g === void 0 ? void 0 : _g.underscored), createSnapshot_1.revertSanitizeFields({
                                [dif.path[2]]: prevState[dif.path[0]].indexes[dif.path[2]],
                            })),
                        ],
                    });
                }
                break;
        }
    }
    return genCommands_1.generateMigrationCommands(loadTemplates_1.loadMigrationTemplate(), exports.orderCommands(upCommands), exports.orderCommands(downCommands));
};
exports.generateChangesCommands = generateChangesCommands;
