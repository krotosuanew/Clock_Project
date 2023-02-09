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
const userLogic_1 = __importDefault(require("../businessLogic/userLogic"));
const orderLogic_1 = __importDefault(require("../businessLogic/orderLogic"));
const masterLogic_1 = __importDefault(require("../businessLogic/masterLogic"));
const sizeLogic_1 = __importDefault(require("../businessLogic/sizeLogic"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const db_1 = __importDefault(require("../db"));
const cityLogic_1 = __importDefault(require("../businessLogic/cityLogic"));
const express_validator_1 = require("express-validator");
const date_fns_1 = require("date-fns");
const sendMailLogic_1 = __importDefault(require("../businessLogic/sendMailLogic"));
class OrderController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const result = yield db_1.default.transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const { sizeClockId, masterId, cityId } = req.body;
                    let { time } = req.body;
                    const clock = yield sizeLogic_1.default.CheckClock(next, sizeClockId);
                    if (!clock) {
                        next(ApiError_1.default.badRequest("Clock`s wrong"));
                        return;
                    }
                    const endTime = (0, date_fns_1.addHours)(new Date(time), Number(clock.date.slice(0, 2)));
                    time = new Date(time);
                    const city = yield cityLogic_1.default.checkCityId(cityId, next);
                    if (!city) {
                        next(ApiError_1.default.badRequest("City`s wrong"));
                        return;
                    }
                    yield masterLogic_1.default.checkOrders(next, masterId, time, endTime);
                    const user = yield userLogic_1.default.GetOrCreateUser(req);
                    if (!user) {
                        next(ApiError_1.default.badRequest("Customer is wrong"));
                        return;
                    }
                    const userId = user.getDataValue("id");
                    const order = yield orderLogic_1.default.create(req, next, userId, time, endTime);
                    if (order instanceof ApiError_1.default) {
                        next(ApiError_1.default.badRequest("Customer is wrong"));
                        return;
                    }
                    const data = {
                        order,
                        city,
                        clock,
                        user
                    };
                    return data;
                }));
                if (req.body.photos && result) {
                    orderLogic_1.default.cloudnaryUpload(result.order.id, req.body.photos, next);
                }
                yield sendMailLogic_1.default.sendMessage(req, next, result);
                return res.status(201).json({
                    token: result === null || result === void 0 ? void 0 : result.user.token,
                    orderId: result === null || result === void 0 ? void 0 : result.order.id
                });
            }
            catch (e) {
                return next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const result = yield db_1.default.transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const { sizeClockId, masterId, cityId, changedMaster } = req.body;
                    let { time } = req.body;
                    const clock = yield sizeLogic_1.default.CheckClock(next, sizeClockId);
                    if (!clock) {
                        return next(ApiError_1.default.badRequest("Clock`s wrong"));
                    }
                    const endTime = (0, date_fns_1.addHours)(new Date(time), Number(clock.date.slice(0, 2)));
                    time = new Date(time);
                    const city = yield cityLogic_1.default.checkCityId(cityId, next);
                    if (!city) {
                        return next(ApiError_1.default.badRequest("City`s wrong"));
                    }
                    if (changedMaster) {
                        yield masterLogic_1.default.checkOrders(next, masterId, time, endTime);
                    }
                    const user = yield userLogic_1.default.GetOrCreateUser(req);
                    if (!user) {
                        return next(ApiError_1.default.badRequest("Customer is wrong"));
                    }
                    const userId = user.getDataValue("id");
                    const orders = yield orderLogic_1.default.update(req, res, next, userId, time, endTime);
                    return orders;
                }));
                return res.status(201).json(result);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    statusChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const order = yield orderLogic_1.default.statusChange(req, res, next);
                if (!order) {
                    next(ApiError_1.default.badRequest("Empty"));
                    return;
                }
                return res.status(201).json(order);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    payPalChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const order = yield orderLogic_1.default.payPalChange(req, res, next);
                if (!order) {
                    next(ApiError_1.default.badRequest("Empty"));
                    return;
                }
                return res.status(201).json(order);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    getUserOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            yield orderLogic_1.default.getUserOrders(req, res, next);
        });
    }
    getMasterOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            yield orderLogic_1.default.getMasterOrders(req, res, next);
        });
    }
    getAllOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield orderLogic_1.default.getAllOrders(req, res, next);
        });
    }
    ordersStatistics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield orderLogic_1.default.ordersStatistics(req, res, next);
        });
    }
    getPhotos(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield orderLogic_1.default.getPhotos(req, res, next);
        });
    }
    exportToExcel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield orderLogic_1.default.exportToExcel(req, res, next);
        });
    }
    createBill(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield orderLogic_1.default.createBill(req, res, next);
        });
    }
    downloadPhotos(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield orderLogic_1.default.downloadPhotos(req, res, next);
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            yield orderLogic_1.default.deleteOne(req, res, next);
        });
    }
}
exports.default = new OrderController();
