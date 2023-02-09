import {Optional} from "sequelize/types"
import {City, Order, SizeClock, User} from "../models/models";

const pdf = require("pdf-creator-node");

export default pdf
export type CreateOrderDTO = {
    name: string;
    sizeClockId: number;
    masterId: number
    cityId: number;
    price: number;
    changedMaster?: boolean
    isPaid?: boolean
    photoLinks?: []
}

export type PdfInfo = {
    id: number,
    dateStart: string,
    dateEnd: string,
    clock: string,
    city: string,
    userEmail: string,
    masterEmail: string,
    price: number,
    qr: string
}
export type forGetOrders = {
    cityIDes: [] | null,
    masterIDes: [] | null,
    userIDes?: [] | null
    sizeIDes?: [] | null
    userEmails?: [] | null
    userName?: string
    masterName?: string | null
    time: Date | null,
    status: STATUS | null,
    minPrice: string | null,
    maxPrice: string | null,
}

export enum STATUS {
    WAITING = "WAITING",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    DONE = "DONE",
}

export type ResultOrderDTO = {
    order: Order,
    city: City,
    clock: SizeClock,
    user: User
}
export type SendMassageDTO = {
    name: string,
    email: string,
    masterId: number,
    password: string
}
export type StatisticList = { name: string, totalOrders: number, rating: number, statusFinished: number, statusUnfinished: number, size: {}, totalPrice: number }

export enum TABS {
    DATE = "order/data",
    CITY = "orders/city",
    TOP_THREE = "top_3",
    MASTER_STATISTICS = "master_statistics"
}

export enum statusList {
    WAITING = "WAITING",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    DONE = "DONE",
}

export enum SORTING {
    MASTER_NAME = "masterName",
    SIZE_NAME = "sizeName",
    CITY_NAME = "cityName",
    USER_ID = "userId",
    DATE = "date",
    CITY_PRICE = "cityPrice"
}


export type UpdateMasterDTO = Optional<CreateOrderDTO, 'name'>
