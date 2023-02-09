"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAllTemplates = exports.loadRemoveUniqueConstraints = exports.loadAddUniqueConstraints = exports.loadRemoveColumnTemplate = exports.loadAddColumnTemplate = exports.loadRemoveForeignKeysTemplate = exports.loadAddForeignKeysTemplate = exports.loadRemoveIndexTemplate = exports.loadAddIndexTemplate = exports.loadDropTableTemplate = exports.loadCreateTableTemplate = exports.loadMigrationTemplate = void 0;
const migration_json_1 = __importDefault(require("../templates/migration.json"));
const create_table_json_1 = __importDefault(require("../templates/create-table.json"));
const drop_table_json_1 = __importDefault(require("../templates/drop-table.json"));
const add_index_json_1 = __importDefault(require("../templates/add-index.json"));
const remove_index_json_1 = __importDefault(require("../templates/remove-index.json"));
const add_foreign_key_json_1 = __importDefault(require("../templates/add-foreign-key.json"));
const remove_foreign_key_json_1 = __importDefault(require("../templates/remove-foreign-key.json"));
const add_column_json_1 = __importDefault(require("../templates/add-column.json"));
const remove_column_json_1 = __importDefault(require("../templates/remove-column.json"));
const add_unique_constraints_json_1 = __importDefault(require("../templates/add-unique-constraints.json"));
const remove_unique_constraints_json_1 = __importDefault(require("../templates/remove-unique-constraints.json"));
const loadMigrationTemplate = () => migration_json_1.default.tpl;
exports.loadMigrationTemplate = loadMigrationTemplate;
const loadCreateTableTemplate = () => create_table_json_1.default.tpl;
exports.loadCreateTableTemplate = loadCreateTableTemplate;
const loadDropTableTemplate = () => drop_table_json_1.default.tpl;
exports.loadDropTableTemplate = loadDropTableTemplate;
const loadAddIndexTemplate = () => add_index_json_1.default.tpl;
exports.loadAddIndexTemplate = loadAddIndexTemplate;
const loadRemoveIndexTemplate = () => remove_index_json_1.default.tpl;
exports.loadRemoveIndexTemplate = loadRemoveIndexTemplate;
const loadAddForeignKeysTemplate = () => add_foreign_key_json_1.default.tpl;
exports.loadAddForeignKeysTemplate = loadAddForeignKeysTemplate;
const loadRemoveForeignKeysTemplate = () => remove_foreign_key_json_1.default.tpl;
exports.loadRemoveForeignKeysTemplate = loadRemoveForeignKeysTemplate;
const loadAddColumnTemplate = () => add_column_json_1.default.tpl;
exports.loadAddColumnTemplate = loadAddColumnTemplate;
const loadRemoveColumnTemplate = () => remove_column_json_1.default.tpl;
exports.loadRemoveColumnTemplate = loadRemoveColumnTemplate;
const loadAddUniqueConstraints = () => add_unique_constraints_json_1.default.tpl;
exports.loadAddUniqueConstraints = loadAddUniqueConstraints;
const loadRemoveUniqueConstraints = () => remove_unique_constraints_json_1.default.tpl;
exports.loadRemoveUniqueConstraints = loadRemoveUniqueConstraints;
const loadAllTemplates = () => {
    return [
        exports.loadMigrationTemplate(),
        exports.loadCreateTableTemplate(),
        exports.loadDropTableTemplate(),
        exports.loadAddIndexTemplate(),
        exports.loadRemoveIndexTemplate(),
        exports.loadAddForeignKeysTemplate(),
        exports.loadRemoveForeignKeysTemplate(),
        exports.loadAddColumnTemplate(),
        exports.loadRemoveColumnTemplate(),
        exports.loadAddUniqueConstraints(),
        exports.loadRemoveUniqueConstraints(),
    ];
};
exports.loadAllTemplates = loadAllTemplates;
