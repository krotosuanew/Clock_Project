import {City, Master, Order, Rating, SizeClock, User} from '../models/models'
import ApiError from '../error/ApiError'
import MailService from "../service/mailService"
import {NextFunction, Request, Response} from "express";
import pdf, {
    CreateOrderDTO,
    forGetOrders,
    PdfInfo,
    SORTING,
    StatisticList,
    STATUS,
    statusList,
    TABS,
    UpdateMasterDTO
} from "../dto/order.dto";
import {DIRECTION, GetRowsDB, ReqQuery, UpdateDB} from "../dto/global";
import {v4 as uuidv4} from 'uuid';
import {Op} from "sequelize";
import XLSX from "xlsx";
import defaults from "lodash/defaults";
import countBy from "lodash/countBy";
import fs from "fs";
import buffer from "buffer";
import QRCode from 'qrcode'
import path from "path";
import * as cloudinary from "../service/cloudnary";
import axios from 'axios'
import JSZip from "jszip";

const {between, gte} = Op;

class OrderLogic {
    async create(req: Request, next: NextFunction, userId: number, time: Date, endTime: Date) {
        try{
            const {
                name,
                sizeClockId,
                masterId,
                cityId,
                price,
                photoLinks
            }: CreateOrderDTO = req.body
            return await Order.create({name, sizeClockId, userId, time, endTime, masterId, cityId, price, photoLinks})
        }catch (e){
            return new ApiError(400, (e as Error).message)
        }
    }

