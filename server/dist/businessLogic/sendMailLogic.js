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
const date_fns_1 = require("date-fns");
const models_1 = require("../models/models");
const mailService_1 = __importDefault(require("../service/mailService"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
class SendMailLogic {
    sendMessage(req, next, result) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cityName = result.city.name;
                const size = result.clock.name;
                const orderNumber = result.order.id;
                const { name, email, masterId, password } = req.body;
                let { time } = req.body;
                const masterMail = yield models_1.Master.findOne({
                    where: {
                        id: masterId
                    },
                    include: { all: true, nested: true }
                });
                if (!masterMail || masterMail.user === undefined) {
                    next(ApiError_1.default.badRequest("masterId is wrong"));
                    return;
                }
                time = new Date(time).toLocaleString("uk-UA", { timeZone: "Europe/Kiev" });
                const mailInfo = {
                    name,
                    time,
                    email,
                    password,
                    size,
                    masterName: masterMail.name,
                    cityName,
                    orderNumber,
                };
                mailService_1.default.sendMail(mailInfo, next);
                if (password) {
                    mailService_1.default.userInfo(mailInfo, next);
                }
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    remaindMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const checkTime = (0, date_fns_1.set)(new Date(), {
                hours: (0, date_fns_1.getHours)(new Date()) + 1,
                minutes: 0,
                seconds: 0,
                milliseconds: 0
            });
            const masters = yield models_1.Master.findAll({
                where: {},
                attributes: ["id"],
                include: [{
                        model: models_1.User,
                        attributes: ["email"]
                    },
                    {
                        model: models_1.Order,
                        where: {
                            time: checkTime
                        }
                    }]
            });
            if (masters.length === 0) {
                return;
            }
            masters.map(master => {
                if (!master.user || !master.orders) {
                    return;
                }
                mailService_1.default.remindMail({ email: master.user.email, orderNumber: master.orders[0].id });
            });
        });
    }
}
exports.default = new SendMailLogic();
