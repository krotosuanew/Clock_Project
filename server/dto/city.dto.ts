import { Optional } from "sequelize/types"

export type CreateCityDTO = {
    name: string;
    price: number;

}

export type UpdateCityDTO = Optional<CreateCityDTO, 'name'>
