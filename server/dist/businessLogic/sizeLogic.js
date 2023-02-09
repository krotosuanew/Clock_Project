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
const models_1 = require("../models/models");
const ApiError_1 = __importDefault(require("../error/ApiError"));
const sequelize_1 = require("sequelize");
class SizeLogic {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sizeInfo = req.body;
                const size = yield models_1.SizeClock.create(sizeInfo);
                return res.status(201).json(size);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sizeId = Number(req.params.sizeId);
                const updateSize = req.body;
                const size = yield models_1.SizeClock.update(updateSize, { where: { id: sizeId } });
                return res.status(201).json(size);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    getAll(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = (_a = req.query.page) !== null && _a !== void 0 ? _a : 1;
                const limit = (_b = req.query.limit) !== null && _b !== void 0 ? _b : 10;
                const name = req.query.name === "" ? null : req.query.name;
                const sorting = (_c = req.query.sorting) !== null && _c !== void 0 ? _c : "date";
                const directionUp = req.query.ascending === "true" ? 'DESC' : 'ASC';
                const offset = page * limit - limit;
                const sizes = yield models_1.SizeClock.findAndCountAll({
                    where: {
                        name: name ? { [sequelize_1.Op.or]: [{ [sequelize_1.Op.substring]: name }, { [sequelize_1.Op.iRegexp]: name }] } : { [sequelize_1.Op.ne]: "" },
                    },
                    order: [[sorting, directionUp]],
                    limit: limit, offset
                });
                if (!sizes.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(sizes);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    CheckClock(next, sizeClockId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clock = yield models_1.SizeClock.findOne({ where: { id: sizeClockId } });
            if (!clock) {
                return next(ApiError_1.default.badRequest('WRONG sizeClockId'));
            }
            return clock;
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sizeId = req.params.sizeId;
                if (sizeId) {
                    const size = yield models_1.SizeClock.findOne({
                        where: { id: sizeId },
                        include: models_1.Order,
                        attributes: ["id"]
                    });
                    if (size === null || size.orders === undefined) {
                        next(ApiError_1.default.badRequest("Id is empty"));
                        return;
                    }
                    if (size.orders.length === 0) {
                        yield size.destroy();
                        return res.status(204).json({ message: "success" });
                    }
                    else {
                        next(ApiError_1.default.Conflict("Clock has orders"));
                        return;
                    }
                }
                else {
                    next(ApiError_1.default.badRequest("Id is empty"));
                    return;
                }
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
}
exports.default = new SizeLogic();
