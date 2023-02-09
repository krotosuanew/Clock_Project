import {Optional} from "sequelize/types"
import {City} from "../models/models";
import {Pagination} from "./global";


export type CreateMasterDTO = {
    name: string;
    rating: number;
    isActivated: boolean
    userId: number
    cityId: (number | City)[]
}
export type forGetMasters = {
    cityIDes: [] | null,
    rating: [number, number] | null,
    masterName: string | null
}
export type GetMasterDTO = Pagination & { time: Date }


export type UpdateMasterDTO = Optional<CreateMasterDTO, 'name'>
