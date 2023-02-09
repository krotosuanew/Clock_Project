"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractModels = exports.sanitizeModels = void 0;
const getColumnsAttribute_1 = require("./getColumnsAttribute");
const getForeignKey_1 = require("./getForeignKey");
const getIndexes_1 = require("./getIndexes");
const getUniqueConstraints_1 = require("./getUniqueConstraints");
const sanitizeModels = (models) => {
    var _a, _b;
    const copieds = {};
    for (const model of Object.values(models)) {
        const copied = Object.assign({}, model);
        (_a = copied.options) === null || _a === void 0 ? true : delete _a.sequelize;
        (_b = copied.options) === null || _b === void 0 ? true : delete _b.indexes;
        copieds[model.name] = copied;
    }
    return copieds;
};
exports.sanitizeModels = sanitizeModels;
const extractModels = (models) => {
    var _a;
    const extractedModels = {};
    for (const model of Object.values(models)) {
        if (model.tableName === 'SequelizeMeta') {
            continue;
        }
        let extractedModel = {
            name: model.tableName,
            options: model.options,
            columns: {},
            foreignKeys: getForeignKey_1.getForeignKeys(model),
            indexes: getIndexes_1.getIndexes((_a = model.options) === null || _a === void 0 ? void 0 : _a.indexes),
            uniqueConstraints: getUniqueConstraints_1.getUniqueConstraints(model)
        };
        for (const attr of Object.values(model.rawAttributes)) {
            // Skip virtual type
            if (attr.type.constructor.name === 'VIRTUAL') {
                continue;
            }
            const extractedColumns = getColumnsAttribute_1.getColumnsAttribute(attr);
            extractedModel.columns = Object.assign(Object.assign({}, extractedModel.columns), extractedColumns);
        }
        extractedModels[model.tableName] = extractedModel;
    }
    return exports.sanitizeModels(extractedModels);
};
exports.extractModels = extractModels;
