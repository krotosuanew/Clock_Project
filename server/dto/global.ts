import {Request} from "express";

export type UpdateDB<T> = [number, T[]];

export type GetRowsDB<T> = {
    rows: T[],
    count: number
}

export type Pagination = {
    limit: number;
    page: number;
}

export enum DIRECTION {
    DOWN = 'ASC',
    UP = 'DESC',
    MASTER = "MASTER"
}

export enum ROLES {
    ADMIN = "ADMIN",
    CUSTOMER = "CUSTOMER",
    MASTER = "MASTER"
}

export type ReqQuery<T> = Request<{}, {}, {}, T>

