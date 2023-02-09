import 'dotenv/config'
import sequelizeConnection from "./db";
import http from "http";
import SendMailLogic from "./businessLogic/sendMailLogic";
import cron from "node-cron";
import {app} from './app'


const PORT = process.env.PORT || 5000


const start = async (): Promise<void> => {
    try {
        await sequelizeConnection.authenticate()
        cron.schedule('15,35,55 * * * *', () => {
            http.get(`${process.env.API_URL}`);
        });
        cron.schedule('0 0 0-23 * * *', () => {
            SendMailLogic.remaindMessage()
        });
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()