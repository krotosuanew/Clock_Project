import 'dotenv/config'
import express, {Application} from 'express'
import cors from 'cors'
import router from "./routes/index"
import errorHandler from "./middleware/ErrorHandlingMiddleware"


const app: Application = express()


app.use(cors({
    origin: "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
}))

app.use(express.json({limit: "6mb"}))
app.use('/api', router)
app.use(errorHandler)
export { app };