    async getUserOrders(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, filters: string }> & Request<{ userId: number }>, res: Response, next: NextFunction): Promise<Response<GetRowsDB<Order> | { message: string }> | void> {
        try {
            const userId: number = req.params.userId
            const sorting: string = req.query.sorting ?? "name"
            const directionUp: string = req.query.ascending === "true" ? DIRECTION.DOWN : DIRECTION.UP
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const {
                cityIDes,
                masterIDes,
                sizeIDes,
                time,
                status,
                minPrice,
                maxPrice
            }: forGetOrders = req.query.filters ? JSON.parse(req.query.filters)
                : {
                    cityIDes: null,
                    masterIDes: null,
                    sizeIDes: null,
                    time: null,
                    status: null, minPrice: null, maxPrice: null
                }
            const offset: number = page * limit - limit
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                order: [sorting === SORTING.MASTER_NAME ? [Master, "name", directionUp]
                    : sorting === SORTING.SIZE_NAME ? [SizeClock, "name", directionUp] :
                        sorting === SORTING.CITY_NAME ? [City, "name", directionUp]
                            : [sorting, directionUp]],
                where: {
                    userId: userId,
                    status: status ?? Object.keys(STATUS),
                    time: time ? {[between]: time} : {[Op.ne]: 0},
                    price: !!maxPrice ? {[between]: [minPrice ?? 0, maxPrice]} : {[gte]: minPrice ?? 0}
                },
                include: [{
                    model: Master,
                    attributes: ['name'],
                    where: {
                        id: masterIDes ?? {[Op.ne]: 0}
                    }
                }, {
                    model: SizeClock,
                    where: {
                        id: sizeIDes ?? {[Op.ne]: 0}
                    },
                    attributes: ['name']
                },
                    {
                        model: Rating,
                        attributes: ["rating"],
                    },
                    {
                        model: City,
                        where: {
                            id: cityIDes ?? {[Op.ne]: 0}
                        }
                    }], limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async getMasterOrders(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, filters: string }> & Request<{ userId: number }>, res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Order> | { message: string }>> {
        try {
            const userId: number = req.params.userId
            const sorting: string = req.query.sorting ?? "name"
            const directionUp: string = req.query.ascending === "true" ? DIRECTION.DOWN : DIRECTION.UP
            const page = req.query.page ?? null;
            const limit = req.query.limit ?? null;
            const {
                cityIDes,
                userIDes,
                sizeIDes,
                time,
                status,
                minPrice,
                userEmails,
                userName,
                maxPrice
            }: forGetOrders = req.query.filters ? JSON.parse(req.query.filters)
                : {
                    cityIDes: null,
                    userIDes: null,
                    sizeIDes: null,
                    time: null,
                    status: null, minPrice: null, maxPrice: null, userEmails: null,
                    userName: null
                }
            const offset: number = page * limit - limit
            const masterFind: Master | null = await Master.findOne({
                where: {userId: userId},
                attributes: ['id', "isActivated"]
            })
            if (masterFind === null || !masterFind.isActivated) {
                return next(ApiError.forbidden("Not activated"))
            }
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                order: [sorting === SORTING.SIZE_NAME ? [SizeClock, "name", directionUp] :
                    sorting === SORTING.CITY_NAME ? [City, "name", directionUp] :
                        sorting === SORTING.USER_ID ? [User, "id", directionUp]
                            : [sorting, directionUp]],
                where: {
                    name: userName ? {[Op.or]: [{[Op.substring]: userName}, {[Op.iRegexp]: userName}]} : {[Op.ne]: ""},
                    masterId: masterFind.id,
                    status: status ?? Object.keys(STATUS),
                    time: time ? {[between]: time} : {[Op.ne]: 0},
                    price: !!maxPrice ? {[between]: [minPrice ?? 0, maxPrice]} : {[gte]: minPrice ?? 0}
                },
                include: [{
                    model: Master,
                    attributes: ['name'],
                }, {
                    model: SizeClock,
                    where: {
                        id: sizeIDes ?? {[Op.ne]: 0}
                    },
                    attributes: ['name']
                }, {
                    model: City,
                    where: {
                        id: cityIDes ?? {[Op.ne]: 0}
                    },
                }, {
                    model: User,
                    where: {
                        email: userEmails ?? {[Op.ne]: ""},
                        id: userIDes ?? {[Op.ne]: 0}
                    },
                    attributes: ["id"],
                }], limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async getAllOrders(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, filters: string }>, res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Order> | { message: string }>> {
        try {
            const sorting: string = req.query.sorting ?? "name"
            const direction: string = req.query.ascending === "true" ? DIRECTION.DOWN : DIRECTION.UP
            const {
                cityIDes,
                masterIDes,
                time,
                status,
                minPrice,
                maxPrice,
                userName
            }: forGetOrders = req.query.filters ? JSON.parse(req.query.filters)
                : {
                    cityIDes: null,
                    masterIDes: null,
                    time: null,
                    status: null, minPrice: null, maxPrice: null, userName: null
                }
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset: number = page * limit - limit
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                where: {
                    name: userName ? {[Op.or]: [{[Op.substring]: userName}, {[Op.iRegexp]: userName}]} : {[Op.ne]: ""},
                    status: status ?? Object.keys(STATUS),
                    time: time ? {[between]: time} : {[Op.ne]: 0},
                    price: !!maxPrice ? {[between]: [minPrice ?? 0, maxPrice]} : {[gte]: minPrice ?? 0}
                },
                attributes: {exclude: ["ratingLink"]},
                order: [sorting === SORTING.MASTER_NAME ? [Master, "name", direction]
                    : sorting === SORTING.DATE ? [SizeClock, sorting, direction] :
                        sorting === SORTING.CITY_NAME ? [City, "name", direction] :
                            sorting === SORTING.CITY_PRICE ? [City, "price", direction]
                                : [sorting, direction]],
                include: [{
                    model: Master,
                    where: {
                        id: masterIDes ?? {[Op.ne]: 0}
                    }
                }, {
                    model: SizeClock,
                    attributes: ['date'],

                }, {
                    model: User,
                    attributes: ['email'],
                },
                    {
                        model: City,
                        where: {
                            id: cityIDes ?? {[Op.ne]: 0}
                        }
                    }], limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }

    }

    async ordersStatistics(req: ReqQuery<{ filters: string, tabs: string }>, res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Order> | { message: string }>> {
        try {
            const tabs: string = req.query.tabs
            const {
                cityIDes,
                masterIDes,
                time,
            }: forGetOrders = req.query.filters && tabs !== TABS.MASTER_STATISTICS ? JSON.parse(req.query.filters)
                : {
                    cityIDes: null,
                    masterIDes: null,
                    time: null,
                }
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                order: [["time", DIRECTION.DOWN]],
                where: {
                    time: time ? {[between]: time} : {[Op.ne]: 0},
                },
                attributes: {exclude: ["ratingLink", "photoLinks"]},
                include: [{
                    model: Master,
                    where: {
                        id: masterIDes ?? {[Op.ne]: 0}
                    }
                }, {
                    model: SizeClock,
                    attributes: ['date', "name"],
                },
                    {
                        model: City,
                        where: {
                            id: cityIDes ?? {[Op.ne]: 0}
                        }
                    }]
            })
            if (tabs !== TABS.MASTER_STATISTICS) {
                if (!orders.count) {
                    return res.status(204).json({message: "List is empty"})
                }
            }
            const ordersCountList: Array<number> = []
            if (tabs === TABS.DATE) {
                const dateSet: Set<string> = new Set()
                const dateList: string[] = []
                orders.rows.map(order => dateSet.add(order.time.toLocaleDateString("uk-UA")))
                for (let date of dateSet) {
                    const newList = orders.rows.filter(order => order.time.toLocaleDateString("uk-UA") === date)
                    ordersCountList.push(newList.length)
                    dateList.push(date)
                }
                return res.status(200).json({ordersCountList, statisticsList: dateList, totalCount: orders.count})
            } else if (tabs === TABS.CITY) {
                const cityList: Array<string> = []
                const citySet: Set<string> = new Set()
                orders.rows.map(order => citySet.add(order.city!.name))
                for (let city of citySet) {
                    const newList: Order[] = orders.rows.filter(order => order.city!.name === city)
                    ordersCountList.push(newList.length)
                    cityList.push(city)
                }
                return res.status(200).json({ordersCountList, statisticsList: cityList, totalCount: orders.count})
            } else if (tabs === TABS.TOP_THREE) {
                const masterList: Array<{ name: string, totalOrders: number }> = []
                const masterSet: Set<number> = new Set()
                orders.rows.map(order => masterSet.add(order.master!.id))
                for (let master of masterSet) {
                    const newList: Order[] = orders.rows.filter(order => order.master!.id === master)
                    masterList.push({name: newList[0].master!.name, totalOrders: newList.length})
                }
                masterList.sort((a, b) => a.totalOrders < b.totalOrders ? 1 : -1)
                if (masterList.length > 3) {
                    const anotherTotalOrders = masterList.splice(3, masterList.length - 3).reduce((sum, current) => sum + current.totalOrders, 0)
                    masterList.push({name: "Остальные", totalOrders: anotherTotalOrders})
                }
                return res.status(200).json({masterList, totalCount: orders.count})
            } else if (tabs === TABS.MASTER_STATISTICS) {
                const masterListStatistics: Array<StatisticList> = []
                const masters: Master[] = await Master.findAll({order: [["name", DIRECTION.DOWN]]})
                const sizeClocks: SizeClock[] = await SizeClock.findAll({
                    attributes: ["name"],
                })
                masters.map(master => {
                    const newList = orders.rows.filter(order => order.master!.id === master.id)
                    const dataMaster: StatisticList = {
                        name: "",
                        totalOrders: 0,
                        rating: 0,
                        statusFinished: 0,
                        statusUnfinished: 0,
                        size: {},
                        totalPrice: 0
                    }
                    if (newList.length === 0) {
                        dataMaster.name = master.name
                        sizeClocks.map(clock => dataMaster.size = defaults(dataMaster.size, {[clock.name]: countBy(newList, {sizeClock: {name: clock.name}}).true ?? 0}))
                        masterListStatistics.push(dataMaster)
                    } else {
                        const statusCount = countBy(newList, {status: STATUS.DONE})
                        dataMaster.name = newList[0].master!.name
                        dataMaster.totalOrders = newList.length
                        dataMaster.rating = newList[0].master!.rating
                        dataMaster.statusFinished = statusCount.true ?? 0
                        dataMaster.statusUnfinished = statusCount.false ?? 0
                        sizeClocks.map(clock => dataMaster.size = defaults(dataMaster.size, {[clock.name]: countBy(newList, {sizeClock: {name: clock.name}}).true ?? 0}))
                        dataMaster.totalPrice = newList.reduce((sum, current) => sum + (current.status === STATUS.DONE ? current.price : 0), 0)
                        masterListStatistics.push(dataMaster)
                    }
                })

                return res.status(200).json({masterListStatistics, totalCount: orders.count})
            }

        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }

    }

    async getPhotos(req: Request<{ orderId: number }>, res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Order> | { message: string }>> {
        try {
            const orderId: number = +req.params.orderId
            const orders: Order[] | null = await Order.findAll(
                {
                    where: {
                        id: orderId,
                        photoLinks: {[Op.not]: null}
                    },
                    attributes: ["photoLinks"]
                }
            )
            if (!orders || orders.length === 0) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async exportToExcel(req: ReqQuery<{ sorting: string, ascending: string, filters: string }>, res: Response, next: NextFunction) {
        try {
            const sorting: string = req.query.sorting ?? "name"
            const direction: string = req.query.ascending === "true" ? DIRECTION.DOWN : DIRECTION.UP
            const {
                cityIDes,
                masterIDes,
                time,
                status,
                minPrice,
                maxPrice,
                userName
            }: forGetOrders = req.query.filters !== "null" ? JSON.parse(req.query.filters)
                : {
                    cityIDes: null,
                    masterIDes: null,
                    time: null,
                    status: null, minPrice: null, maxPrice: null, userName: null
                }
            const orders: Order[] = await Order.findAll({
                where: {
                    name: userName ? {[Op.substring]: userName ?? ""} : {[Op.ne]: ""},
                    status: status ?? Object.keys(STATUS),
                    time: time ? {[between]: time} : {[Op.ne]: 0},
                    price: !!maxPrice ? {[between]: [minPrice ?? 0, maxPrice]} : {[gte]: minPrice ?? 0}
                },
                order: [sorting === SORTING.MASTER_NAME ? [Master, "name", direction]
                    : sorting === SORTING.DATE ? [SizeClock, sorting, direction] :
                        sorting === SORTING.CITY_NAME ? [City, "name", direction] :
                            sorting === SORTING.CITY_PRICE ? [City, "price", direction]
                                : [sorting, direction]],
                include: [{
                    model: Master,
                    attributes: ["name"],
                    where: {
                        id: masterIDes ?? {[Op.ne]: 0}
                    }
                }, {
                    model: SizeClock,
                    attributes: ['date'],
                },
                    {
                        model: City,
                        attributes: ["price", "name"],
                        where: {
                            id: cityIDes ?? {[Op.ne]: 0}
                        }
                    }],
                attributes: ["id", "name", "time", "endTime", "status", "price"],
                raw: true
            })
            if (!orders) {
                return res.status(204).json({message: "List is empty"})
            }

            const rightOrders = orders.map((order: any) => ({
                id: order.id,
                name: order.name,
                startTime: new Date(order.time).toLocaleString('uk-UA'),
                endTime: new Date(order.endTime).toLocaleString('uk-UA'),
                masterName: order['master.name'],
                cityName: order['city.name'],
                priceForHour: `$` + order['city.price'],
                time: order['sizeClock.date'],
                totalPrice: `$` + order.price,
                status: order.status
            }))

            const headings = [
                ["id", "Имя", "Дата и время", "Конец заказа", "Мастер", "Город", "Цена за час", "Кол-во часов", "Итог", "Статус"]
            ];
            const ws = await XLSX.utils.json_to_sheet(rightOrders, {});
            const wb = XLSX.utils.book_new()
            XLSX.utils.sheet_add_aoa(ws, headings);
            XLSX.utils.book_append_sheet(wb, ws, 'Orders')
            const buffer = XLSX.write(wb, {bookType: 'xlsx', type: 'buffer'});
            return res.send(buffer);
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }

    }

    async update(req: any, res: Response, next: NextFunction, userId: number, time: Date, endTime: Date): Promise<UpdateDB<Order> | void> {
        try {
            const orderId: number = req.params.orderId
            const {
                name,
                sizeClockId,
                masterId,
                cityId,
                price
            }: UpdateMasterDTO = req.body
            if (orderId <= 0) {
                next(ApiError.badRequest("cityId is wrong"))
            }
            const orderUpdate: UpdateDB<Order> = await Order.update({
                name,
                sizeClockId,
                time,
                endTime,
                masterId,
                cityId,
                userId,
                price
            }, {where: {id: orderId}})
            return orderUpdate
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async statusChange(req: Request, res: Response, next: NextFunction): Promise<void | UpdateDB<Order>> {
        try {
            const orderId: string = req.params.orderId
            const status: string = req.body.status
            if (!(status in statusList)) {
                return next(ApiError.badRequest("INVALID STATUS"))
            }
            const orderUpdate: UpdateDB<Order> = await Order.update({
                status: status,
            }, {where: {id: orderId}})
            if (status === STATUS.DONE) {
                const mailInfo: Order | null = await Order.findOne({
                    where: {id: orderId},
                    attributes: ["masterId", "id", "ratingLink", "price", "time", "endTime"],
                    include: [{
                        model: User,
                        attributes: ["email"],
                    }, {
                        model: Master,
                        attributes: ["name"],
                        include: [{
                            model: User,
                            attributes: ["email"],
                        }]
                    }, {
                        model: SizeClock,
                        attributes: ["name"],
                    }, {
                        model: City,
                        attributes: ["name"],
                    }],
                })
                if (!mailInfo || !mailInfo.user) {
                    next(ApiError.badRequest("Wrong request"));
                    return
                } else if (mailInfo.ratingLink) {
                    return orderUpdate
                }
                const ratingLink: string = uuidv4()
                mailInfo.ratingLink = ratingLink
                await mailInfo.save()
                const email: string = mailInfo.user.email
                const pdf = await this.pdfCreate(mailInfo)
                MailService.sendOrderDone(email, orderId, `${process.env.RATING_URL}/${ratingLink}`, pdf, next)
            }
            return orderUpdate
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async payPalChange(req: Request, res: Response, next: NextFunction): Promise<Order | [number, Order[]] | void> {
        try {
            if (req.body.event_type === "CHECKOUT.ORDER.APPROVED") {
                const orderId: string = req.body.resource.purchase_units[0].description
                const payPalId: string = req.body.resource.id
                const orderUpdate: [number, Order[]] = await Order.update({
                    payPalId: payPalId
                }, {where: {id: orderId}})
                return orderUpdate
            } else if (req.body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
                const payPalId: string = req.body.resource.supplementary_data.related_ids.order_id
                const orderUpdate: Order | null = await Order.findOne(
                    {where: {payPalId: payPalId}}
                )
                if (!orderUpdate) {
                    next(ApiError.badRequest("Error event"))
                    return
                }
                await orderUpdate.update({
                    status: STATUS.ACCEPTED
                })
                return orderUpdate
            } else {
                next(ApiError.badRequest("Error event"))
                return
            }
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async deleteOne(req: any, res: Response, next: NextFunction): Promise<void | Response<{ message: string }>> {
        try {
            const orderId: string = req.params.orderId
            await Order.destroy({where: {id: orderId}})
            return res.status(204).json({message: "success"})
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }


    async cloudnaryUpload(orderId: number, photos: Array<string>, next: NextFunction): Promise<void> {
        try {
            const results: Array<{ url: string }> = await Promise.all(photos.map((photo: string) => {
                const result = cloudinary.uploader.upload(photo)
                return result
            }))

            if (!results) {
                return
            }
            const photoLinks: Array<string> = results.map(result => result.url)
            await Order.update({
                photoLinks,
            }, {where: {id: orderId}})
            return
        } catch (e) {
            next(ApiError.badRequest("Wrong request"))
        }
    }

    async downloadPhotos(req: ReqQuery<{ orderId: string }>, res: Response, next: NextFunction): Promise<Response<JSZip>| undefined> {
        try {
            const orderId = req.query.orderId
            const orderInfo: Order | null = await Order.findOne({
                where: {id: orderId},
                attributes: ["photoLinks"]
            })
            if (!orderInfo || !orderInfo.photoLinks) {
                return
            }
            const zip = new JSZip();
            const photos = await Promise.all(orderInfo.photoLinks.map((url) => {
                return axios({
                    url,
                    method: 'GET',
                    responseType: 'arraybuffer'
                });
            }))
            photos.map((photo, index) => zip.file(`image№${index + 1}.${photo.headers['content-type'].split('/')[1]}`, photo.data, {base64: true}))
            return res.send(await zip.generateAsync({type: "nodebuffer"}))
        } catch (e) {
            next(ApiError.badRequest("Wrong request"))
        }
    }

    async createBill(req: ReqQuery<{ orderId: string }>, res: Response, next: NextFunction) {
        try {
            const orderId = req.query.orderId
            const orderInfo: Order | null = await Order.findOne({
                where: {id: orderId},
                attributes: ["masterId", "id", "ratingLink", "price", "time", "endTime", "status"],
                include: [{
                    model: User,
                    attributes: ["email"],
                }, {
                    model: Master,
                    attributes: ["name"],
                    include: [{
                        model: User,
                        attributes: ["email"],
                    }]
                }, {
                    model: SizeClock,
                    attributes: ["name"],
                }, {
                    model: City,
                    attributes: ["name"],
                }],
            })
            if (!orderInfo || !orderInfo.user) {
                next(ApiError.badRequest("Wrong request"));
                return
            }
            if (orderInfo.status !== STATUS.DONE) {
                next(ApiError.forbidden("Invalid status "));
                return
            }
            const bufferPDF = await this.pdfCreate(orderInfo)
            return res.send(bufferPDF);
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
        }
    }

    async pdfCreate(mailInfo: Order) {
        const html = fs.readFileSync(path.resolve(__dirname, '../../templates/pdfTemplate.html'), "utf8");
        const qr = await QRCode.toDataURL(`Номер заказа: ${mailInfo.id}, Дата начало заказа: ${mailInfo.time.toLocaleString("uk-UA", {timeZone: "Europe/Kiev"})}, Дата конец заказа: ${mailInfo.endTime.toLocaleString("uk-UA", {timeZone: "Europe/Kiev"})}, Email пользователя:${mailInfo.user!.email}, Email мастера:${mailInfo.master!.user!.email}, Тип услуги: ${mailInfo.sizeClock!.name}, Город: ${mailInfo.city!.name}, Цена: ${mailInfo.price}`)
        const data: PdfInfo = {
            id: mailInfo.id,
            dateStart: mailInfo.time.toLocaleString("uk-UA", {timeZone: "Europe/Kiev"}),
            dateEnd: mailInfo.endTime.toLocaleString("uk-UA", {timeZone: "Europe/Kiev"}),
            clock: mailInfo.sizeClock!.name,
            city: mailInfo.city!.name,
            userEmail: mailInfo.user!.email,
            masterEmail: mailInfo.master!.user!.email,
            price: mailInfo.price,
            qr
        }
        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
        };
        const document = {
            html: html,
            data: data,
            type: "buffer",
        };
        const res = await pdf.create(document, options)
        return res
    }

}

export default new OrderLogic()