"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
exports.default = new class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    remindMail(mailInfo) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: mailInfo.email,
            subject: `Напоминание о заказе №${mailInfo.orderNumber}`,
            text: `Напоминание о заказе №${mailInfo.orderNumber}, что состоиться через час`,
            html: `<div>
                <p>Напоминание о заказе №${mailInfo.orderNumber}, который состоиться через час</p>
</div>`,
        }, err => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
    sendMail(mailInfo, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: mailInfo.email,
            subject: `Подтверждение заказа №${mailInfo.orderNumber}`,
            text: '',
            html: `<div>
                <p>${mailInfo.name}, заказ №${mailInfo.orderNumber} успешно оформлен</p>
                <p>Дата выполнения заказа: ${mailInfo.time}</p>
                <p>Размер часов: ${mailInfo.size}</p>
                <p>Мастер:${mailInfo.masterName} в городе ${mailInfo.cityName}</p>
                <p>Хорошего, дня!</p>
                </div>`,
        }, err => {
            if (err) {
                return next(ApiError_1.default.badRequest(err.message));
            }
        });
    }
    userInfo(mailInfo, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: mailInfo.email,
            subject: `Данные для входа`,
            text: 'Ваши данные для входа',
            html: `<div>
                <p>Email: ${mailInfo.email}</p>
                <p>Password: ${mailInfo.password}</p>
                <p>Теперь можете выполнить  <a href="${process.env.LOGIN_URL}">АВТОРИЗАЦИЮ</a></p>
                </div>`
        }, err => {
            if (err) {
                next(ApiError_1.default.badRequest(err.message));
                return;
            }
        });
    }
    sendActivationMail(email, activationLink, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта ',
            text: "",
            html: `<div>
             <h1>Для активации перейдите по ссылке</h1>
             <a href="${activationLink}">${activationLink}</a>
                </div>`,
        }, err => {
            if (err) {
                return next(ApiError_1.default.badRequest(err.message));
            }
        });
    }
    sendOrderDone(email, id, link, pdf, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: `Заказ выполнен.Оцените заказ №${id}`,
            text: "",
            html: `<div>
             <h2>Ваш заказ выполнен.</h2>
             <h3>Можете оставить оценку выполнения Вашего заказа по ссылке:</h3>
              <a href="${link}">${link}</a>
</div>`,
            attachments: [{
                    filename: `bill-${id}.pdf`,
                    content: new Buffer(pdf, 'base64'),
                    contentType: 'application/pdf'
                }]
        }, err => {
            if (err) {
                next(ApiError_1.default.badRequest(err.message));
                return;
            }
        });
    }
    updateMail(email, password, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта',
            text: "",
            html: `<div>
                Данные для входа измененны:
                email: ${email}
                 <p>  ${password ? `Ваш пароль: ${password}` : ""}</p>
                </div>`,
        }, err => {
            if (err) {
                return next(ApiError_1.default.badRequest(err.message));
            }
        });
    }
};
