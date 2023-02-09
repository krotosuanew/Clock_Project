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
require("dotenv/config");
const db_1 = __importDefault(require("./db"));
const http_1 = __importDefault(require("http"));
const sendMailLogic_1 = __importDefault(require("./businessLogic/sendMailLogic"));
const node_cron_1 = __importDefault(require("node-cron"));
const app_1 = require("./app");
const PORT = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.authenticate();
        node_cron_1.default.schedule('15,35,55 * * * *', () => {
            http_1.default.get(`${process.env.API_URL}`);
        });
        node_cron_1.default.schedule('0 0 0-23 * * *', () => {
            sendMailLogic_1.default.remaindMessage();
        });
        app_1.app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
});
start();
