import {Optional} from "sequelize/types"

export type CreateRatingDTO = {
    rating: number
    review?: string
    orderId: number;
    userId: number
    masterId: number
}

export type UpdateCityDTO = Optional<CreateRatingDTO, 'rating'>
