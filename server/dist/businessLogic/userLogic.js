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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const models_1 = require("../models/models");
const bcrypt = __importStar(require("bcrypt"));
const express_validator_1 = require("express-validator");
const mailService_1 = __importDefault(require("../service/mailService"));
const uuid_1 = require("uuid");
const masterController_1 = __importDefault(require("../controllers/masterController"));
const db_1 = __importDefault(require("../db"));
const global_1 = require("../dto/global");
const sequelize_1 = require("sequelize");
const base64url_1 = __importDefault(require("base64url"));
const crypto_1 = __importDefault(require("crypto"));
const generateJwt = (id, email, role, isActivated, name) => {
    return jsonwebtoken_1.default.sign({ id, email, role, isActivated, name }, process.env.SECRET_KEY, { expiresIn: '24h' });
};
class UserLogic {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const result = yield db_1.default.transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const { email, password, isMaster, name } = req.body;
                    const role = isMaster ? global_1.ROLES.MASTER : global_1.ROLES.CUSTOMER;
                    const candidate = yield models_1.User.findOne({ where: { email } });
                    if (candidate) {
                        if (candidate.password !== null) {
                            return next(ApiError_1.default.badRequest('User with this email already exists'));
                        }
                        yield models_1.Customer.create({ userId: candidate.id, name: name });
                        const hashPassword = yield bcrypt.hash(password, 5);
                        const activationLink = (0, uuid_1.v4)();
                        yield candidate.update({ password: hashPassword, activationLink, role });
                        yield mailService_1.default.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next);
                        return res.status(201).json(candidate);
                    }
                    const hashPassword = yield bcrypt.hash(password, 5);
                    const activationLink = (0, uuid_1.v4)();
                    const newUser = yield models_1.User.create({ email, role, password: hashPassword, activationLink });
                    if (isMaster) {
                        req.body.userId = newUser.id;
                        yield masterController_1.default.create(req, res, next);
                    }
                    else {
                        yield models_1.Customer.create({ userId: newUser.id, name });
                    }
                    yield mailService_1.default.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next);
                    return res.status(201).json({ newUser });
                }));
                return result;
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    registrationFromAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.isActivated = true;
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const result = yield db_1.default.transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const { email, password, isMaster, name, isActivated } = req.body;
                    const role = isMaster ? global_1.ROLES.MASTER : global_1.ROLES.CUSTOMER;
                    const candidate = yield models_1.User.findOne({ where: { email } });
                    if (candidate) {
                        if (candidate.password !== null) {
                            return next(ApiError_1.default.badRequest('User with this email already exists'));
                        }
                        else {
                            yield models_1.Customer.create({ userId: candidate.id, name: name });
                            const token = generateJwt(candidate.id, candidate.email, candidate.role);
                            return res.json({ token });
                        }
                    }
                    const hashPassword = yield bcrypt.hash(password, 5);
                    const newUser = yield models_1.User.create({ email, role, password: hashPassword, isActivated });
                    if (isMaster) {
                        req.body.userId = newUser.id;
                        yield masterController_1.default.create(req, res, next);
                    }
                    else {
                        yield models_1.Customer.create({ userId: newUser.id, name });
                    }
                    return res.status(201).json({ newUser });
                }));
                return result;
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    GetOrCreateUser(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, regCustomer, changeName } = req.body;
                const candidate = yield models_1.User.findOne({ where: { email }, include: { all: true, nested: true } });
                if (candidate) {
                    if (changeName && candidate.password !== null) {
                        yield models_1.Customer.update({ name: name }, { where: { userId: candidate.id } });
                        const customer = yield models_1.Customer.findOne({ where: { userId: candidate.id } });
                        const token = generateJwt(candidate.id, candidate.email, candidate.role, candidate.isActivated, (_a = customer === null || customer === void 0 ? void 0 : customer.name) !== null && _a !== void 0 ? _a : "");
                        candidate.token = token;
                    }
                    if (!regCustomer) {
                        return candidate;
                    }
                }
                let newUser;
                if (regCustomer) {
                    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    const passwordLength = 8;
                    let password = "";
                    for (let i = 0; i <= passwordLength; i++) {
                        const randomNumber = Math.floor(Math.random() * chars.length);
                        password += chars.substring(randomNumber, randomNumber + 1);
                    }
                    const hashPassword = yield bcrypt.hash(password, 5);
                    req.body.password = password;
                    if (candidate) {
                        newUser = yield candidate.update({ password: hashPassword, isActivated: true });
                    }
                    else {
                        newUser = yield models_1.User.create({ email, password: hashPassword, isActivated: true });
                    }
                    yield models_1.Customer.create({ userId: newUser.id, name });
                }
                else {
                    newUser = yield models_1.User.create({ email });
                }
                return newUser;
            }
            catch (e) {
                throw new Error('Email is wrong');
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const { email, password } = req.body.dataForAuthorizations;
                const userLogin = yield models_1.User.findOne({
                    where: { email },
                    include: { all: true, nested: true }
                });
                if (!userLogin) {
                    return next(ApiError_1.default.NotFound('Customer with this name not found'));
                }
                const comparePassword = bcrypt.compareSync(password, userLogin.password);
                if (!comparePassword) {
                    return next(ApiError_1.default.Unauthorized('Wrong password'));
                }
                let token = "";
                if (userLogin.master !== undefined && userLogin.role === global_1.ROLES.MASTER) {
                    token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.isActivated, userLogin.master.name);
                }
                else if (userLogin.customer !== undefined && userLogin.role === global_1.ROLES.CUSTOMER) {
                    token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.isActivated, userLogin.customer.name);
                }
                else if (userLogin.role === global_1.ROLES.ADMIN) {
                    token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.isActivated);
                }
                else {
                    next(ApiError_1.default.badRequest("Wrong role"));
                }
                return res.status(201).json({ token });
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    loginService(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                let name, email, facebookId;
                const isMaster = req.body.dataForAuthorizations.isMaster;
                if (!!req.body.dataForAuthorizations.responseGoogle) {
                    const serviceJWT = jsonwebtoken_1.default.decode(req.body.dataForAuthorizations.responseGoogle);
                    name = serviceJWT.name;
                    email = serviceJWT.email;
                    if (serviceJWT.iss !== process.env.GOOGLE_TOKEN) {
                        next(ApiError_1.default.badRequest("Wrong request"));
                    }
                }
                if (!!req.body.dataForAuthorizations.responseFacebook) {
                    const data = this.parseSignedRequest(req.body.dataForAuthorizations.responseFacebook.signedRequest, process.env.FACEBOOOK_SECRET);
                    if (typeof data === "object") {
                        name = req.body.dataForAuthorizations.responseFacebook.name;
                        email = (_a = req.body.dataForAuthorizations.responseFacebook.email) !== null && _a !== void 0 ? _a : null;
                        facebookId = +req.body.dataForAuthorizations.responseFacebook.id;
                    }
                }
                const user = email ? yield models_1.User.findOne({
                    where: { email },
                    include: { all: true, nested: true }
                }) : yield models_1.User.findOne({
                    where: { facebookId },
                    include: { all: true, nested: true }
                });
                if (user && user.customer !== undefined && user.role === global_1.ROLES.CUSTOMER) {
                    const token = generateJwt(user.id, user.email, user.role, user.isActivated, (_b = user === null || user === void 0 ? void 0 : user.customer) === null || _b === void 0 ? void 0 : _b.name);
                    return res.status(201).json({ token });
                }
                if (user && user.master !== undefined && user.role === global_1.ROLES.MASTER) {
                    const token = generateJwt(user.id, user.email, user.role, user.isActivated, user.master.name);
                    return res.status(201).json({ token });
                }
                if (!user) {
                    let emailExample = "";
                    let newUser;
                    if (!email) {
                        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                        const emailLength = 3 + Math.floor(Math.random() * 10);
                        for (let i = 0; i <= emailLength; i++) {
                            const randomNumber = Math.floor(Math.random() * chars.length);
                            emailExample += chars.substring(randomNumber, randomNumber + 1);
                        }
                        emailExample += "@clockwise.com";
                    }
                    newUser = yield models_1.User.create({
                        email: email !== null && email !== void 0 ? email : emailExample,
                        password: !!facebookId ? "Facebook" : "google",
                        role: isMaster ? global_1.ROLES.MASTER : global_1.ROLES.CUSTOMER,
                        isActivated: true,
                        facebookId: facebookId
                    });
                    if (isMaster) {
                        req.body.cityId = req.body.dataForAuthorizations.cityList;
                        req.body.userId = newUser.id;
                        req.body.name = name;
                        yield masterController_1.default.create(req, res, next);
                    }
                    else {
                        yield models_1.Customer.create({ userId: newUser.id, name });
                    }
                    const token = generateJwt(newUser.id, newUser.email, newUser.role, newUser.isActivated, name);
                    return res.status(201).json({ token });
                }
                next(ApiError_1.default.badRequest("Wrong request"));
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    check(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.isActivated, req.user.name);
            return res.status(200).json({ token });
        });
    }
    checkEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            const userCheck = yield models_1.User.findOne({ where: { email: email } });
            if (!userCheck || userCheck.password === null) {
                return res.status(204).send({ message: "204" });
            }
            return res.status(200).json({ userCheck });
        });
    }
    changeEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const exampleEmail = req.body.exampleEmail;
                const user = yield models_1.User.findOne({ where: { email: exampleEmail }, include: { all: true, nested: true } });
                if (!user) {
                    next(ApiError_1.default.badRequest("Wrong email"));
                    return;
                }
                yield user.update({ email });
                if (user.customer !== undefined && user.role === global_1.ROLES.CUSTOMER) {
                    const token = generateJwt(user.id, user.email, user.role, user.isActivated, user.customer.name);
                    return res.status(200).json({ token });
                }
            }
            catch (e) {
                next(ApiError_1.default.badRequest("Wrong request"));
                return;
            }
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const { email, password } = req.body;
                let hashPassword;
                if (password) {
                    hashPassword = yield bcrypt.hash(password, 5);
                }
                const userUpdate = yield models_1.User.update({
                    email: email, password: hashPassword,
                }, { where: { id: userId } });
                yield mailService_1.default.updateMail(email, password !== null && password !== void 0 ? password : undefined, next);
                return res.status(201).json({ userUpdate });
            }
            catch (e) {
                next(ApiError_1.default.badRequest("Wrong request"));
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
                const sorting = (_c = req.query.sorting) !== null && _c !== void 0 ? _c : "id";
                const directionUp = req.query.ascending === "true" ? 'ASC' : 'DESC';
                const offset = page * limit - limit;
                const users = yield models_1.User.findAndCountAll({
                    order: [[sorting, directionUp]],
                    attributes: ["email", "id", "role", "isActivated"],
                    include: [{
                            model: models_1.Master
                        }], limit, offset
                });
                if (!users.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(users);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    getAllCustomers(req, res, next) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = (_a = req.query.page) !== null && _a !== void 0 ? _a : 1;
                const limit = (_b = req.query.limit) !== null && _b !== void 0 ? _b : 10;
                const sorting = (_c = req.query.sorting) !== null && _c !== void 0 ? _c : "id";
                const offset = page * limit - limit;
                const email = (_d = req.query.email) !== null && _d !== void 0 ? _d : null;
                const users = yield models_1.User.findAll({
                    order: [[sorting, "ASC"]],
                    where: {
                        email: email ? { [sequelize_1.Op.or]: [{ [sequelize_1.Op.substring]: email }, { [sequelize_1.Op.iRegexp]: email }] } : { [sequelize_1.Op.ne]: "" },
                        role: global_1.ROLES.CUSTOMER
                    },
                    attributes: ["id", "email"], limit, offset
                });
                if (!users) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(users);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const userId = Number(req.params.userId);
                const userDelete = yield models_1.User.findOne({
                    where: { id: userId },
                    include: { all: true, nested: true },
                    attributes: ["id", "role"]
                });
                if (userDelete === null)
                    return next(ApiError_1.default.Conflict("Customer has orders"));
                if (userDelete.role === "CUSTOMER" && (userDelete === null || userDelete === void 0 ? void 0 : userDelete.orders.length) === 0
                    || userDelete.role === "MASTER" && (userDelete === null || userDelete === void 0 ? void 0 : userDelete.master.orders.length) === 0) {
                    yield userDelete.destroy();
                    return res.status(204).json({ message: "success" });
                }
                else {
                    next(ApiError_1.default.Conflict("Customer has orders"));
                    return;
                }
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationLink = req.params.link;
                const userActivate = yield models_1.User.findOne({ where: { activationLink } });
                if (!userActivate) {
                    next(ApiError_1.default.badRequest("Not activated"));
                    return;
                }
                userActivate.isActivated = true;
                yield userActivate.save();
                return res.redirect(process.env.CLIENT_URL);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
                return;
            }
        });
    }
    activateAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const isActivated = req.body.isActivated;
                const userActivate = yield models_1.User.update({
                    isActivated: isActivated,
                }, { where: { id: userId } });
                return res.status(201).json(userActivate);
            }
            catch (e) {
                next(ApiError_1.default.badRequest("Wrong request"));
                return;
            }
        });
    }
    parseSignedRequest(signed_request, secret) {
        const encoded_data = signed_request.split('.', 2);
        const sig = encoded_data[0];
        const json = base64url_1.default.decode(encoded_data[1]);
        const data = JSON.parse(json);
        if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
            console.error('Unknown algorithm. Expected HMAC-SHA256');
            return 'Unknown algorithm. Expected HMAC-SHA256';
        }
        const expected_sig = crypto_1.default.createHmac('sha256', secret).update(encoded_data[1]).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace('=', '');
        if (sig !== expected_sig) {
            console.error('Bad signed JSON Signature!');
            return 'Bad signed JSON Signature!';
        }
        return data;
    }
}
exports.default = new UserLogic();
