import { CellModel } from '../base/index';
/**
 * Check the value of the cell is number with thousand separator and currency symbol and returns the parsed value.
 * @hidden
 */
export declare function checkIsNumberAndGetNumber(cell: CellModel, locale: string, groupSep: string, decimalSep: string, currencySymbol?: string): {
    isNumber: boolean;
    value: string;
};
/**
 * @hidden
 */
export declare function parseThousandSeparator(value: string, locale: string, groupSep: string, decimalSep: string): boolean;
