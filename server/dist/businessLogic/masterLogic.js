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
const sizeLogic_1 = __importDefault(require("./sizeLogic"));
const db_1 = __importDefault(require("../db"));
const date_fns_1 = require("date-fns");
const { and, lt, lte, not, is, or, gt, gte, notIn } = sequelize_1.Op;
class MasterLogic {
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const masterInfo = req.body;
                const newMaster = yield models_1.Master.create(masterInfo);
                yield newMaster.addCities(masterInfo.cityId);
                return newMaster;
            }
            catch (e) {
                return new ApiError_1.default(400, e.message);
            }
        });
    }
    getAll(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = (_a = req.query.page) !== null && _a !== void 0 ? _a : 1;
                const limit = (_b = req.query.limit) !== null && _b !== void 0 ? _b : 10;
                const sorting = (_c = req.query.sorting) !== null && _c !== void 0 ? _c : "name";
                const name = req.query.name === "" ? null : req.query.name;
                const directionUp = req.query.ascending === "true" ? 'ASC' : 'DESC';
                const { cityIDes, rating, masterName } = req.query.filters ? JSON.parse(req.query.filters) : {
                    cityIDes: null,
                    rating: null,
                    masterName: null
                };
                const offset = page * limit - limit;
                const masterIdes = cityIDes ? yield models_1.Master.findAll({
                    include: [{
                            model: models_1.City,
                            attributes: ["id"],
                            where: { id: cityIDes }
                        }]
                }) : null;
                const masters = yield models_1.Master.findAndCountAll({
                    distinct: true,
                    order: [[sorting, directionUp],
                        [models_1.City, "name", 'ASC']
                    ],
                    where: {
                        name: name ? { [sequelize_1.Op.or]: [{ [sequelize_1.Op.substring]: name }, { [sequelize_1.Op.iRegexp]: name }] } : masterName ? {
                            [sequelize_1.Op.or]: [{ [sequelize_1.Op.substring]: masterName }, { [sequelize_1.Op.iRegexp]: masterName }]
                        } : { [sequelize_1.Op.ne]: "" },
                        id: masterIdes ? { [sequelize_1.Op.in]: masterIdes.map(master => master.id) } : { [sequelize_1.Op.ne]: 0 },
                        rating: { [sequelize_1.Op.between]: rating !== null && rating !== void 0 ? rating : [0, 5] },
                    },
                    attributes: ['name', "rating", "id", "isActivated"],
                    include: [{
                            model: models_1.City,
                            through: {
                                attributes: []
                            },
                        }, { model: models_1.User }], limit, offset
                });
                if (!masters.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.json(masters);
            }
            catch (e) {
                next(ApiError_1.default.NotFound(e.message));
                return;
            }
        });
    }
    getMastersForOrder(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cityId = req.params.cityId;
                const page = (_a = req.query.page) !== null && _a !== void 0 ? _a : 1;
                const limit = (_b = req.query.limit) !== null && _b !== void 0 ? _b : 10;
                let time = req.query.time;
                const sizeClock = req.query.sizeClock;
                const clock = yield sizeLogic_1.default.CheckClock(next, sizeClock);
                if (clock === undefined) {
                    return next(ApiError_1.default.NotFound("clock not found"));
                }
                const endTime = (0, date_fns_1.addHours)(new Date(time), Number(clock.date.slice(0, 2)));
                time = new Date(time);
                const offset = page * limit - limit;
                let masters;
                const orders = yield models_1.Order.findAll({
                    where: {
                        [not]: [{
                                [or]: [{
                                        [and]: [{ time: { [lt]: time } }, { endTime: { [lte]: time } }]
                                    }, {
                                        [and]: [{ time: { [gte]: endTime } }, { endTime: { [gt]: endTime } }]
                                    }]
                            }]
                    },
                    attributes: ["masterId"],
                    group: "masterId"
                });
                masters = yield models_1.Master.findAndCountAll({
                    order: [['rating', 'DESC']],
                    distinct: true,
                    where: {
                        isActivated: { [is]: true },
                        id: { [notIn]: orders.map(order => order.masterId) }
                    }, include: [{
                            model: models_1.City,
                            where: { id: cityId },
                            through: {
                                attributes: []
                            }
                        }], limit, offset
                });
                if (!masters.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(masters);
            }
            catch (e) {
                next(ApiError_1.default.NotFound(e.message));
                return;
            }
        });
    }
    checkOrders(next, masterId, time, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const masterCheck = yield models_1.Master.findOne({
                where: { id: masterId }, include: [{
                        model: models_1.Order, where: {
                            [not]: [{
                                    [or]: [{
                                            [and]: [{ time: { [lt]: time } }, { endTime: { [lte]: time } }]
                                        }, {
                                            [and]: [{ time: { [gte]: endTime } }, { endTime: { [gt]: endTime } }]
                                        }]
                                }]
                        },
                    }],
            });
            if (masterCheck) {
                next(ApiError_1.default.NotFound('Master not found'));
                return;
            }
            return masterCheck;
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const masterId = Number(req.params.masterId);
                const updateInfo = req.body;
                const masterUpdate = yield models_1.Master.findOne({ where: { id: masterId } });
                if (masterUpdate === null) {
                    return next(ApiError_1.default.badRequest("Wrong request"));
                }
                yield models_1.Master.update(updateInfo, { where: { id: masterId } });
                yield masterUpdate.setCities(updateInfo.cityId);
                return masterUpdate;
            }
            catch (e) {
                next(ApiError_1.default.badRequest("Wrong request"));
                return;
            }
        });
    }
    ratingUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const uuid = req.params.uuid;
                    const { review } = req.body;
                    const orderInfo = yield models_1.Order.findOne({
                        where: { ratingLink: uuid },
                        attributes: ["id", "masterId", "userId", "ratingLink"]
                    });
                    if (!orderInfo) {
                        next(ApiError_1.default.badRequest("Wrong request"));
                        return;
                    }
                    const newRating = +req.body.rating;
                    yield models_1.Rating.create({
                        rating: newRating,
                        review,
                        userId: orderInfo.userId,
                        masterId: orderInfo.masterId,
                        orderId: orderInfo.id
                    });
                    const allRating = yield models_1.Rating.findAndCountAll({
                        where: { masterId: orderInfo.masterId },
                        attributes: ["rating"]
                    });
                    const averageRating = allRating.rows.reduce((sum, current) => sum + current.rating, 0) / allRating.count;
                    const masterUpdate = yield models_1.Master.update({
                        rating: averageRating,
                    }, { where: { id: orderInfo.masterId } });
                    return masterUpdate;
                }));
                return res.status(201).json(result);
            }
            catch (e) {
                next(ApiError_1.default.badRequest("Wrong request"));
                return;
            }
        });
    }
    getRatingReviews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { masterId } = req.params;
                const page = 1;
                const limit = 5;
                const offset = page * limit - limit;
                const ratingReviews = yield models_1.Rating.findAndCountAll({
                    where: { masterId: masterId },
                    order: [['id', 'DESC']],
                    include: [{
                            model: models_1.User,
                            attributes: ["id"],
                            include: [{
                                    model: models_1.Customer,
                                    attributes: ["name"]
                                }]
                        }], limit, offset
                });
                return res.status(200).json(ratingReviews);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    checkLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uuid } = req.params;
                const check = yield models_1.Order.findOne({
                    where: { ratingLink: uuid },
                    attributes: ["id"],
                    include: [{
                            model: models_1.Rating,
                        }]
                });
                if (check == null || check.rating) {
                    next(ApiError_1.default.badRequest("Wrong request"));
                    return;
                }
                return res.status(200).json(check);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const masterId = Number(req.params.masterId);
                const { isActivated } = req.body;
                const masterUpdate = yield models_1.Master.update({
                    isActivated,
                }, { where: { id: masterId } });
                return masterUpdate;
            }
            catch (e) {
                return next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const masterId = Number(req.params.masterId);
                const masterDelete = yield models_1.User.findOne({
                    include: {
                        model: models_1.Master, where: { id: masterId }, attributes: ['id'],
                        include: [models_1.Master.associations.orders]
                    }
                });
                if (masterDelete === null || masterDelete.master === undefined
                    || masterDelete.master.orders === undefined) {
                    next(ApiError_1.default.Conflict("City isn`t empty"));
                    return;
                }
                if (masterDelete.master.orders.length === 0) {
                    yield masterDelete.destroy();
                    return res.status(204).json({ message: "success" });
                }
                else {
                    next(ApiError_1.default.Conflict("Master isn`t empty"));
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
exports.default = new MasterLogic();
