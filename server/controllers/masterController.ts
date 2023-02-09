import masterLogic from '../businessLogic/masterLogic'
import cityLogic from '../businessLogic/cityLogic'
import ApiError from "../error/ApiError";
import sequelize from "../db";
import {Result, ValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {Master} from "../models/models";
import {ReqQuery} from "../dto/global";


class MasterController {
    async create(req: Request, res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError>> | Master> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const cityIdes: number[] = req.body.cityId
            if (await cityLogic.checkMasterCityId(cityIdes)) {
                next(ApiError.badRequest("WRONG request"))
                return
            }
            const master = await masterLogic.create(req)
            if (master instanceof ApiError) {
                next(ApiError.badRequest("WRONG request"))
                return
            }
            return master
        } catch (e) {
            next(ApiError.badRequest("WRONG request"))
            return
        }
    }


    async getAll(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, filters: string, name: string }>, res: Response, next: NextFunction): Promise<void> {
        await masterLogic.getAll(req, res, next)
    }

    async getMastersForOrder(req: Request<{ cityId: string }> & ReqQuery<{ page: number, limit: number, time: Date, sizeClock: number }>,
                             res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError>>> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await masterLogic.getMastersForOrder(req, res, next)
    }


    async update(req: Request, res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError>>> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result = await sequelize.transaction(async () => {
                const cityIdes: (number)[] = req.body.cityId
                await cityLogic.checkMasterCityId(cityIdes)
                await masterLogic.update(req, res, next)
                return
            })
            return res.status(201).json(result)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async activate(req: Request, res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError>>> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const master = await masterLogic.activate(req, res, next)
            return res.status(201).json(master)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async ratingUpdate(req: Request, res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError>>> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            await masterLogic.ratingUpdate(req, res, next)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async getRatingReviews(req: Request<{ masterId: number }> & ReqQuery<{ page: number, limit: number }>,
                           res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError>>> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await masterLogic.getRatingReviews(req, res, next)
    }

    async checkLink(req: Request<{ uuid: string }> & ReqQuery<{ page: number, limit: number }>,
                    res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError>>> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await masterLogic.checkLink(req, res, next)
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response<Result<ValidationError>> | void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await masterLogic.deleteOne(req, res, next)
    }

}

export default new MasterController()