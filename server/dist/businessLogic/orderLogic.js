"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mailService_1 = __importDefault(require("../service/mailService"));
const order_dto_1 = __importStar(require("../dto/order.dto"));
const global_1 = require("../dto/global");
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const xlsx_1 = __importDefault(require("xlsx"));
const defaults_1 = __importDefault(require("lodash/defaults"));
const countBy_1 = __importDefault(require("lodash/countBy"));
const fs_1 = __importDefault(require("fs"));
const qrcode_1 = __importDefault(require("qrcode"));
const path_1 = __importDefault(require("path"));
const cloudinary = __importStar(require("../service/cloudnary"));
const axios_1 = __importDefault(require("axios"));
const jszip_1 = __importDefault(require("jszip"));
const { between, gte } = sequelize_1.Op;
class OrderLogic {
    create(req, next, userId, time, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, sizeClockId, masterId, cityId, price, photoLinks } = req.body;
                return yield models_1.Order.create({ name, sizeClockId, userId, time, endTime, masterId, cityId, price, photoLinks });
            }
            catch (e) {
                return new ApiError_1.default(400, e.message);
            }
        });
    }
    getUserOrders(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const sorting = (_a = req.query.sorting) !== null && _a !== void 0 ? _a : "name";
                const directionUp = req.query.ascending === "true" ? global_1.DIRECTION.DOWN : global_1.DIRECTION.UP;
                const page = (_b = req.query.page) !== null && _b !== void 0 ? _b : 1;
                const limit = (_c = req.query.limit) !== null && _c !== void 0 ? _c : 10;
                const { cityIDes, masterIDes, sizeIDes, time, status, minPrice, maxPrice } = req.query.filters ? JSON.parse(req.query.filters)
                    : {
                        cityIDes: null,
                        masterIDes: null,
                        sizeIDes: null,
                        time: null,
                        status: null, minPrice: null, maxPrice: null
                    };
                const offset = page * limit - limit;
                const orders = yield models_1.Order.findAndCountAll({
                    order: [sorting === order_dto_1.SORTING.MASTER_NAME ? [models_1.Master, "name", directionUp]
                            : sorting === order_dto_1.SORTING.SIZE_NAME ? [models_1.SizeClock, "name", directionUp] :
                                sorting === order_dto_1.SORTING.CITY_NAME ? [models_1.City, "name", directionUp]
                                    : [sorting, directionUp]],
                    where: {
                        userId: userId,
                        status: status !== null && status !== void 0 ? status : Object.keys(order_dto_1.STATUS),
                        time: time ? { [between]: time } : { [sequelize_1.Op.ne]: 0 },
                        price: !!maxPrice ? { [between]: [minPrice !== null && minPrice !== void 0 ? minPrice : 0, maxPrice] } : { [gte]: minPrice !== null && minPrice !== void 0 ? minPrice : 0 }
                    },
                    include: [{
                            model: models_1.Master,
                            attributes: ['name'],
                            where: {
                                id: masterIDes !== null && masterIDes !== void 0 ? masterIDes : { [sequelize_1.Op.ne]: 0 }
                            }
                        }, {
                            model: models_1.SizeClock,
                            where: {
                                id: sizeIDes !== null && sizeIDes !== void 0 ? sizeIDes : { [sequelize_1.Op.ne]: 0 }
                            },
                            attributes: ['name']
                        },
                        {
                            model: models_1.Rating,
                            attributes: ["rating"],
                        },
                        {
                            model: models_1.City,
                            where: {
                                id: cityIDes !== null && cityIDes !== void 0 ? cityIDes : { [sequelize_1.Op.ne]: 0 }
                            }
                        }], limit, offset
                });
                if (!orders.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(orders);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    getMasterOrders(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const sorting = (_a = req.query.sorting) !== null && _a !== void 0 ? _a : "name";
                const directionUp = req.query.ascending === "true" ? global_1.DIRECTION.DOWN : global_1.DIRECTION.UP;
                const page = (_b = req.query.page) !== null && _b !== void 0 ? _b : null;
                const limit = (_c = req.query.limit) !== null && _c !== void 0 ? _c : null;
                const { cityIDes, userIDes, sizeIDes, time, status, minPrice, userEmails, userName, maxPrice } = req.query.filters ? JSON.parse(req.query.filters)
                    : {
                        cityIDes: null,
                        userIDes: null,
                        sizeIDes: null,
                        time: null,
                        status: null, minPrice: null, maxPrice: null, userEmails: null,
                        userName: null
                    };
                const offset = page * limit - limit;
                const masterFind = yield models_1.Master.findOne({
                    where: { userId: userId },
                    attributes: ['id', "isActivated"]
                });
                if (masterFind === null || !masterFind.isActivated) {
                    return next(ApiError_1.default.forbidden("Not activated"));
                }
                const orders = yield models_1.Order.findAndCountAll({
                    order: [sorting === order_dto_1.SORTING.SIZE_NAME ? [models_1.SizeClock, "name", directionUp] :
                            sorting === order_dto_1.SORTING.CITY_NAME ? [models_1.City, "name", directionUp] :
                                sorting === order_dto_1.SORTING.USER_ID ? [models_1.User, "id", directionUp]
                                    : [sorting, directionUp]],
                    where: {
                        name: userName ? { [sequelize_1.Op.or]: [{ [sequelize_1.Op.substring]: userName }, { [sequelize_1.Op.iRegexp]: userName }] } : { [sequelize_1.Op.ne]: "" },
                        masterId: masterFind.id,
                        status: status !== null && status !== void 0 ? status : Object.keys(order_dto_1.STATUS),
                        time: time ? { [between]: time } : { [sequelize_1.Op.ne]: 0 },
                        price: !!maxPrice ? { [between]: [minPrice !== null && minPrice !== void 0 ? minPrice : 0, maxPrice] } : { [gte]: minPrice !== null && minPrice !== void 0 ? minPrice : 0 }
                    },
                    include: [{
                            model: models_1.Master,
                            attributes: ['name'],
                        }, {
                            model: models_1.SizeClock,
                            where: {
                                id: sizeIDes !== null && sizeIDes !== void 0 ? sizeIDes : { [sequelize_1.Op.ne]: 0 }
                            },
                            attributes: ['name']
                        }, {
                            model: models_1.City,
                            where: {
                                id: cityIDes !== null && cityIDes !== void 0 ? cityIDes : { [sequelize_1.Op.ne]: 0 }
                            },
                        }, {
                            model: models_1.User,
                            where: {
                                email: userEmails !== null && userEmails !== void 0 ? userEmails : { [sequelize_1.Op.ne]: "" },
                                id: userIDes !== null && userIDes !== void 0 ? userIDes : { [sequelize_1.Op.ne]: 0 }
                            },
                            attributes: ["id"],
                        }], limit, offset
                });
                if (!orders.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(orders);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    getAllOrders(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sorting = (_a = req.query.sorting) !== null && _a !== void 0 ? _a : "name";
                const direction = req.query.ascending === "true" ? global_1.DIRECTION.DOWN : global_1.DIRECTION.UP;
                const { cityIDes, masterIDes, time, status, minPrice, maxPrice, userName } = req.query.filters ? JSON.parse(req.query.filters)
                    : {
                        cityIDes: null,
                        masterIDes: null,
                        time: null,
                        status: null, minPrice: null, maxPrice: null, userName: null
                    };
                const page = (_b = req.query.page) !== null && _b !== void 0 ? _b : 1;
                const limit = (_c = req.query.limit) !== null && _c !== void 0 ? _c : 10;
                const offset = page * limit - limit;
                const orders = yield models_1.Order.findAndCountAll({
                    where: {
                        name: userName ? { [sequelize_1.Op.or]: [{ [sequelize_1.Op.substring]: userName }, { [sequelize_1.Op.iRegexp]: userName }] } : { [sequelize_1.Op.ne]: "" },
                        status: status !== null && status !== void 0 ? status : Object.keys(order_dto_1.STATUS),
                        time: time ? { [between]: time } : { [sequelize_1.Op.ne]: 0 },
                        price: !!maxPrice ? { [between]: [minPrice !== null && minPrice !== void 0 ? minPrice : 0, maxPrice] } : { [gte]: minPrice !== null && minPrice !== void 0 ? minPrice : 0 }
                    },
                    attributes: { exclude: ["ratingLink"] },
                    order: [sorting === order_dto_1.SORTING.MASTER_NAME ? [models_1.Master, "name", direction]
                            : sorting === order_dto_1.SORTING.DATE ? [models_1.SizeClock, sorting, direction] :
                                sorting === order_dto_1.SORTING.CITY_NAME ? [models_1.City, "name", direction] :
                                    sorting === order_dto_1.SORTING.CITY_PRICE ? [models_1.City, "price", direction]
                                        : [sorting, direction]],
                    include: [{
                            model: models_1.Master,
                            where: {
                                id: masterIDes !== null && masterIDes !== void 0 ? masterIDes : { [sequelize_1.Op.ne]: 0 }
                            }
                        }, {
                            model: models_1.SizeClock,
                            attributes: ['date'],
                        }, {
                            model: models_1.User,
                            attributes: ['email'],
                        },
                        {
                            model: models_1.City,
                            where: {
                                id: cityIDes !== null && cityIDes !== void 0 ? cityIDes : { [sequelize_1.Op.ne]: 0 }
                            }
                        }], limit, offset
                });
                if (!orders.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(orders);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    ordersStatistics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tabs = req.query.tabs;
                const { cityIDes, masterIDes, time, } = req.query.filters && tabs !== order_dto_1.TABS.MASTER_STATISTICS ? JSON.parse(req.query.filters)
                    : {
                        cityIDes: null,
                        masterIDes: null,
                        time: null,
                    };
                const orders = yield models_1.Order.findAndCountAll({
                    order: [["time", global_1.DIRECTION.DOWN]],
                    where: {
                        time: time ? { [between]: time } : { [sequelize_1.Op.ne]: 0 },
                    },
                    attributes: { exclude: ["ratingLink", "photoLinks"] },
                    include: [{
                            model: models_1.Master,
                            where: {
                                id: masterIDes !== null && masterIDes !== void 0 ? masterIDes : { [sequelize_1.Op.ne]: 0 }
                            }
                        }, {
                            model: models_1.SizeClock,
                            attributes: ['date', "name"],
                        },
                        {
                            model: models_1.City,
                            where: {
                                id: cityIDes !== null && cityIDes !== void 0 ? cityIDes : { [sequelize_1.Op.ne]: 0 }
                            }
                        }]
                });
                if (tabs !== order_dto_1.TABS.MASTER_STATISTICS) {
                    if (!orders.count) {
                        return res.status(204).json({ message: "List is empty" });
                    }
                }
                const ordersCountList = [];
                if (tabs === order_dto_1.TABS.DATE) {
                    const dateSet = new Set();
                    const dateList = [];
                    orders.rows.map(order => dateSet.add(order.time.toLocaleDateString("uk-UA")));
                    for (let date of dateSet) {
                        const newList = orders.rows.filter(order => order.time.toLocaleDateString("uk-UA") === date);
                        ordersCountList.push(newList.length);
                        dateList.push(date);
                    }
                    return res.status(200).json({ ordersCountList, statisticsList: dateList, totalCount: orders.count });
                }
                else if (tabs === order_dto_1.TABS.CITY) {
                    const cityList = [];
                    const citySet = new Set();
                    orders.rows.map(order => citySet.add(order.city.name));
                    for (let city of citySet) {
                        const newList = orders.rows.filter(order => order.city.name === city);
                        ordersCountList.push(newList.length);
                        cityList.push(city);
                    }
                    return res.status(200).json({ ordersCountList, statisticsList: cityList, totalCount: orders.count });
                }
                else if (tabs === order_dto_1.TABS.TOP_THREE) {
                    const masterList = [];
                    const masterSet = new Set();
                    orders.rows.map(order => masterSet.add(order.master.id));
                    for (let master of masterSet) {
                        const newList = orders.rows.filter(order => order.master.id === master);
                        masterList.push({ name: newList[0].master.name, totalOrders: newList.length });
                    }
                    masterList.sort((a, b) => a.totalOrders < b.totalOrders ? 1 : -1);
                    if (masterList.length > 3) {
                        const anotherTotalOrders = masterList.splice(3, masterList.length - 3).reduce((sum, current) => sum + current.totalOrders, 0);
                        masterList.push({ name: "Остальные", totalOrders: anotherTotalOrders });
                    }
                    return res.status(200).json({ masterList, totalCount: orders.count });
                }
                else if (tabs === order_dto_1.TABS.MASTER_STATISTICS) {
                    const masterListStatistics = [];
                    const masters = yield models_1.Master.findAll({ order: [["name", global_1.DIRECTION.DOWN]] });
                    const sizeClocks = yield models_1.SizeClock.findAll({
                        attributes: ["name"],
                    });
                    masters.map(master => {
                        var _a, _b;
                        const newList = orders.rows.filter(order => order.master.id === master.id);
                        const dataMaster = {
                            name: "",
                            totalOrders: 0,
                            rating: 0,
                            statusFinished: 0,
                            statusUnfinished: 0,
                            size: {},
                            totalPrice: 0
                        };
                        if (newList.length === 0) {
                            dataMaster.name = master.name;
                            sizeClocks.map(clock => { var _a; return dataMaster.size = (0, defaults_1.default)(dataMaster.size, { [clock.name]: (_a = (0, countBy_1.default)(newList, { sizeClock: { name: clock.name } }).true) !== null && _a !== void 0 ? _a : 0 }); });
                            masterListStatistics.push(dataMaster);
                        }
                        else {
                            const statusCount = (0, countBy_1.default)(newList, { status: order_dto_1.STATUS.DONE });
                            dataMaster.name = newList[0].master.name;
                            dataMaster.totalOrders = newList.length;
                            dataMaster.rating = newList[0].master.rating;
                            dataMaster.statusFinished = (_a = statusCount.true) !== null && _a !== void 0 ? _a : 0;
                            dataMaster.statusUnfinished = (_b = statusCount.false) !== null && _b !== void 0 ? _b : 0;
                            sizeClocks.map(clock => { var _a; return dataMaster.size = (0, defaults_1.default)(dataMaster.size, { [clock.name]: (_a = (0, countBy_1.default)(newList, { sizeClock: { name: clock.name } }).true) !== null && _a !== void 0 ? _a : 0 }); });
                            dataMaster.totalPrice = newList.reduce((sum, current) => sum + (current.status === order_dto_1.STATUS.DONE ? current.price : 0), 0);
                            masterListStatistics.push(dataMaster);
                        }
                    });
                    return res.status(200).json({ masterListStatistics, totalCount: orders.count });
                }
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    getPhotos(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = +req.params.orderId;
                const orders = yield models_1.Order.findAll({
                    where: {
                        id: orderId,
                        photoLinks: { [sequelize_1.Op.not]: null }
                    },
                    attributes: ["photoLinks"]
                });
                if (!orders || orders.length === 0) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(orders);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    exportToExcel(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sorting = (_a = req.query.sorting) !== null && _a !== void 0 ? _a : "name";
                const direction = req.query.ascending === "true" ? global_1.DIRECTION.DOWN : global_1.DIRECTION.UP;
                const { cityIDes, masterIDes, time, status, minPrice, maxPrice, userName } = req.query.filters !== "null" ? JSON.parse(req.query.filters)
                    : {
                        cityIDes: null,
                        masterIDes: null,
                        time: null,
                        status: null, minPrice: null, maxPrice: null, userName: null
                    };
                const orders = yield models_1.Order.findAll({
                    where: {
                        name: userName ? { [sequelize_1.Op.substring]: userName !== null && userName !== void 0 ? userName : "" } : { [sequelize_1.Op.ne]: "" },
                        status: status !== null && status !== void 0 ? status : Object.keys(order_dto_1.STATUS),
                        time: time ? { [between]: time } : { [sequelize_1.Op.ne]: 0 },
                        price: !!maxPrice ? { [between]: [minPrice !== null && minPrice !== void 0 ? minPrice : 0, maxPrice] } : { [gte]: minPrice !== null && minPrice !== void 0 ? minPrice : 0 }
                    },
                    order: [sorting === order_dto_1.SORTING.MASTER_NAME ? [models_1.Master, "name", direction]
                            : sorting === order_dto_1.SORTING.DATE ? [models_1.SizeClock, sorting, direction] :
                                sorting === order_dto_1.SORTING.CITY_NAME ? [models_1.City, "name", direction] :
                                    sorting === order_dto_1.SORTING.CITY_PRICE ? [models_1.City, "price", direction]
                                        : [sorting, direction]],
                    include: [{
                            model: models_1.Master,
                            attributes: ["name"],
                            where: {
                                id: masterIDes !== null && masterIDes !== void 0 ? masterIDes : { [sequelize_1.Op.ne]: 0 }
                            }
                        }, {
                            model: models_1.SizeClock,
                            attributes: ['date'],
                        },
                        {
                            model: models_1.City,
                            attributes: ["price", "name"],
                            where: {
                                id: cityIDes !== null && cityIDes !== void 0 ? cityIDes : { [sequelize_1.Op.ne]: 0 }
                            }
                        }],
                    attributes: ["id", "name", "time", "endTime", "status", "price"],
                    raw: true
                });
                if (!orders) {
                    return res.status(204).json({ message: "List is empty" });
                }
                const rightOrders = orders.map((order) => ({
                    id: order.id,
                    name: order.name,
                    startTime: new Date(order.time).toLocaleString('uk-UA'),
                    endTime: new Date(order.endTime).toLocaleString('uk-UA'),
                    masterName: order['master.name'],
                    cityName: order['city.name'],
                    priceForHour: `$` + order['city.price'],
                    time: order['sizeClock.date'],
                    totalPrice: `$` + order.price,
                    status: order.status
                }));
                const headings = [
                    ["id", "Имя", "Дата и время", "Конец заказа", "Мастер", "Город", "Цена за час", "Кол-во часов", "Итог", "Статус"]
                ];
                const ws = yield xlsx_1.default.utils.json_to_sheet(rightOrders, {});
                const wb = xlsx_1.default.utils.book_new();
                xlsx_1.default.utils.sheet_add_aoa(ws, headings);
                xlsx_1.default.utils.book_append_sheet(wb, ws, 'Orders');
                const buffer = xlsx_1.default.write(wb, { bookType: 'xlsx', type: 'buffer' });
                return res.send(buffer);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    update(req, res, next, userId, time, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                const { name, sizeClockId, masterId, cityId, price } = req.body;
                if (orderId <= 0) {
                    next(ApiError_1.default.badRequest("cityId is wrong"));
                }
                const orderUpdate = yield models_1.Order.update({
                    name,
                    sizeClockId,
                    time,
                    endTime,
                    masterId,
                    cityId,
                    userId,
                    price
                }, { where: { id: orderId } });
                return orderUpdate;
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    statusChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                const status = req.body.status;
                if (!(status in order_dto_1.statusList)) {
                    return next(ApiError_1.default.badRequest("INVALID STATUS"));
                }
                const orderUpdate = yield models_1.Order.update({
                    status: status,
                }, { where: { id: orderId } });
                if (status === order_dto_1.STATUS.DONE) {
                    const mailInfo = yield models_1.Order.findOne({
                        where: { id: orderId },
                        attributes: ["masterId", "id", "ratingLink", "price", "time", "endTime"],
                        include: [{
                                model: models_1.User,
                                attributes: ["email"],
                            }, {
                                model: models_1.Master,
                                attributes: ["name"],
                                include: [{
                                        model: models_1.User,
                                        attributes: ["email"],
                                    }]
                            }, {
                                model: models_1.SizeClock,
                                attributes: ["name"],
                            }, {
                                model: models_1.City,
                                attributes: ["name"],
                            }],
                    });
                    if (!mailInfo || !mailInfo.user) {
                        next(ApiError_1.default.badRequest("Wrong request"));
                        return;
                    }
                    else if (mailInfo.ratingLink) {
                        return orderUpdate;
                    }
                    const ratingLink = (0, uuid_1.v4)();
                    mailInfo.ratingLink = ratingLink;
                    yield mailInfo.save();
                    const email = mailInfo.user.email;
                    const pdf = yield this.pdfCreate(mailInfo);
                    mailService_1.default.sendOrderDone(email, orderId, `${process.env.RATING_URL}/${ratingLink}`, pdf, next);
                }
                return orderUpdate;
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    payPalChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.event_type === "CHECKOUT.ORDER.APPROVED") {
                    const orderId = req.body.resource.purchase_units[0].description;
                    const payPalId = req.body.resource.id;
                    const orderUpdate = yield models_1.Order.update({
                        payPalId: payPalId
                    }, { where: { id: orderId } });
                    return orderUpdate;
                }
                else if (req.body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
                    const payPalId = req.body.resource.supplementary_data.related_ids.order_id;
                    const orderUpdate = yield models_1.Order.findOne({ where: { payPalId: payPalId } });
                    if (!orderUpdate) {
                        next(ApiError_1.default.badRequest("Error event"));
                        return;
                    }
                    yield orderUpdate.update({
                        status: order_dto_1.STATUS.ACCEPTED
                    });
                    return orderUpdate;
                }
                else {
                    next(ApiError_1.default.badRequest("Error event"));
                    return;
                }
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
                const orderId = req.params.orderId;
                yield models_1.Order.destroy({ where: { id: orderId } });
                return res.status(204).json({ message: "success" });
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    cloudnaryUpload(orderId, photos, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield Promise.all(photos.map((photo) => {
                    const result = cloudinary.uploader.upload(photo);
                    return result;
                }));
                if (!results) {
                    return;
                }
                const photoLinks = results.map(result => result.url);
                yield models_1.Order.update({
                    photoLinks,
                }, { where: { id: orderId } });
                return;
            }
            catch (e) {
                next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    downloadPhotos(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.query.orderId;
                const orderInfo = yield models_1.Order.findOne({
                    where: { id: orderId },
                    attributes: ["photoLinks"]
                });
                if (!orderInfo || !orderInfo.photoLinks) {
                    return;
                }
                const zip = new jszip_1.default();
                const photos = yield Promise.all(orderInfo.photoLinks.map((url) => {
                    return (0, axios_1.default)({
                        url,
                        method: 'GET',
                        responseType: 'arraybuffer'
                    });
                }));
                photos.map((photo, index) => zip.file(`image№${index + 1}.${photo.headers['content-type'].split('/')[1]}`, photo.data, { base64: true }));
                return res.send(yield zip.generateAsync({ type: "nodebuffer" }));
            }
            catch (e) {
                next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    createBill(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.query.orderId;
                const orderInfo = yield models_1.Order.findOne({
                    where: { id: orderId },
                    attributes: ["masterId", "id", "ratingLink", "price", "time", "endTime", "status"],
                    include: [{
                            model: models_1.User,
                            attributes: ["email"],
                        }, {
                            model: models_1.Master,
                            attributes: ["name"],
                            include: [{
                                    model: models_1.User,
                                    attributes: ["email"],
                                }]
                        }, {
                            model: models_1.SizeClock,
                            attributes: ["name"],
                        }, {
                            model: models_1.City,
                            attributes: ["name"],
                        }],
                });
                if (!orderInfo || !orderInfo.user) {
                    next(ApiError_1.default.badRequest("Wrong request"));
                    return;
                }
                if (orderInfo.status !== order_dto_1.STATUS.DONE) {
                    next(ApiError_1.default.forbidden("Invalid status "));
                    return;
                }
                const bufferPDF = yield this.pdfCreate(orderInfo);
                return res.send(bufferPDF);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    pdfCreate(mailInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../templates/pdfTemplate.html'), "utf8");
            const qr = yield qrcode_1.default.toDataURL(`Номер заказа: ${mailInfo.id}, Дата начало заказа: ${mailInfo.time.toLocaleString("uk-UA", { timeZone: "Europe/Kiev" })}, Дата конец заказа: ${mailInfo.endTime.toLocaleString("uk-UA", { timeZone: "Europe/Kiev" })}, Email пользователя:${mailInfo.user.email}, Email мастера:${mailInfo.master.user.email}, Тип услуги: ${mailInfo.sizeClock.name}, Город: ${mailInfo.city.name}, Цена: ${mailInfo.price}`);
            const data = {
                id: mailInfo.id,
                dateStart: mailInfo.time.toLocaleString("uk-UA", { timeZone: "Europe/Kiev" }),
                dateEnd: mailInfo.endTime.toLocaleString("uk-UA", { timeZone: "Europe/Kiev" }),
                clock: mailInfo.sizeClock.name,
                city: mailInfo.city.name,
                userEmail: mailInfo.user.email,
                masterEmail: mailInfo.master.user.email,
                price: mailInfo.price,
                qr
            };
            const options = {
                format: "A4",
                orientation: "portrait",
                border: "10mm",
            };
            const document = {
                html: html,
                data: data,
                type: "buffer",
            };
            const res = yield order_dto_1.default.create(document, options);
            return res;
        });
    }
}
exports.default = new OrderLogic();
