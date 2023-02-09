
import jwt from 'jsonwebtoken'
import ApiError from "../error/ApiError";
import { Response, NextFunction} from "express";

export default function (req: any, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            next(ApiError.Unauthorized( "No token"))
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string)
        req.user = decoded
        next()
    } catch (e) {
        next(ApiError.Unauthorized("Unauthorized"))
    }
};