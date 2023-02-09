import nodemailer from 'nodemailer'
import Mail from "nodemailer/lib/mailer"
import ApiError from "../error/ApiError";
import {NextFunction} from "express";

export default new class MailService {
    private readonly transporter: Mail

    constructor() {
        this.transporter = nodemailer.createTransport({
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
        })
    }

    remindMail(mailInfo: { email: string, orderNumber: number }): void {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: mailInfo.email,
            subject: `Напоминание о заказе №${mailInfo.orderNumber}`,
            text: `Напоминание о заказе №${mailInfo.orderNumber}, что состоиться через час`,
            html:
                `<div>
                <p>Напоминание о заказе №${mailInfo.orderNumber}, который состоиться через час</p>
</div>`,
        }, err => {
            if (err) {
                console.log(err)
                return
            }
        })

    }

    sendMail(mailInfo: { name: string, time: string, email: string, password: string, size: string, masterName: string, cityName: string, orderNumber: number },
             next: NextFunction): void {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: mailInfo.email,
            subject: `Подтверждение заказа №${mailInfo.orderNumber}`,
            text: '',
            html:
                `<div>
                <p>${mailInfo.name}, заказ №${mailInfo.orderNumber} успешно оформлен</p>
                <p>Дата выполнения заказа: ${mailInfo.time}</p>
                <p>Размер часов: ${mailInfo.size}</p>
                <p>Мастер:${mailInfo.masterName} в городе ${mailInfo.cityName}</p>
                <p>Хорошего, дня!</p>
                </div>`,
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }

        })

    }

    userInfo(mailInfo: { email: string, password: string }, next: NextFunction): void {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: mailInfo.email,
            subject: `Данные для входа`,
            text: 'Ваши данные для входа',
            html:
                `<div>
                <p>Email: ${mailInfo.email}</p>
                <p>Password: ${mailInfo.password}</p>
                <p>Теперь можете выполнить  <a href="${process.env.LOGIN_URL}">АВТОРИЗАЦИЮ</a></p>
                </div>`
        }, err => {
            if (err) {
                next(ApiError.badRequest(err.message))
                return
            }
        })
    }

    sendActivationMail(email: string, activationLink: string, next: NextFunction) {

        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта ',
            text: "",
            html:
                `<div>
             <h1>Для активации перейдите по ссылке</h1>
             <a href="${activationLink}">${activationLink}</a>
                </div>`,
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }
        })
    }

    sendOrderDone(email: string, id: string, link: string, pdf: any, next: NextFunction) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: `Заказ выполнен.Оцените заказ №${id}`,
            text: "",
            html:
                `<div>
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
                next(ApiError.badRequest(err.message))
                return
            }
        })
    }

    updateMail(email: string, password: string | undefined, next: NextFunction) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта',
            text: "",
            html:
                `<div>
                Данные для входа измененны:
                email: ${email}
                 <p>  ${password ? `Ваш пароль: ${password}` : ""}</p>
                </div>`,
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }

        })
    }
}

