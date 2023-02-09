import { IExtractedModels, IMigrationOptions } from '../types';
import { IndexesOptions } from 'sequelize/types';
export declare const convertArrayToObject: (arr: any) => {
    [idx: string]: {};
};
export declare const convertObjectToArray: (target: {
    [idx: string]: any;
}) => any[];
export declare const sanitizeFields: (targets: {
    [idx: string]: any;
}) => void;
export declare const revertSanitizeFields: (targets: {
    [idx: string]: any;
}) => {
    [idx: string]: any;
};
export declare const revertIndexesWhere: (indexes: {
    [idx: string]: IndexesOptions;
}, originIndexes: {
    [idx: string]: IndexesOptions;
}) => void;
export declare const sanitizeModelsFields: (models: IExtractedModels) => IExtractedModels;
export declare const createSnapshot: (models: IExtractedModels, meta: string, options: IMigrationOptions) => Promise<unknown>;
