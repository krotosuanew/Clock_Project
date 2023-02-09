import cityLogic from '../businessLogic/cityLogic'
import {NextFunction, Request, Response} from "express";
import {Result, ValidationError, validationResult} from "express-validator";
import {ReqQuery} from "../dto/global";


class CityController {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response<Result<ValidationError>> | void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await cityLogic.create(req, res, next)
    }

    async getAll(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, name: string }>, res: Response, next: NextFunction): Promise<void> {
        await cityLogic.getAll(req, res, next)

    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response<Result<ValidationError>> | void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await cityLogic.update(req, res, next)
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response<Result<ValidationError>> | void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await cityLogic.deleteOne(req, res, next)
    }
}

export default new CityController()

