"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    warn(msg, ...rest) {
        console.log(`[Warning] ${msg}`, ...rest);
    },
    error(msg, ...rest) {
        console.error(`[Error] ${msg}`, ...rest);
    },
};
