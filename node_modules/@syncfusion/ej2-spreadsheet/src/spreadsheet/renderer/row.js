import { getRowHeight, getCell, isHiddenRow, isHiddenCol } from '../../workbook/base/index';
import { attributes } from '@syncfusion/ej2-base';
import { getCellAddress, getCellIndexes, skipHiddenIdx } from '../../workbook/common/index';
/**
 * Sheet module is used for creating row element
 *
 * @hidden
 */
var RowRenderer = /** @class */ (function () {
    function RowRenderer(parent) {
        this.parent = parent;
        this.element = this.parent.createElement('tr', { attrs: { 'role': 'row' } });
        this.cellRenderer = parent.serviceLocator.getService('cell');
    }
    RowRenderer.prototype.render = function (index, isRowHeader, preventHiddenCls) {
        var row = this.element.cloneNode();
        if (index === undefined) {
            row.classList.add('e-header-row');
            return row;
        }
        row.classList.add('e-row');
        var sheet = this.parent.getActiveSheet();
        attributes(row, { 'aria-rowindex': (index + 1).toString() });
        var rowHeight = getRowHeight(sheet, index, true);
        row.style.height = rowHeight + "px";
        if (rowHeight < 20) {
            row.style.lineHeight = rowHeight > 0 ? (rowHeight - 1) + 'px' : '0px';
        }
        if (isRowHeader && !preventHiddenCls) {
            if (rowHeight < 20) {
                row.style.lineHeight = rowHeight >= 4 ? (rowHeight - 4) + 'px' :
                    rowHeight > 0 ? (rowHeight - 1) + 'px' : '0px';
                if (!row.classList.contains('e-reach-fntsize')) {
                    row.classList.add('e-reach-fntsize');
                }
            }
            if (isHiddenRow(sheet, index + 1) && !isHiddenRow(sheet, index - 1)) {
                row.classList.add('e-hide-start');
            }
            if (index !== 0 && isHiddenRow(sheet, index - 1) && !isHiddenRow(sheet, index + 1)) {
                row.classList.add('e-hide-end');
            }
        }
        return row;
    };
    RowRenderer.prototype.refresh = function (index, pRow, hRow, header, preventHiddenCls) {
        var _this = this;
        var sheet = this.parent.getActiveSheet();
        var row;
        if (header) {
            row = this.render(index, header, preventHiddenCls);
            this.cellRenderer.renderRowHeader(index, row);
        }
        else {
            var i_1;
            var len_1;
            var updateCells = function () {
                while (i_1 <= len_1) {
                    if (!isHiddenCol(sheet, i_1)) {
                        _this.cellRenderer.render({ colIdx: i_1, rowIdx: index, cell: getCell(index, i_1, sheet), address: getCellAddress(index, i_1), lastCell: i_1 === len_1, row: row, hRow: hRow,
                            isHeightCheckNeeded: true, pRow: pRow, first: index === _this.parent.viewport.topIndex &&
                                skipHiddenIdx(sheet, index, true) !== skipHiddenIdx(sheet, 0, true) ? 'Row' : '' });
                    }
                    i_1++;
                }
            };
            var frozenCol = this.parent.frozenColCount(sheet);
            if (frozenCol) {
                row = hRow;
                i_1 = getCellIndexes(sheet.topLeftCell)[0];
                len_1 = frozenCol - 1;
                updateCells();
            }
            row = this.render(index, header, preventHiddenCls);
            i_1 = this.parent.viewport.leftIndex + frozenCol;
            len_1 = this.parent.viewport.rightIndex;
            updateCells();
        }
        return row;
    };
    return RowRenderer;
}());
export { RowRenderer };
