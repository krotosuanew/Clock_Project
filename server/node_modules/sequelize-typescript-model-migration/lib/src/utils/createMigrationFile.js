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
exports.createMigrationFile = void 0;
const prettier_1 = __importDefault(require("prettier"));
const fileHelper_1 = require("./fileHelper");
const createMigrationFile = (commands, meta, options) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = fileHelper_1.makeFilename(options, meta);
    const migrationDir = options.outDir || './migrations';
    return fileHelper_1.writePromise(`${migrationDir}/${filename}`, prettier_1.default.format(commands, options.prettierOptions));
});
exports.createMigrationFile = createMigrationFile;
