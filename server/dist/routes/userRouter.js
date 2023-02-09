"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const checkRoleMiddleware_1 = __importDefault(require("../middleware/checkRoleMiddleware"));
const express_validator_1 = require("express-validator");
const global_1 = require("../dto/global");
const userRouter = express_1.default.Router();
userRouter.post("/registration/", (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 6 }), (0, express_validator_1.body)('isMaster').isBoolean(), (0, express_validator_1.body)("name").not().isEmpty().isString().trim().escape(), userController_1.default.registration);
userRouter.post("/registrationAdmin/", (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isLength({ min: 6 }), userController_1.default.registrationFromAdmin);
userRouter.post('/login/', (0, express_validator_1.body)('dataForAuthorizations.email').isEmail(), (0, express_validator_1.body)('dataForAuthorizations.password').isLength({ min: 6 }), userController_1.default.login);
userRouter.post('/googleAuth/', (0, express_validator_1.body)("dataForAuthorizations.responseGoogle").isJWT(), userController_1.default.loginService);
userRouter.post('/facebookAuth/', (0, express_validator_1.body)("dataForAuthorizations.responseFacebook.accessToken").not().isEmpty().isString(), (0, express_validator_1.body)("dataForAuthorizations.responseFacebook.signedRequest").not().isEmpty().isString().isJWT(), (0, express_validator_1.body)("dataForAuthorizations.responseFacebook.name").not().isEmpty().isString(), (0, express_validator_1.body)("dataForAuthorizations.responseFacebook.userID").not().isEmpty().isString(), userController_1.default.loginService);
userRouter.put('/changeEmail/', userController_1.default.changeEmail);
userRouter.get('/auth/', authMiddleware_1.default, userController_1.default.check);
userRouter.get('/checkEmail/', (0, express_validator_1.body)('email').isEmail(), userController_1.default.checkEmail);
userRouter.put('/activate/:userId', (0, checkRoleMiddleware_1.default)(global_1.ROLES.ADMIN), (0, express_validator_1.param)("userId").not().isEmpty().isInt({ gt: 0 }), (0, express_validator_1.body)("isActivated").not().isEmpty().isBoolean(), userController_1.default.activateAdmin);
userRouter.get('/activate/:link', userController_1.default.activate);
userRouter.get("/", (0, checkRoleMiddleware_1.default)(global_1.ROLES.ADMIN), userController_1.default.getAll);
userRouter.get("/customers/", userController_1.default.getAllCustomers);
userRouter.put('/:userId', (0, checkRoleMiddleware_1.default)(global_1.ROLES.ADMIN), (0, express_validator_1.param)("userId").not().isEmpty().isInt({ gt: 0 }), userController_1.default.updateUser);
userRouter.delete('/:userId', (0, checkRoleMiddleware_1.default)(global_1.ROLES.ADMIN), (0, express_validator_1.param)("userId").not().isEmpty().isInt({ gt: 0 }), userController_1.default.deleteOne);
exports.default = userRouter;