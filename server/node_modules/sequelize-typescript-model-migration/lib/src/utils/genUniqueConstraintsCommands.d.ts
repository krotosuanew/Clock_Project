import { IUniqueConstraints } from '../types';
export declare const genAddUniqueConstraintCommand: (tableName: string, uniqueConstraint: {}) => string;
export declare const genAddUniqueContraintsCommands: (tableName: string, constraints: IUniqueConstraints) => string[];
export declare const genRemoveUniqueConstraintsCommand: (tableName: string, constraintName: string) => string;
export declare const genRemoveUniqueConstraintsCommands: (tableName: string, keys: any) => string[];
