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
const db_1 = __importDefault(require("../db"));
const models_1 = require("../models/models");
const global_1 = require("../dto/global");
const date_fns_1 = require("date-fns");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const createTest = {
    dbData: {
        cities: [{ id: 1, name: "Dnepr", price: 21 }, { id: 2, name: "Ужгород", price: 21 }],
        user: { id: 1, email: "userForMaster@gmail.com", password: "secretpassword", role: global_1.ROLES.MASTER },
        sizeClocks: [{ id: 1, name: "Маленькие", date: "01:00:00" }, { id: 2, name: "Средние", date: "02:00:00" }],
        master: { id: 1, name: "alex", rating: 0, userId: 1, isActivated: true }
    },
    createOrder: {
        payload: {
            name: "Ihor",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 201,
            orderId: 1,
        }
    },
    nameIsEmpty: {
        payload: {
            name: "",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "name"
        }
    },
    nameIsNull: {
        payload: {
            name: null,
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "name"
        }
    },
    timeIsNull: {
        payload: {
            name: "Vasya",
            time: null,
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "time"
        }
    },
    timeIsEmpty: {
        payload: {
            name: "Vasya",
            time: '',
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "time"
        }
    },
    emailIsWrong: {
        payload: {
            name: "Vasya",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrdes",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "email"
        }
    },
    emailIsNull: {
        payload: {
            name: "Vasya",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: null,
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "email"
        }
    },
    cityIdIsWrong: {
        payload: {
            name: "Vasya",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 999,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: 'WRONG CityId',
        }
    },
    cityIdIsNull: {
        payload: {
            name: "Vasya",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: null,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "cityId"
        }
    },
    masterIdIsWrong: {
        payload: {
            name: "Vasya",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 999,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Wrong request",
        }
    },
    masterIdIsNull: {
        payload: {
            name: "Vasya",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: null,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "masterId"
        }
    },
    sizeClockIdIsWrong: {
        payload: {
            name: "Vasya",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 999,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "WRONG sizeClockId",
        }
    },
    sizeClockIdIsNull: {
        payload: {
            name: "Vasya",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: null,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "sizeClockId"
        }
    },
    priceIsEmpty: {
        payload: {
            name: "Vasya",
            time: (0, date_fns_1.set)(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: "",
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "price"
        }
    },
};
describe("order create test", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.sync({
            force: true
        });
        yield models_1.User.create(createTest.dbData.user);
        yield models_1.City.bulkCreate(createTest.dbData.cities);
        yield models_1.SizeClock.bulkCreate(createTest.dbData.sizeClocks);
        yield models_1.Master.create(createTest.dbData.master);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.drop({ cascade: true });
    }));
    test("name is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.nameIsEmpty.payload);
            expect(response.status).toBe(createTest.nameIsEmpty.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.nameIsEmpty.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.nameIsEmpty.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("name is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.nameIsNull.payload);
            expect(response.status).toBe(createTest.nameIsNull.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.nameIsNull.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.nameIsNull.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("time is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.timeIsNull.payload);
            expect(response.status).toBe(createTest.timeIsNull.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.timeIsNull.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.timeIsNull.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("time is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.timeIsEmpty.payload);
            expect(response.status).toBe(createTest.timeIsEmpty.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.timeIsEmpty.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.timeIsEmpty.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("email is wrong", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.emailIsWrong.payload);
            expect(response.status).toBe(createTest.emailIsWrong.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.emailIsWrong.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.emailIsWrong.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("email is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.emailIsNull.payload);
            expect(response.status).toBe(createTest.emailIsNull.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.emailIsNull.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.emailIsNull.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("cityId is wrong", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.cityIdIsWrong.payload);
            expect(response.status).toBe(createTest.cityIdIsWrong.expectResponse.status);
            expect(JSON.parse(response.text).message).toBe(createTest.cityIdIsWrong.expectResponse.msg);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("cityId is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.cityIdIsNull.payload);
            expect(response.status).toBe(createTest.cityIdIsNull.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.cityIdIsNull.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.cityIdIsNull.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("masterId is wrong", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.masterIdIsWrong.payload);
            expect(response.status).toBe(createTest.masterIdIsWrong.expectResponse.status);
            expect(JSON.parse(response.text).message).toBe(createTest.masterIdIsWrong.expectResponse.msg);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("masterId is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.masterIdIsNull.payload);
            expect(response.status).toBe(createTest.masterIdIsNull.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.masterIdIsNull.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.masterIdIsNull.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("sizeClockId is wrong", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.sizeClockIdIsWrong.payload);
            expect(response.status).toBe(createTest.sizeClockIdIsWrong.expectResponse.status);
            expect(JSON.parse(response.text).message).toBe(createTest.sizeClockIdIsWrong.expectResponse.msg);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("sizeClockId is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.sizeClockIdIsNull.payload);
            expect(response.status).toBe(createTest.sizeClockIdIsNull.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.sizeClockIdIsNull.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.sizeClockIdIsNull.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("price is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.priceIsEmpty.payload);
            expect(response.status).toBe(createTest.priceIsEmpty.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.priceIsEmpty.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.priceIsEmpty.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("create order", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post(`/api/orders/`).send(createTest.createOrder.payload);
        expect(response.statusCode).toBe(createTest.createOrder.expectResponse.status);
        expect(response.body.orderId).toBe(createTest.createOrder.expectResponse.orderId);
    }));
});
