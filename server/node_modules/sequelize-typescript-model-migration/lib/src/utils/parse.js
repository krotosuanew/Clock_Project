"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelToSnakeCase = exports.parseKeyValue = exports.parseArray = exports.parseObject = exports.parseObjectWithSymbols = void 0;
const convertOpSymbolToText_1 = require("./convertOpSymbolToText");
const parseObjectWithSymbols = (target, symbols) => {
    let str = '';
    for (const symbol of symbols) {
        str = `${str}${exports.parseKeyValue(convertOpSymbolToText_1.convertOpSymbolToText(symbol), target[symbol])}`;
    }
    return str;
};
exports.parseObjectWithSymbols = parseObjectWithSymbols;
const parseObject = (target) => {
    let str = ``;
    const symbols = Object.getOwnPropertySymbols(target);
    if (symbols.length > 0) {
        str = exports.parseObjectWithSymbols(target, symbols);
    }
    for (const [k, v] of Object.entries(target)) {
        if (!v) {
            continue;
        }
        str = `${str}${exports.parseKeyValue(k, v)},`;
    }
    return `{${str}}`;
};
exports.parseObject = parseObject;
const parseArray = (target) => {
    return target
        .map((v) => {
        if (Array.isArray(v)) {
            return exports.parseArray(v);
        }
        if (typeof v === 'object') {
            return exports.parseObject(v);
        }
        if (typeof v === 'string') {
            return `'${v}'`;
        }
        return v;
    })
        .join(',');
};
exports.parseArray = parseArray;
const parseKeyValue = (key, value) => {
    if (typeof value === 'string') {
        return `${key}:${(key === 'type' && value.startsWith('Sequelize')) || key === 'where'
            ? `${value}`
            : `'${value}'`}`;
    }
    if (Array.isArray(value)) {
        return `${key}:[${exports.parseArray(value)}]`;
    }
    if (typeof value === 'object') {
        return `${key}:${exports.parseObject(value)}`;
    }
    return `${key}:${value}`;
};
exports.parseKeyValue = parseKeyValue;
const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
exports.camelToSnakeCase = camelToSnakeCase;
