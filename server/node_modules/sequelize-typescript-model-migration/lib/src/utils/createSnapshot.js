"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSnapshot = exports.sanitizeModelsFields = exports.revertIndexesWhere = exports.revertSanitizeFields = exports.sanitizeFields = exports.convertObjectToArray = exports.convertArrayToObject = void 0;
const fs_1 = __importDefault(require("fs"));
const fileHelper_1 = require("./fileHelper");
const clone_deep_1 = __importDefault(require("clone-deep"));
const parse_1 = require("./parse");
const convertArrayToObject = (arr) => {
    const target = {};
    for (const item of arr) {
        if (typeof item === 'string') {
            target[item] = item;
            continue;
        }
        target[item.name] = item;
    }
    return target;
};
exports.convertArrayToObject = convertArrayToObject;
const convertObjectToArray = (target) => {
    const result = [];
    for (const val of Object.values(target)) {
        result.push(val);
    }
    return result;
};
exports.convertObjectToArray = convertObjectToArray;
const sanitizeFields = (targets) => {
    for (const val of Object.values(targets)) {
        if (Array.isArray(val.fields) && val.fields.length > 0) {
            val.fields = exports.convertArrayToObject(val.fields);
        }
    }
};
exports.sanitizeFields = sanitizeFields;
const revertSanitizeFields = (targets) => {
    const copies = clone_deep_1.default(targets);
    for (const val of Object.values(copies)) {
        val.fields = exports.convertObjectToArray(val.fields);
        val.where = targets[val.name].where;
    }
    return copies;
};
exports.revertSanitizeFields = revertSanitizeFields;
const revertIndexesWhere = (indexes, originIndexes) => {
    for (const index of Object.values(indexes)) {
        if (index.where) {
            index.where = parse_1.parseObject(originIndexes[index.name].where);
        }
    }
};
exports.revertIndexesWhere = revertIndexesWhere;
const sanitizeModelsFields = (models) => {
    const copies = clone_deep_1.default(models);
    for (const model of Object.values(copies)) {
        exports.sanitizeFields(model.indexes);
        exports.sanitizeFields(model.foreignKeys);
        exports.sanitizeFields(model.uniqueConstraints);
        exports.revertIndexesWhere(model.indexes, models[model.name].indexes);
    }
    return copies;
};
exports.sanitizeModelsFields = sanitizeModelsFields;
const createSnapshot = (models, meta, options) => __awaiter(void 0, void 0, void 0, function* () {
    const snapshotName = fileHelper_1.makeFilename(options, meta, '.json');
    const snapshotDir = options.snapshotDir || './snapshots';
    if (!fs_1.default.existsSync(snapshotDir)) {
        fs_1.default.mkdirSync(snapshotDir);
    }
    return fileHelper_1.writePromise(`${snapshotDir}/${snapshotName}`, JSON.stringify(exports.sanitizeModelsFields(models)));
});
exports.createSnapshot = createSnapshot;
