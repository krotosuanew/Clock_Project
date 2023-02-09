"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueConstraints = void 0;
const getUniqueConstraints = (model) => {
    const constraints = {};
    for (const attr of Object.values(model.rawAttributes)) {
        if (typeof attr.unique === 'string') {
            constraints[attr.unique] = constraints[attr.unique] || {
                type: 'unique',
                name: attr.unique,
                fields: [],
            };
            constraints[attr.unique].fields.push(attr.field);
        }
    }
    return constraints;
};
exports.getUniqueConstraints = getUniqueConstraints;
