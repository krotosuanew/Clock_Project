import sequelizeConnection from "../db";
import {City, Master, SizeClock, User} from "../models/models";
import {ROLES} from "../dto/global";
import {set} from "date-fns";
import axios from "axios";
import request from "supertest";
import {app} from "../app";

const createTest = {
    dbData: {
        cities: [{id: 1, name: "Dnepr", price: 21}, {id: 2, name: "Ужгород", price: 21}],
        user: {id: 1, email: "userForMaster@gmail.com", password: "secretpassword", role: ROLES.MASTER},
        sizeClocks: [{id: 1, name: "Маленькие", date: "01:00:00"}, {id: 2, name: "Средние", date: "02:00:00"}],
        master: {id: 1, name: "alex", rating: 0, userId: 1, isActivated: true}
    },
    createOrder: {
        payload: {
            name: "Ihor",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 201,
            orderId: 1,
        }
    },
    nameIsEmpty: {
        payload: {
            name: "",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "name"
        }
    },
    nameIsNull: {
        payload: {
            name: null,
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "name"
        }
    },
    timeIsNull: {
        payload: {
            name: "Vasya",
            time: null,
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "time"
        }
    },
    timeIsEmpty: {
        payload: {
            name: "Vasya",
            time: '',
            email: "forOrder@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "time"
        }
    },
    emailIsWrong: {
        payload: {
            name: "Vasya",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrdes",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "email"
        }
    },
    emailIsNull: {
        payload: {
            name: "Vasya",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: null,
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "email"
        }
    },
    cityIdIsWrong: {
        payload: {
            name: "Vasya",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 999,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: 'WRONG CityId',
        }
    },
    cityIdIsNull: {
        payload: {
            name: "Vasya",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: null,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "cityId"
        }
    },
    masterIdIsWrong: {
        payload: {
            name: "Vasya",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 999,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Wrong request",
        }
    },
    masterIdIsNull: {
        payload: {
            name: "Vasya",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: null,
            sizeClockId: 1,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "masterId"
        }
    },
    sizeClockIdIsWrong: {
        payload: {
            name: "Vasya",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 999,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "WRONG sizeClockId",
        }
    },
    sizeClockIdIsNull: {
        payload: {
            name: "Vasya",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: null,
            regCustomer: false,
            price: 24,
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "sizeClockId"
        }
    },
    priceIsEmpty: {
        payload: {
            name: "Vasya",
            time: set(new Date(), {hours: 10, minutes: 0, seconds: 0, milliseconds: 0}),
            email: "forOrdes@gmail.com",
            changeName: false,
            cityId: 1,
            masterId: 1,
            sizeClockId: 1,
            regCustomer: false,
            price: "",
            photos: null,
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: "price"
        }
    },
}
describe("order create test", () => {
    beforeAll(async () => {
        await sequelizeConnection.sync({
            force: true
        })
        await User.create(createTest.dbData.user)
        await City.bulkCreate(createTest.dbData.cities)
        await SizeClock.bulkCreate(createTest.dbData.sizeClocks)
        await Master.create(createTest.dbData.master)
    })
    afterAll(async () => {
        await sequelizeConnection.drop({cascade: true})
    })
    test("name is empty", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.nameIsEmpty.payload)
            expect(response.status).toBe(createTest.nameIsEmpty.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.nameIsEmpty.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.nameIsEmpty.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("name is null", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.nameIsNull.payload)
            expect(response.status).toBe(createTest.nameIsNull.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.nameIsNull.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.nameIsNull.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("time is null", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.timeIsNull.payload)
            expect(response.status).toBe(createTest.timeIsNull.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.timeIsNull.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.timeIsNull.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("time is empty", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.timeIsEmpty.payload)
            expect(response.status).toBe(createTest.timeIsEmpty.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.timeIsEmpty.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.timeIsEmpty.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("email is wrong", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.emailIsWrong.payload)
            expect(response.status).toBe(createTest.emailIsWrong.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.emailIsWrong.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.emailIsWrong.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("email is null", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.emailIsNull.payload)
            expect(response.status).toBe(createTest.emailIsNull.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.emailIsNull.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.emailIsNull.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("cityId is wrong", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.cityIdIsWrong.payload)
            expect(response.status).toBe(createTest.cityIdIsWrong.expectResponse.status)
            expect(JSON.parse(response.text).message).toBe(createTest.cityIdIsWrong.expectResponse.msg)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("cityId is null", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.cityIdIsNull.payload)
            expect(response.status).toBe(createTest.cityIdIsNull.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.cityIdIsNull.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.cityIdIsNull.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("masterId is wrong", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.masterIdIsWrong.payload)
            expect(response.status).toBe(createTest.masterIdIsWrong.expectResponse.status)
            expect(JSON.parse(response.text).message).toBe(createTest.masterIdIsWrong.expectResponse.msg)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("masterId is null", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.masterIdIsNull.payload)
            expect(response.status).toBe(createTest.masterIdIsNull.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.masterIdIsNull.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.masterIdIsNull.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("sizeClockId is wrong", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.sizeClockIdIsWrong.payload)
            expect(response.status).toBe(createTest.sizeClockIdIsWrong.expectResponse.status)
            expect(JSON.parse(response.text).message).toBe(createTest.sizeClockIdIsWrong.expectResponse.msg)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("sizeClockId is null", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.sizeClockIdIsNull.payload)
            expect(response.status).toBe(createTest.sizeClockIdIsNull.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.sizeClockIdIsNull.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.sizeClockIdIsNull.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("price is empty", async () => {
        try {
            const response = await request(app).post(`/api/orders/`).send(createTest.priceIsEmpty.payload)
            expect(response.status).toBe(createTest.priceIsEmpty.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.priceIsEmpty.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.priceIsEmpty.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("create order", async () => {
        const response = await request(app).post(`/api/orders/`).send(createTest.createOrder.payload)
        expect(response.statusCode).toBe(createTest.createOrder.expectResponse.status)
        expect(response.body.orderId).toBe(createTest.createOrder.expectResponse.orderId)
    })
})