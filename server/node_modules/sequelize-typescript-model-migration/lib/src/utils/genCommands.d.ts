import { IExtractedModel } from '../types';
export declare const generateMigrationCommands: (template: string, upCommands: string[], downCommands: string[]) => string;
export declare const genUpCommands: (model: IExtractedModel) => string[][];
export declare const genDownCommands: (model: IExtractedModel) => string[][];
