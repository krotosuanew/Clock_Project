import { Sequelize } from 'sequelize-typescript';
import { IMigrationOptions } from '../types';
export declare const generateMigration: (sequelize: Sequelize, options?: IMigrationOptions) => Promise<void>;
