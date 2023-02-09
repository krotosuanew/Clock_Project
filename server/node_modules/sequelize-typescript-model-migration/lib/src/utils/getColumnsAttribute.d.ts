import { ModelAttributeColumnOptions } from "sequelize/types";
export declare const getColumnsAttribute: (modelAttribute: ModelAttributeColumnOptions) => {
    [x: string]: {
        [idx: string]: {};
    };
};
