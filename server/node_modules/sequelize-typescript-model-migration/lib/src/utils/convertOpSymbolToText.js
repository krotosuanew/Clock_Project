"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertOpSymbolToText = void 0;
const sequelize_1 = require("sequelize");
const convertOpSymbolToText = (symbol) => {
    switch (symbol) {
        case sequelize_1.Op.adjacent:
            return `[Op.adjacent]`;
        case sequelize_1.Op.all:
            return `[Op.all]`;
        case sequelize_1.Op.and:
            return `[Op.and]`;
        case sequelize_1.Op.any:
            return `[Op.any]`;
        case sequelize_1.Op.between:
            return `[Op.between]`;
        case sequelize_1.Op.col:
            return `[Op.col]`;
        case sequelize_1.Op.contained:
            return `[Op.contained]`;
        case sequelize_1.Op.contains:
            return `[Op.contains]`;
        case sequelize_1.Op.endsWith:
            return `[Op.endsWith]`;
        case sequelize_1.Op.eq:
            return `[Op.eq]`;
        case sequelize_1.Op.gt:
            return `[Op.gt]`;
        case sequelize_1.Op.gte:
            return `[Op.gte]`;
        case sequelize_1.Op.iLike:
            return `[Op.iLike]`;
        case sequelize_1.Op.iRegexp:
            return `[Op.iRegexp]`;
        case sequelize_1.Op.in:
            return `[Op.in]`;
        case sequelize_1.Op.is:
            return `[Op.is]`;
        case sequelize_1.Op.like:
            return `[Op.like]`;
        case sequelize_1.Op.lt:
            return `[Op.lt]`;
        case sequelize_1.Op.lte:
            return `[Op.lte]`;
        case sequelize_1.Op.ne:
            return `[Op.ne]`;
        case sequelize_1.Op.noExtendLeft:
            return `[Op.noExtendLeft]`;
        case sequelize_1.Op.noExtendRight:
            return `[Op.noExtendRight]`;
        case sequelize_1.Op.not:
            return `[Op.not]`;
        case sequelize_1.Op.notBetween:
            return `[Op.notBetween]`;
        case sequelize_1.Op.notILike:
            return `[Op.notILike]`;
        case sequelize_1.Op.notIRegexp:
            return `[Op.notIRegexp]`;
        case sequelize_1.Op.notIn:
            return `[Op.notIn]`;
        case sequelize_1.Op.notLike:
            return `[Op.notLike]`;
        case sequelize_1.Op.notRegexp:
            return `[Op.notRegexp]`;
        case sequelize_1.Op.or:
            return `[Op.or]`;
        case sequelize_1.Op.overlap:
            return `[Op.overlap]`;
        case sequelize_1.Op.placeholder:
            return `[Op.placeholder]`;
        case sequelize_1.Op.regexp:
            return `[Op.regexp]`;
        case sequelize_1.Op.startsWith:
            return `[Op.startsWith]`;
        case sequelize_1.Op.strictLeft:
            return `[Op.strictLeft]`;
        case sequelize_1.Op.strictRight:
            return `[Op.strictRight]`;
        case sequelize_1.Op.substring:
            return `[Op.substring]`;
        case sequelize_1.Op.values:
            return `[Op.values]`;
    }
    return '';
};
exports.convertOpSymbolToText = convertOpSymbolToText;
