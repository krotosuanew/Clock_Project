import {City, Master} from '../models/models';
import ApiError from '../error/ApiError';
import {Result, ValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {CreateCityDTO, UpdateCityDTO} from "../dto/city.dto";
import {GetRowsDB, ReqQuery} from "../dto/global";
import {Op} from "sequelize";


class CityLogic {

    async create(req: Request, res: Response, next: NextFunction): Promise<Response<City | Result<ValidationError>> | void> {
        try {
            const errors: Result<ValidationError> = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const cityInfo: CreateCityDTO = req.body;
            const newCity: City = await City.create(cityInfo);
            return res.status(200).json({newCity});
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
            return
        }
    }

    async getAll(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, name: string }>, res: Response, next: NextFunction): Promise<Response<City[]> | void> {
        try {
            const sorting: string = req.query.sorting ?? "name"
            const directionUp = req.query.ascending === "true" ? 'DESC' : 'ASC'
            const name = req.query.name === "" ? null : req.query.name
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset = page * limit - limit;
            const cities: GetRowsDB<City> = await City.findAndCountAll({
                where: {
                    name: name ? {[Op.or]: [{[Op.substring]: name}, {[Op.iRegexp]: name}]} : {[Op.ne]: ""},
                },
                order: [[sorting, directionUp]],
                limit, offset
            })
            if (!cities.count) {
                return res.status(204).json({message: "List is empty"});
            }
            return res.status(200).json(cities)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
            return
        }
    }


    async checkMasterCityId(id: number[]): Promise<boolean> {
        const cityCheck: City[] = await City.findAll({where: {id}})
        if (cityCheck.length !== id.length || cityCheck.length === 0) {
            return true
        }
        return false
    }

    async checkCityId(id: number, next: NextFunction): Promise<void | City> {
        const cityCheck: City | null = await City.findByPk(id);
        if (!cityCheck) {
            next(ApiError.badRequest("WRONG CityId"));
            return
        }
        return cityCheck;
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response<City> | void> {
        try {
            const cityId: string = req.params.cityId;
            const cityInfo: UpdateCityDTO = req.body;
            const cityUpdate = await City.update(cityInfo, {where: {id: cityId}});
            return res.status(201).json(cityUpdate);
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
            return
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response<{ message: string }> | void> {
        try {
            const cityId: string = req.params.cityId;
            if (cityId) {
                const cityDelete: City | null = await City.findOne({
                    where: {id: cityId},
                    include: Master,
                    attributes: ["id"]
                })
                if (cityDelete === null || cityDelete.masters === undefined) {
                    next(ApiError.badRequest("Id is empty"));
                    return
                }
                if (cityDelete.masters.length === 0) {
                    await cityDelete.destroy();
                    return res.status(204).json({message: "success"});
                } else {
                    next(ApiError.Conflict("City isn`t empty"));
                    return
                }
            } else {
                next(ApiError.badRequest("Id is empty"));
                return
            }
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
            return
        }
    }
}


export default new CityLogic();

