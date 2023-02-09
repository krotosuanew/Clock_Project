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
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
class CityLogic {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const cityInfo = req.body;
                const newCity = yield models_1.City.create(cityInfo);
                return res.status(200).json({ newCity });
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
                const sorting = (_a = req.query.sorting) !== null && _a !== void 0 ? _a : "name";
                const directionUp = req.query.ascending === "true" ? 'DESC' : 'ASC';
                const name = req.query.name === "" ? null : req.query.name;
                const page = (_b = req.query.page) !== null && _b !== void 0 ? _b : 1;
                const limit = (_c = req.query.limit) !== null && _c !== void 0 ? _c : 10;
                const offset = page * limit - limit;
                const cities = yield models_1.City.findAndCountAll({
                    where: {
                        name: name ? { [sequelize_1.Op.or]: [{ [sequelize_1.Op.substring]: name }, { [sequelize_1.Op.iRegexp]: name }] } : { [sequelize_1.Op.ne]: "" },
                    },
                    order: [[sorting, directionUp]],
                    limit, offset
                });
                if (!cities.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(cities);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    checkMasterCityId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cityCheck = yield models_1.City.findAll({ where: { id } });
            if (cityCheck.length !== id.length || cityCheck.length === 0) {
                return true;
            }
            return false;
        });
    }
    checkCityId(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const cityCheck = yield models_1.City.findByPk(id);
            if (!cityCheck) {
                next(ApiError_1.default.badRequest("WRONG CityId"));
                return;
            }
            return cityCheck;
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cityId = req.params.cityId;
                const cityInfo = req.body;
                const cityUpdate = yield models_1.City.update(cityInfo, { where: { id: cityId } });
                return res.status(201).json(cityUpdate);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cityId = req.params.cityId;
                if (cityId) {
                    const cityDelete = yield models_1.City.findOne({
                        where: { id: cityId },
                        include: models_1.Master,
                        attributes: ["id"]
                    });
                    if (cityDelete === null || cityDelete.masters === undefined) {
                        next(ApiError_1.default.badRequest("Id is empty"));
                        return;
                    }
                    if (cityDelete.masters.length === 0) {
                        yield cityDelete.destroy();
                        return res.status(204).json({ message: "success" });
                    }
                    else {
                        next(ApiError_1.default.Conflict("City isn`t empty"));
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
exports.default = new CityLogic();
