import { IMigrationOptions } from '../types';
export declare const readPromise: (filename: string) => Promise<string>;
export declare const writePromise: (filename: string, data: string) => Promise<unknown>;
export declare const parseCurrentVersionFromMeta: (meta?: string) => number;
export declare const getNextPrefix: (currentVersion: number) => string;
export declare const getCurrentPrefix: (currentVersion: number) => string;
export declare const createMigrationName: (meta: string, filename: string) => string;
export declare const makeFilename: (options: IMigrationOptions, meta: string, ext?: string) => string;
