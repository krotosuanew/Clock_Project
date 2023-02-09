import {City, Master, SizeClock, User} from "../models/models";
import {app} from '../app'
import axios from "axios";
import sequelizeConnection from "../db";
import {ROLES} from "../dto/global";
import request from 'supertest';

const createTest = {
    dbData: {
        cities: [{id: 1, name: "Dnepr", price: 21}, {id: 2, name: "Ужгород", price: 21}]
    },
    rightMaster: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: "clock12@mail.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            id: 1,
            role: ROLES.MASTER,
            status: 201
        }
    },
    wrongEmail: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: "clocks",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'email'
        }
    },
    emailIsNull: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: null,
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'email'
        }
    },
    wrongCityId: {
        payload: {
            cityId: [999],
            name: "alex",
            rating: 0,
            email: "clocks@dasda.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "WRONG request",
        }
    },
    cityIdIsNull: {
        payload: {
            cityId: null,
            name: "alex",
            rating: 0,
            email: "clocks@dasda.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "WRONG request",
        }
    },
    wrongPassword: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: "c2@dsas.com",
            password: 'pas',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'password'
        }
    },
    passwordIsNull: {
        payload: {
            cityId: [1, 2],
            name: "alex",
            rating: 0,
            email: "c2@dsas.com",
            password: null,
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'password'
        }
    },
    nameIsNull: {
        payload: {
            cityId: [1, 2],
            name: null,
            rating: 0,
            email: "c34@dsas.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'name'
        }
    },
    emptyName: {
        payload: {
            cityId: [1, 2],
            name: "",
            rating: 0,
            email: "xc34@dsas.com",
            password: 'passwordsecret',
            isMaster: true
        },
        expectResponse: {
            status: 400,
            msg: "Invalid value",
            param: 'name'
        }
    }
}
describe("master create test", () => {
    beforeAll(async () => {
        await sequelizeConnection.sync({
            force: true
        })
        await City.bulkCreate(createTest.dbData.cities)
    })
    afterAll(async () => {
        await sequelizeConnection.drop({cascade: true})
    })
    test("create right master", async () => {
        try {
            const response = await request(app).post(`/api/users/registration/`).send(createTest.rightMaster.payload)
            expect(response.body.newUser.email).toBe(createTest.rightMaster.payload.email)
            expect(response.body.newUser.role).toBe(createTest.rightMaster.expectResponse.role)
            expect(response.body.newUser.id).toBe(createTest.rightMaster.expectResponse.id)
            expect(response.statusCode).toBe(createTest.rightMaster.expectResponse.status)
        } catch (e: any) {
            console.log(e)
        }

    })
    test("wrong email", async () => {
        try {
            const response = await request(app).post(`/api/users/registration/`).send(createTest.wrongEmail.payload)
            expect(response.status).toBe(createTest.wrongEmail.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.wrongEmail.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.wrongEmail.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("email is null", async () => {
        try {
            const response = await request(app).post(`/api/users/registration/`).send(createTest.emailIsNull.payload)
            expect(response.status).toBe(createTest.emailIsNull.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.emailIsNull.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.emailIsNull.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("wrong cityId", async () => {
        try {
            const response = await request(app).post(`/api/users/registration/`).send(createTest.wrongCityId.payload)
            expect(response.status).toBe(createTest.wrongCityId.expectResponse.status)
            expect(JSON.parse(response.text).message).toBe(createTest.wrongCityId.expectResponse.msg)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("cityId is null", async () => {
        try {
            const response = await request(app).post(`/api/users/registration/`).send(createTest.cityIdIsNull.payload)
            expect(response.status).toBe(createTest.cityIdIsNull.expectResponse.status)
            expect(JSON.parse(response.text).message).toBe(createTest.cityIdIsNull.expectResponse.msg)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("wrong password", async () => {
        try {
            const response = await request(app).post(`/api/users/registration/`).send(createTest.wrongPassword.payload)
            expect(response.status).toBe(createTest.wrongPassword.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.wrongPassword.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.wrongPassword.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("password is null", async () => {
        try {
            const response = await request(app).post(`/api/users/registration/`).send(createTest.passwordIsNull.payload)
            expect(response.status).toBe(createTest.passwordIsNull.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.passwordIsNull.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.passwordIsNull.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("name is null", async () => {
        try {
            const response = await request(app).post(`/api/users/registration/`).send(createTest.nameIsNull.payload)
            expect(response.status).toBe(createTest.nameIsNull.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.nameIsNull.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.nameIsNull.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
    test("Empty name", async () => {
        try {
            const response = await request(app).post(`/api/users/registration/`).send(createTest.emptyName.payload)
            expect(response.status).toBe(createTest.emptyName.expectResponse.status)
            expect(JSON.parse(response.text).errors[0].msg).toBe(createTest.emptyName.expectResponse.msg)
            expect(JSON.parse(response.text).errors[0].param).toBe(createTest.emptyName.expectResponse.param)
        } catch (e: any) {
            console.log(e)
        }
    })
})