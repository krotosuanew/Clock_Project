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
const express_validator_1 = require("express-validator");
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.registration(req, res, next);
        });
    }
    changeEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.changeEmail(req, res, next);
        });
    }
    registrationFromAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.registrationFromAdmin(req, res, next);
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.login(req, res, next);
        });
    }
    loginService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.loginService(req, res, next);
        });
    }
    check(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.check(req, res);
        });
    }
    checkEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.checkEmail(req, res);
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.getAll(req, res, next);
        });
    }
    getAllCustomers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.getAllCustomers(req, res, next);
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.deleteOne(req, res, next);
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.activate(req, res, next);
        });
    }
    activateAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            yield userLogic_1.default.activateAdmin(req, res, next);
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userLogic_1.default.updateUser(req, res, next);
        });
    }
}
exports.default = new UserController();
