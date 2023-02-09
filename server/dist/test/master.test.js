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
const app_1 = require("../app");
const db_1 = __importDefault(require("../db"));
const global_1 = require("../dto/global");
const supertest_1 = __importDefault(require("supertest"));
const createTest = {
    dbData: {
        cities: [{ id: 1, name: "Dnepr", price: 21 }, { id: 2, name: "Ужгород", price: 21 }]
    },
    rightMaster: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: "clock12@mail.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            id: 1,
            role: global_1.ROLES.MASTER,
            status: 201
        }
    },
    wrongEmail: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: "clocks",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'email'
        }
    },
    emailIsNull: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: null,
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'email'
        }
    },
    wrongCityId: {
        payload: {
            cityId: [999],
            name: "alex",
            rating: 0,
            email: "clocks@dasda.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "WRONG request",
        }
    },
    cityIdIsNull: {
        payload: {
            cityId: null,
            name: "alex",
            rating: 0,
            email: "clocks@dasda.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "WRONG request",
        }
    },
    wrongPassword: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: "c2@dsas.com",
            password: 'pas',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'password'
        }
    },
    passwordIsNull: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: "c2@dsas.com",
            password: null,
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'password'
        }
    },
    nameIsNull: {
        payload: {
            cityId: [1, 2],
            name: null,
            rating: 0,
            email: "c34@dsas.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'name'
        }
    },
    emptyName: {
        payload: {
            cityId: [1, 2],
            name: "",
            rating: 0,
            email: "xc34@dsas.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'name'
        }
    }
};
describe("master create test", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.sync({
            force: true
        });
        yield models_1.City.bulkCreate(createTest.dbData.cities);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.drop({ cascade: true });
    }));
    test("create right master", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/users/registration/`).send(createTest.rightMaster.payload);
            expect(response.body.newUser.email).toBe(createTest.rightMaster.payload.email);
            expect(response.body.newUser.role).toBe(createTest.rightMaster.expectResponse.role);
            expect(response.body.newUser.id).toBe(createTest.rightMaster.expectResponse.id);
            expect(response.statusCode).toBe(createTest.rightMaster.expectResponse.status);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("wrong email", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/users/registration/`).send(createTest.wrongEmail.payload);
            expect(response.status).toBe(createTest.wrongEmail.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.wrongEmail.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.wrongEmail.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("email is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/users/registration/`).send(createTest.emailIsNull.payload);
            expect(response.status).toBe(createTest.emailIsNull.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.emailIsNull.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.emailIsNull.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("wrong cityId", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/users/registration/`).send(createTest.wrongCityId.payload);
            expect(response.status).toBe(createTest.wrongCityId.expectResponse.status);
            expect(JSON.parse(response.text).message).toBe(createTest.wrongCityId.expectResponse.msg);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("cityId is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/users/registration/`).send(createTest.cityIdIsNull.payload);
            expect(response.status).toBe(createTest.cityIdIsNull.expectResponse.status);
            expect(JSON.parse(response.text).message).toBe(createTest.cityIdIsNull.expectResponse.msg);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/users/registration/`).send(createTest.wrongPassword.payload);
            expect(response.status).toBe(createTest.wrongPassword.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.wrongPassword.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.wrongPassword.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("password is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/users/registration/`).send(createTest.passwordIsNull.payload);
            expect(response.status).toBe(createTest.passwordIsNull.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.passwordIsNull.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.passwordIsNull.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("name is null", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/users/registration/`).send(createTest.nameIsNull.payload);
            expect(response.status).toBe(createTest.nameIsNull.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.nameIsNull.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.nameIsNull.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
    test("Empty name", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, supertest_1.default)(app_1.app).post(`/api/users/registration/`).send(createTest.emptyName.payload);
            expect(response.status).toBe(createTest.emptyName.expectResponse.status);
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.emptyName.expectResponse.msg);
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.emptyName.expectResponse.param);
        }
        catch (e) {
            console.log(e);
        }
    }));
});
