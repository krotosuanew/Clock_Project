import cls from 'cls-hooked'
import {Sequelize} from 'sequelize'
import config from "./config/config"
const namespace = cls.createNamespace('my-namespace')

Sequelize.useCLS(namespace)
const isTest = process.env.NODE_ENV === 'test'
export const dbName = isTest? config.test.database as string : config.development.database as string
export const dbUser = isTest? config.test.username as string: config.development.username as string
export const dbHost = isTest? config.test.host : config.development.host
export const dbPort = isTest? Number(process.env.DB_TEST_PORT): Number(process.env.DB_PORT)
export const dbDriver = 'postgres'
export const dbPassword = isTest? config.test.password: config.development.password

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDriver,
    logging: false,
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }
})

export default sequelizeConnection