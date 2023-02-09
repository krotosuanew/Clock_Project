import {Optional} from "sequelize/types"


export type CreateSizeClockDTO = {
    name: string;
    date: string;
}

export type GetSizeClockDTO = {
    limit: number;
    page: number;
    time: Date
}


export type UpdateSizeClockDTO = Optional<CreateSizeClockDTO, 'name'>
