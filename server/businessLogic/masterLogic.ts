import {City, Customer, Master, Order, Rating, SizeClock, User} from '../models/models'
import ApiError from '../error/ApiError'
import {Op} from "sequelize";
import sizeLogic from "./sizeLogic"
import sequelize from "../db"
import {NextFunction, Request, Response} from "express";
import {CreateMasterDTO, forGetMasters, UpdateMasterDTO} from "../dto/master.dto";
import {CreateRatingDTO} from "../dto/rating.dto";
import {addHours} from 'date-fns'
import {GetRowsDB, ReqQuery, UpdateDB} from "../dto/global";


const {and, lt, lte, not, is, or, gt, gte, notIn} = Op;

class MasterLogic {
    async create(req: Request): Promise<Master | ApiError> {
        try {
            const masterInfo: CreateMasterDTO = req.body;
            const newMaster: Master = await Master.create(masterInfo);
            await newMaster.addCities(masterInfo.cityId);
            return newMaster;
        } catch (e) {
            return new ApiError(400, (e as Error).message)
        }
    }

    async getAll(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, filters: string, name: string }>, res: Response, next: NextFunction): Promise<Response<GetRowsDB<Master> | { message: string }> | void> {
        try {
            const page = req.query.page ?? 1
            const limit = req.query.limit ?? 10
            const sorting: string = req.query.sorting ?? "name"
            const name: string | null = req.query.name === "" ? null : req.query.name
            const directionUp: "DESC" | "ASC" = req.query.ascending === "true" ? 'ASC' : 'DESC'
            const {
                cityIDes,
                rating,
                masterName
            }: forGetMasters = req.query.filters ? JSON.parse(req.query.filters) : {
                cityIDes: null,
                rating: null,
                masterName: null
            }
            const offset: number = page * limit - limit;
            const masterIdes: Master[] | null = cityIDes ? await Master.findAll({
                include: [{
                    model: City,
                    attributes: ["id"],
                    where: {id: cityIDes}
                }]
            }) : null
            const masters: GetRowsDB<Master> = await Master.findAndCountAll({
                distinct: true,
                order: [[sorting, directionUp],
                    [City, "name", 'ASC']
                ],
                where: {
                    name: name ? {[Op.or]: [{[Op.substring]: name}, {[Op.iRegexp]: name}]} : masterName ? {
                        [Op.or]: [{[Op.substring]: masterName}, {[Op.iRegexp]: masterName}]
                    } : {[Op.ne]: ""},
                    id: masterIdes ? {[Op.in]: masterIdes.map(master => master.id)} : {[Op.ne]: 0},
                    rating: {[Op.between]: rating ?? [0, 5]},
                },
                attributes: ['name', "rating", "id", "isActivated"],
                include: [{
                    model: City,
                    through: {
                        attributes: []
                    },
                }, {model: User}], limit, offset
            })
            if (!masters.count) {
                return res.status(204).json({message: "List is empty"});
            }
            return res.json(masters);
        } catch (e) {
            next(ApiError.NotFound((e as Error).message));
            return
        }
    }

    async getMastersForOrder(req: Request<{ cityId: string }> & ReqQuery<{ page: number, limit: number, time: Date, sizeClock: number }>,
                             res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Master> | { message: string }>> {
        try {
            const cityId: string = req.params.cityId;
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            let time: Date = req.query.time;
            const sizeClock: number = req.query.sizeClock;
            const clock: void | SizeClock = await sizeLogic.CheckClock(next, sizeClock);
            if (clock === undefined) {
                return next(ApiError.NotFound("clock not found"));
            }
            const endTime = addHours(new Date(time), Number(clock.date.slice(0, 2)))
            time = new Date(time)
            const offset: number = page * limit - limit;
            let masters: GetRowsDB<Master>;
            const orders = await Order.findAll({
                where: {
                    [not]: [{
                        [or]: [{
                            [and]: [{time: {[lt]: time}}, {endTime: {[lte]: time}}]
                        }, {
                            [and]: [{time: {[gte]: endTime}}, {endTime: {[gt]: endTime}}]
                        }]
                    }]
                },
                attributes: ["masterId"],
                group: "masterId"
            })
            masters = await Master.findAndCountAll({
                order: [['rating', 'DESC']],
                distinct: true,
                where: {
                    isActivated: {[is]: true},
                    id: {[notIn]: orders.map(order => order.masterId)}
                }, include: [{
                    model: City,
                    where: {id: cityId},
                    through: {
                        attributes: []
                    }
                }], limit, offset
            });
            if (!masters.count) {
                return res.status(204).json({message: "List is empty"});
            }
            return res.status(200).json(masters);
        } catch (e) {
            next(ApiError.NotFound((e as Error).message));
            return
        }
    }

    async checkOrders(next: NextFunction, masterId: number, time: Date, endTime: Date): Promise<Master | void | null> {
        const masterCheck: Master | null = await Master.findOne({
            where: {id: masterId}, include: [{
                model: Order, where: {
                    [not]: [{
                        [or]: [{
                            [and]: [{time: {[lt]: time}}, {endTime: {[lte]: time}}]
                        }, {
                            [and]: [{time: {[gte]: endTime}}, {endTime: {[gt]: endTime}}]
                        }]
                    }]
                },
            }],
        })
        if (masterCheck) {
            next(ApiError.NotFound('Master not found'));
            return
        }
        return masterCheck;
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void | Master> {
        try {
            const masterId: number = Number(req.params.masterId);
            const updateInfo: UpdateMasterDTO = req.body;
            const masterUpdate = await Master.findOne({where: {id: masterId}});
            if (masterUpdate === null) {
                return next(ApiError.badRequest("Wrong request"));
            }
            await Master.update(updateInfo, {where: {id: masterId}})
            await masterUpdate.setCities(updateInfo.cityId);
            return masterUpdate
        } catch (e) {
            next(ApiError.badRequest("Wrong request"));
            return
        }
    }

    async ratingUpdate(req: Request, res: Response, next: NextFunction): Promise<void | Response<UpdateDB<Master> | void>> {
        try {
            const result: UpdateDB<Master> | void = await sequelize.transaction(async () => {
                const uuid: string = req.params.uuid;
                const {review}: CreateRatingDTO = req.body;
                const orderInfo = await Order.findOne({
                    where: {ratingLink: uuid},
                    attributes: ["id", "masterId", "userId", "ratingLink"]
                })
                if (!orderInfo) {
                    next(ApiError.badRequest("Wrong request"));
                    return
                }
                const newRating: number = +req.body.rating;
                await Rating.create({
                    rating: newRating,
                    review,
                    userId: orderInfo.userId,
                    masterId: orderInfo.masterId,
                    orderId: orderInfo.id
                });
                const allRating: GetRowsDB<Rating> = await Rating.findAndCountAll({
                    where: {masterId: orderInfo.masterId},
                    attributes: ["rating"]
                })
                const averageRating = allRating.rows.reduce((sum, current) => sum + current.rating, 0) / allRating.count;
                const masterUpdate: UpdateDB<Master> = await Master.update({
                    rating: averageRating,
                }, {where: {id: orderInfo.masterId}})
                return masterUpdate;
            })
            return res.status(201).json(result);
        } catch (e) {
            next(ApiError.badRequest("Wrong request"));
            return
        }
    }

    async getRatingReviews(req: Request<{ masterId: number }>,
                           res: Response, next: NextFunction): Promise<void | Response<{ rows: Rating[], count: number }>> {
        try {
            const {masterId} = req.params
            const page: number = 1
            const limit: number = 5
            const offset: number = page * limit - limit
            const ratingReviews: { rows: Rating[], count: number } = await Rating.findAndCountAll({
                where: {masterId: masterId},
                order: [['id', 'DESC']],
                include: [{
                    model: User,
                    attributes: ["id"],
                    include: [{
                        model: Customer,
                        attributes: ["name"]
                    }]
                }], limit, offset
            })
            return res.status(200).json(ratingReviews)
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }
    }

    async checkLink(req: Request<{ uuid: string }>, res: Response, next: NextFunction) {
        try {
            const {uuid} = req.params
            const check: Order | null = await Order.findOne({
                where: {ratingLink: uuid},
                attributes: ["id"],
                include: [{
                    model: Rating,
                }]
            })
            if (check == null || check.rating) {
                next(ApiError.badRequest("Wrong request"))
                return
            }
            return res.status(200).json(check)
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }
    }


    async activate(req: Request, res: Response, next: NextFunction): Promise<void | UpdateDB<Master>> {
        try {
            const masterId: number = Number(req.params.masterId);
            const {isActivated}: UpdateMasterDTO = req.body;
            const masterUpdate: UpdateDB<Master> = await Master.update({
                isActivated,
            }, {where: {id: masterId}})
            return masterUpdate;
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"));
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void | Response<{ message: string }>> {
        try {
            const masterId: number = Number(req.params.masterId);
            const masterDelete: User | null = await User.findOne({
                include: {
                    model: Master, where: {id: masterId}, attributes: ['id'],
                    include: [Master.associations.orders]
                }
            })
            if (masterDelete === null || masterDelete.master === undefined
                || masterDelete.master.orders === undefined) {
                next(ApiError.Conflict("City isn`t empty"));
                return
            }
            if (masterDelete.master.orders.length === 0) {
                await masterDelete.destroy();
                return res.status(204).json({message: "success"});
            } else {
                next(ApiError.Conflict("Master isn`t empty"));
                return
            }
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
            return
        }
    }
}

export default new MasterLogic();