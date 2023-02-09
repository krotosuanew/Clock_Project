import { AbstractDataType, AbstractDataTypeConstructor, ArrayDataType, BigIntDataType, BlobDataType, DateDataType, DecimalDataType, DoubleDataType, EnumDataType, FloatDataType, GeometryDataType, IntegerDataType, ModelAttributeColumnOptions, RangeableDataType, RangeDataType, RealDataType, StringDataType, TextDataType } from 'sequelize/types';
export declare const parseString: (type: StringDataType) => string;
export declare const parseTextDateBlob: (type: TextDataType | DateDataType | BlobDataType) => string;
export declare const parseBigIntInteger: (type: BigIntDataType | IntegerDataType) => string;
export declare const parseFloatRealDouble: (type: FloatDataType | RealDataType | DoubleDataType) => string;
export declare const parseDecimal: (type: DecimalDataType) => string;
export declare const parseGeometry: (type: GeometryDataType) => string;
export declare const parseArray: <T extends AbstractDataType>(type: ArrayDataType<T>) => string;
export declare const parseRange: <T extends RangeableDataType>(type: RangeDataType<T>) => string;
export declare const parseEnum: <T extends string>(type: EnumDataType<T>) => string;
export declare const parseDataType: (type: AbstractDataTypeConstructor | RangeableDataType) => string;
export declare const extractColumns: (fields: string[], modelAttribute: ModelAttributeColumnOptions) => {
    [idx: string]: {};
};
