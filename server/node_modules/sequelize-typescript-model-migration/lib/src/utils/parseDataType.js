"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractColumns = exports.parseDataType = exports.parseEnum = exports.parseRange = exports.parseArray = exports.parseGeometry = exports.parseDecimal = exports.parseFloatRealDouble = exports.parseBigIntInteger = exports.parseTextDateBlob = exports.parseString = void 0;
const logger_1 = __importDefault(require("./logger"));
const parseString = (type) => {
    var _a, _b, _c;
    const extraBinary = ((_a = type.options) === null || _a === void 0 ? void 0 : _a.binary) ? `,true` : '';
    const extra = ((_b = type.options) === null || _b === void 0 ? void 0 : _b.length)
        ? `(${(_c = type.options) === null || _c === void 0 ? void 0 : _c.length}${extraBinary})`
        : '';
    return `Sequelize.STRING${extra}`;
};
exports.parseString = parseString;
const parseTextDateBlob = (type) => {
    var _a, _b, _c, _d;
    const extra = ((_a = type.options) === null || _a === void 0 ? void 0 : _a.length)
        ? `(${typeof ((_b = type.options) === null || _b === void 0 ? void 0 : _b.length) === 'string'
            ? `'${(_c = type.options) === null || _c === void 0 ? void 0 : _c.length}'`
            : (_d = type.options) === null || _d === void 0 ? void 0 : _d.length})`
        : '';
    return `Sequelize.${type.constructor.name}${extra}`;
};
exports.parseTextDateBlob = parseTextDateBlob;
const parseBigIntInteger = (type) => {
    var _a, _b, _c, _d;
    const unsigned = ((_a = type.options) === null || _a === void 0 ? void 0 : _a.unsigned) ? `.UNSIGNED` : '';
    const zerofill = ((_b = type.options) === null || _b === void 0 ? void 0 : _b.zerofill) ? `.ZEROFILL` : '';
    const length = ((_c = type.options) === null || _c === void 0 ? void 0 : _c.length) ? `(${(_d = type.options) === null || _d === void 0 ? void 0 : _d.length})` : '';
    return `Sequelize.${type.constructor.name}${length}${unsigned}${zerofill}`;
};
exports.parseBigIntInteger = parseBigIntInteger;
const parseFloatRealDouble = (type) => {
    var _a, _b, _c, _d, _e, _f;
    if (((_a = type.options) === null || _a === void 0 ? void 0 : _a.decimals) && !((_b = type.options) === null || _b === void 0 ? void 0 : _b.length)) {
        logger_1.default.warn(`Type ${type.constructor.name} must have length to use decimals. Cannot find length, use plain ${type.constructor.name} instead.`);
    }
    const decimals = ((_c = type.options) === null || _c === void 0 ? void 0 : _c.decimals) ? `,${(_d = type.options) === null || _d === void 0 ? void 0 : _d.decimals}` : '';
    const extra = ((_e = type.options) === null || _e === void 0 ? void 0 : _e.length)
        ? `(${(_f = type.options) === null || _f === void 0 ? void 0 : _f.length}${decimals})`
        : '';
    return `Sequelize.${type.constructor.name}${extra}`;
};
exports.parseFloatRealDouble = parseFloatRealDouble;
const parseDecimal = (type) => {
    var _a, _b, _c, _d, _e, _f;
    if (((_a = type.options) === null || _a === void 0 ? void 0 : _a.scale) && !((_b = type.options) === null || _b === void 0 ? void 0 : _b.precision)) {
        logger_1.default.warn(`Type ${type.constructor.name} must have precision to use scale. Cannot find precision, use plain ${type.constructor.name} instead.`);
    }
    const scale = ((_c = type.options) === null || _c === void 0 ? void 0 : _c.scale) ? `,${(_d = type.options) === null || _d === void 0 ? void 0 : _d.scale}` : '';
    const extra = ((_e = type.options) === null || _e === void 0 ? void 0 : _e.precision)
        ? `${(_f = type.options) === null || _f === void 0 ? void 0 : _f.precision}${scale}`
        : '';
    return `Sequelize.DECIMAL(${extra})`;
};
exports.parseDecimal = parseDecimal;
const parseGeometry = (type) => {
    var _a, _b, _c, _d;
    const scrid = ((_a = type.options) === null || _a === void 0 ? void 0 : _a.srid) ? `,${(_b = type.options) === null || _b === void 0 ? void 0 : _b.srid}` : '';
    const extra = ((_c = type.options) === null || _c === void 0 ? void 0 : _c.type) ? `(${(_d = type.options) === null || _d === void 0 ? void 0 : _d.type}${scrid})` : '';
    return `Sequelize.GEOMETRY${extra}`;
};
exports.parseGeometry = parseGeometry;
const parseArray = (type) => {
    var _a, _b, _c;
    const typeToParse = ((_a = type.options) === null || _a === void 0 ? void 0 : _a.type) instanceof Function
        ? (_b = type.options) === null || _b === void 0 ? void 0 : _b.type()
        : (_c = type.options) === null || _c === void 0 ? void 0 : _c.type;
    const extra = exports.parseDataType(typeToParse);
    return `Sequelize.ARRAY(${extra})`;
};
exports.parseArray = parseArray;
const parseRange = (type) => {
    var _a, _b;
    const extra = ((_a = type.options) === null || _a === void 0 ? void 0 : _a.subtype)
        ? `(${exports.parseDataType((_b = type.options) === null || _b === void 0 ? void 0 : _b.subtype)})`
        : '';
    return `Sequelize.RANGE${extra}`;
};
exports.parseRange = parseRange;
const parseEnum = (type) => {
    return `Sequelize.ENUM('${type.options.values.join("', '")}')`;
};
exports.parseEnum = parseEnum;
const parseDataType = (type) => {
    switch (type.constructor.name) {
        case 'STRING':
            return exports.parseString(type);
        case 'TEXT':
        case 'DATE':
        case 'BLOB':
            return exports.parseTextDateBlob(type);
        case 'BIGINT':
        case 'INTEGER':
            return exports.parseBigIntInteger(type);
        case 'FLOAT':
        case 'REAL':
        case 'DOUBLE':
            return exports.parseFloatRealDouble(type);
        case 'DECIMAL':
            return exports.parseDecimal(type);
        case 'GEOMETRY':
            return exports.parseGeometry(type);
        case 'ARRAY':
            return exports.parseArray(type);
        case 'RANGE':
            return exports.parseRange(type);
        case 'ENUM':
            return exports.parseEnum(type);
    }
    return `Sequelize.${type.constructor.name}`;
};
exports.parseDataType = parseDataType;
const extractColumns = (fields, modelAttribute) => {
    const out = {};
    for (const [key, value] of Object.entries(modelAttribute)) {
        if (fields.includes('type') && key === 'type') {
            out[key] = exports.parseDataType(value);
            continue;
        }
        if (fields.includes(key)) {
            out[key] = value;
        }
    }
    return out;
};
exports.extractColumns = extractColumns;
