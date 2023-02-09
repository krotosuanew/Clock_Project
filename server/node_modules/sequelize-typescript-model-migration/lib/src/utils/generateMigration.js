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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMigration = void 0;
const extractModels_1 = require("./extractModels");
const generateBrandnewCommands_1 = require("./generateBrandnewCommands");
const loadTemplates_1 = require("./loadTemplates");
const createMetaTables_1 = require("./createMetaTables");
const createSnapshot_1 = require("./createSnapshot");
const createMigrationFile_1 = require("./createMigrationFile");
const generateChangesCommands_1 = require("./generateChangesCommands");
const getSnapShot_1 = require("./getSnapShot");
const generateMigration = (sequelize, options = { prettierOptions: {} }) => __awaiter(void 0, void 0, void 0, function* () {
    yield createMetaTables_1.createMetaTable(sequelize);
    const meta = yield getSnapShot_1.getSequelizeMeta(sequelize, options.migrationName);
    const snapshot = yield getSnapShot_1.getLatestSnapshot(meta, options);
    const templates = loadTemplates_1.loadAllTemplates();
    const extractedModels = extractModels_1.extractModels(sequelize.models);
    const commands = snapshot
        ? generateChangesCommands_1.generateChangesCommands(snapshot, extractedModels)
        : generateBrandnewCommands_1.generateBrandnewCommands(extractedModels, templates);
    yield createSnapshot_1.createSnapshot(extractedModels, meta, options);
    yield createMigrationFile_1.createMigrationFile(commands, meta, options);
});
exports.generateMigration = generateMigration;
