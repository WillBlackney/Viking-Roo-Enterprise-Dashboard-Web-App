import { isNumber } from "../common/math";
/**
 * Check the value of the cell is number with thousand separator and currency symbol and returns the parsed value.
 * @hidden
 */
export function checkIsNumberAndGetNumber(cell, locale, groupSep, decimalSep, currencySymbol) {
    var cellValue = cell.value;
    if (isNumber(cellValue)) {
        return { isNumber: true, value: cellValue };
    }
    if (currencySymbol && (cell.format.indexOf(currencySymbol) > -1 && cellValue && cellValue.indexOf(currencySymbol) > -1)) {
        cellValue = cellValue.replace(currencySymbol, '');
    }
    if ((cell.format.indexOf(groupSep) > -1 && cellValue && cellValue.indexOf(groupSep) > -1)) {
        cellValue = parseThousandSeparator(cellValue, locale, groupSep, decimalSep) ? cellValue.split(groupSep).join('') : cellValue;
    }
    return { isNumber: isNumber(cellValue), value: cellValue };
}
/**
 * @hidden
 */
export function parseThousandSeparator(value, locale, groupSep, decimalSep) {
    var isParsed = false;
    var number = 123456;
    var parsedNum = number.toLocaleString(locale);
    var splitedNum = parsedNum.split(groupSep).reverse();
    var splitedValue = value.split(decimalSep)[0].split(groupSep);
    for (var i = 0; i < splitedValue.length; i++) {
        if (i === splitedValue.length - 1) {
            isParsed = splitedValue[i].length === splitedNum[0].length;
        }
        else {
            isParsed = i == 0 ? splitedValue[i].length <= splitedNum[1].length : splitedValue[i].length === splitedNum[1].length;
        }
        if (!isParsed) {
            break;
        }
    }
    return isParsed;
}
