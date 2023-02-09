import { IndexesOptions } from 'sequelize/types';
export declare const genAddIndexCommand: (tableName: string, isUnderscore: boolean, option: IndexesOptions) => string;
export declare const genAddIndexesCommands: (tableName: string, isUnderscore: boolean | undefined, options: {
    [idx: string]: IndexesOptions;
}) => string[];
export declare const genRemoveIndexCommand: (tableName: string, idxName: string) => string;
export declare const genRemoveIndexesCommands: (tableName: string, options: {
    [idx: string]: IndexesOptions;
}) => string[];
