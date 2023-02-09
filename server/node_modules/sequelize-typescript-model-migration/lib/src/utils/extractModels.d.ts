import { Model, ModelCtor } from 'sequelize/types';
import { IExtractedModels } from '../types';
export declare const sanitizeModels: (models: IExtractedModels) => IExtractedModels;
export declare const extractModels: (models: {
    [key: string]: ModelCtor<Model<any, any>>;
}) => IExtractedModels;
