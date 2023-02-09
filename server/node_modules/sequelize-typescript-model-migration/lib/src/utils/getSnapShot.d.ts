import { Sequelize } from "sequelize-typescript";
import { IMigrationOptions } from "../types";
export declare const getSequelizeMeta: (sequelize: Sequelize, filename?: string) => Promise<any>;
export declare const getLatestSnapshot: (meta: string, options: IMigrationOptions) => Promise<any>;
