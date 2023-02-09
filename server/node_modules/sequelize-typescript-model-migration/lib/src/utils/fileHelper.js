"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFilename = exports.createMigrationName = exports.getCurrentPrefix = exports.getNextPrefix = exports.parseCurrentVersionFromMeta = exports.writePromise = exports.readPromise = void 0;
const fs_1 = __importDefault(require("fs"));
const readPromise = (filename) => new Promise((resolve, reject) => fs_1.default.readFile(filename, (err, data) => {
    if (err) {
        return reject(err);
    }
    return resolve(data.toString());
}));
exports.readPromise = readPromise;
const writePromise = (filename, data) => new Promise((resolve, reject) => fs_1.default.writeFile(filename, data, {}, (err) => {
    if (err) {
        return reject(err);
    }
    return resolve(true);
}));
exports.writePromise = writePromise;
const parseCurrentVersionFromMeta = (meta = '00000000') => {
    return +meta.substring(0, 8);
};
exports.parseCurrentVersionFromMeta = parseCurrentVersionFromMeta;
const getNextPrefix = (currentVersion) => {
    return `${(++currentVersion).toString().padStart(8, '0')}-`;
};
exports.getNextPrefix = getNextPrefix;
const getCurrentPrefix = (currentVersion) => {
    return `${currentVersion.toString().padStart(8, '0')}-`;
};
exports.getCurrentPrefix = getCurrentPrefix;
const createMigrationName = (meta, filename) => {
    const prefix = exports.getNextPrefix(exports.parseCurrentVersionFromMeta(meta));
    return `${prefix}${filename}`;
};
exports.createMigrationName = createMigrationName;
const makeFilename = (options, meta, ext = '.js') => {
    const filename = options.migrationName
        ? options.migrationName
        : `noname${ext}`;
    return `${exports.getNextPrefix(exports.parseCurrentVersionFromMeta(meta))}${(filename === null || filename === void 0 ? void 0 : filename.includes(ext)) ? filename : `${filename}${ext}`}`;
};
exports.makeFilename = makeFilename;
