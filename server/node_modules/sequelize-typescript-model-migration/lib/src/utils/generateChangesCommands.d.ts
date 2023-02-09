import { IExtractedModels } from '../types';
export declare const orderCommands: (commands?: {
    order: number;
    cmds: string[];
}[]) => string[];
export declare const generateChangesCommands: (prevState: IExtractedModels, curState: IExtractedModels) => string;
