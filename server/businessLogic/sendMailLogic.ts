import {getHours, set} from "date-fns";
import {Master, Order, User} from "../models/models";
import MailService from "../service/mailService";
import {NextFunction} from "express";
import {ResultOrderDTO, SendMassageDTO} from "../dto/order.dto";
import ApiError from "../error/ApiError";

class SendMailLogic {
    async sendMessage(req: any, next: NextFunction, result: void | ResultOrderDTO): Promise<void> {
        try {
            const cityName: string = result!.city.name
            const size: string = result!.clock.name
            const orderNumber: number = result!.order.id
            const {
                name,
                email,
                masterId,
                password
            }: SendMassageDTO = req.body
            let {time}: { time: Date | string } = req.body
            const masterMail: Master | null = await Master.findOne({
                where: {
                    id: masterId
                },
                include: {all: true, nested: true}
            })
            if (!masterMail || masterMail.user === undefined) {
                next(ApiError.badRequest("masterId is wrong"))
                return
            }
            time = new Date(time).toLocaleString("uk-UA",{timeZone:"Europe/Kiev"})
            const mailInfo = {
                name,
                time,
                email,
                password,
                size,
                masterName: masterMail.name,
                cityName,
                orderNumber,
            }
            MailService.sendMail(mailInfo, next)
            if (password) {
                MailService.userInfo(mailInfo, next)
            }
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async remaindMessage(): Promise<void> {
        const checkTime = set(new Date(), {
            hours: getHours(new Date()) + 1,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
        })
        const masters: Master[] | null = await Master.findAll({
            where: {},
            attributes: ["id"],
            include: [{
                model: User,
                attributes: ["email"]
            },
                {
                    model: Order,
                    where: {
                        time: checkTime
                    }
                }]
        });
        if (masters.length === 0) {
            return
        }
        masters.map(master => {
            if (!master.user || !master.orders) {
                return
            }
            MailService.remindMail({email: master.user.email, orderNumber: master.orders[0].id});
        })
    }
}

export default new SendMailLogic()