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
const masterLogic_1 = __importDefault(require("../businessLogic/masterLogic"));
const cityLogic_1 = __importDefault(require("../businessLogic/cityLogic"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const db_1 = __importDefault(require("../db"));
const express_validator_1 = require("express-validator");
class MasterController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const cityIdes = req.body.cityId;
                if (yield cityLogic_1.default.checkMasterCityId(cityIdes)) {
                    next(ApiError_1.default.badRequest("WRONG request"));
                    return;
                }
                const master = yield masterLogic_1.default.create(req);
                if (master instanceof ApiError_1.default) {
                    next(ApiError_1.default.badRequest("WRONG request"));
                    return;
                }
                return master;
            }
            catch (e) {
                next(ApiError_1.default.badRequest("WRONG request"));
                return;
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield masterLogic_1.default.getAll(req, res, next);
        });
    }
    getMastersForOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            yield masterLogic_1.default.getMastersForOrder(req, res, next);
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
                    const cityIdes = req.body.cityId;
                    yield cityLogic_1.default.checkMasterCityId(cityIdes);
                    yield masterLogic_1.default.update(req, res, next);
                    return;
                }));
                return res.status(201).json(result);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const master = yield masterLogic_1.default.activate(req, res, next);
                return res.status(201).json(master);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    ratingUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                yield masterLogic_1.default.ratingUpdate(req, res, next);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    getRatingReviews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            yield masterLogic_1.default.getRatingReviews(req, res, next);
        });
    }
    checkLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            yield masterLogic_1.default.checkLink(req, res, next);
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            yield masterLogic_1.default.deleteOne(req, res, next);
        });
    }
}
exports.default = new MasterController();
