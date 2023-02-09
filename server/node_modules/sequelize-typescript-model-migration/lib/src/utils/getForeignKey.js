"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForeignKeys = void 0;
const parseDataType_1 = require("./parseDataType");
const getForeignKeys = (model) => {
    const keys = {};
    for (const attr of Object.values(model.rawAttributes)) {
        if (attr.references) {
            const extractedKey = Object.assign(Object.assign({}, parseDataType_1.extractColumns(['references', 'onDelete', 'onUpdate'], attr)), { fields: [attr.field], type: 'foreign key' });
            extractedKey.references.table = extractedKey.references.model;
            extractedKey.references.field = extractedKey.references.key;
            extractedKey.name = `fk_${model.tableName}_${attr.field}_${extractedKey.references.table}`;
            delete extractedKey.references.model;
            delete extractedKey.references.key;
            keys[extractedKey.name] = extractedKey;
        }
    }
    return keys;
};
exports.getForeignKeys = getForeignKeys;
