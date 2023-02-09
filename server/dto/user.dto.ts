import {Optional} from "sequelize/types"


export type CreateUserDTO = {
    email: string,
    password: string,
    isMaster: boolean,
    name: string,
    isActivated?: boolean
}
export type GetOrCreateUserDTO = {
    email: string,
    name: string,
    regCustomer: boolean,
    changeName: boolean
}
export type LoginDTO = {
    email: string,
    password: string
}


export type UpdateUserDTO = Optional<CreateUserDTO, 'name'>
