"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexes = void 0;
const getIndexes = (indexes = []) => {
    const keys = {};
    for (const index of indexes) {
        keys[index.name] = index;
    }
    return keys;
};
exports.getIndexes = getIndexes;
