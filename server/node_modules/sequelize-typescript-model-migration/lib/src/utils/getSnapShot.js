"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getLatestSnapshot = exports.getSequelizeMeta = void 0;
const SequelizeMeta_1 = __importDefault(require("../models/SequelizeMeta"));
const sequelize_1 = require("sequelize");
const fileHelper_1 = require("./fileHelper");
const getSequelizeMeta = (sequelize, filename = "noname.js") => __awaiter(void 0, void 0, void 0, function* () {
    sequelize.addModels([SequelizeMeta_1.default]);
    return SequelizeMeta_1.default.findAll({
        limit: 1,
        where: { name: { [sequelize_1.Op.iLike]: `%${filename}%` } },
        order: [["name", "DESC"]],
    }).then((items) => { var _a, _b; return (_b = (_a = items === null || items === void 0 ? void 0 : items[0]) === null || _a === void 0 ? void 0 : _a.get()) === null || _b === void 0 ? void 0 : _b.name; });
});
exports.getSequelizeMeta = getSequelizeMeta;
const getLatestSnapshot = (meta, options) => __awaiter(void 0, void 0, void 0, function* () {
    const prefix = fileHelper_1.getCurrentPrefix(fileHelper_1.parseCurrentVersionFromMeta(meta));
    const subfix = options.migrationName ? options.migrationName : "noname.json";
    const filename = `${prefix}${subfix.includes("json") ? subfix : `${subfix}.json`}`;
    const snapshotDir = options.snapshotDir || "./snapshots";
    const snapshot = yield Promise.resolve().then(() => __importStar(require(`${snapshotDir}/${filename}`))).catch((e) => ({}));
    return snapshot === null || snapshot === void 0 ? void 0 : snapshot.default;
});
exports.getLatestSnapshot = getLatestSnapshot;
