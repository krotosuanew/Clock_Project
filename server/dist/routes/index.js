"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const cityRouter_1 = __importDefault(require("./cityRouter"));
const masterRouter_1 = __importDefault(require("./masterRouter"));
const orderRouter_1 = __importDefault(require("./orderRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const sizeRouter_1 = __importDefault(require("./sizeRouter"));
router.use('/users', userRouter_1.default);
router.use('/cities', cityRouter_1.default);
router.use('/masters', masterRouter_1.default);
router.use('/orders', orderRouter_1.default);
router.use('/sizes', sizeRouter_1.default);
exports.default = router;
