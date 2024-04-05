import { completeAction, refreshSheetTabs, refreshImagePosition } from '../common/index';
import { skipHiddenIdx, deleteAction, triggerDataChange } from '../../workbook/common/index';
import { getCell, getCellIndexes } from '../../workbook/index';
/**
 * The `Delete` module is used to delete cells, rows, columns and sheets from the spreadsheet.
 */
var Delete = /** @class */ (function () {
    /**
     * Constructor for the Spreadsheet insert module.
     *
     * @param {Spreadsheet} parent - Constructor for the Spreadsheet insert module.
     * @private
     */
    function Delete(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    Delete.prototype.delete = function (actionArgs) {
        var args = actionArgs.eventArgs;
        if (args.modelType === 'Sheet') {
            var activeSheetDeleted = args.activeSheetIndex >= args.startIndex && args.activeSheetIndex <= args.endIndex;
            if (activeSheetDeleted) {
                this.parent.setProperties({ activeSheetIndex: this.parent.skipHiddenSheets(args.startIndex < this.parent.sheets.length ? args.startIndex :
                        (args.startIndex ? args.startIndex - 1 : 0)) }, true);
            }
            this.parent.notify(refreshSheetTabs, null);
            if (activeSheetDeleted) {
                this.parent.renderModule.refreshSheet(false, false, true);
            }
        }
        else if (args.activeSheetIndex === this.parent.activeSheetIndex) {
            var sheet = this.parent.getActiveSheet();
            if (args.modelType === 'Row') {
                if (!this.parent.scrollSettings.enableVirtualization || args.startIndex <= this.parent.viewport.bottomIndex) {
                    if (this.parent.scrollSettings.enableVirtualization) {
                        var frozenRow = this.parent.frozenRowCount(sheet);
                        if (args.startIndex < getCellIndexes(sheet.paneTopLeftCell)[0]) {
                            this.parent.updateTopLeftCell(skipHiddenIdx(sheet, args.startIndex - 1 < frozenRow ? frozenRow : args.startIndex - 1, true) - frozenRow, null, 'col');
                            this.parent.renderModule.refreshSheet(false, false, true);
                        }
                        else {
                            if (args.freezePane) {
                                this.parent.renderModule.refreshSheet(false, false, true);
                            }
                            else {
                                var frozenIndexes = [];
                                var frozenCol = this.parent.frozenColCount(sheet);
                                var colIndex = void 0;
                                var viewportColIdx = this.parent.viewport.leftIndex;
                                if (frozenCol) {
                                    frozenIndexes.push(frozenRow);
                                    frozenIndexes.push(viewportColIdx + frozenCol);
                                    colIndex = getCellIndexes(sheet.topLeftCell)[1];
                                }
                                else {
                                    colIndex = viewportColIdx;
                                }
                                this.parent.renderModule.refreshUI({ rowIndex: this.parent.viewport.topIndex, refresh: 'Row', colIndex: colIndex, skipUpdateOnFirst: this.parent.viewport.topIndex + frozenRow === skipHiddenIdx(sheet, frozenRow, true),
                                    frozenIndexes: frozenIndexes });
                                if (frozenCol) {
                                    this.parent.viewport.leftIndex = viewportColIdx;
                                }
                                this.parent.selectRange(sheet.selectedRange);
                            }
                        }
                    }
                    else {
                        this.parent.renderModule.refreshUI({ skipUpdateOnFirst: true, refresh: 'Row', rowIndex: this.parent.viewport.topIndex, colIndex: 0 });
                        this.parent.selectRange(sheet.selectedRange);
                    }
                }
            }
            else {
                if (args.refreshSheet !== false && (!this.parent.scrollSettings.enableVirtualization ||
                    args.startIndex <= this.parent.viewport.rightIndex)) {
                    var frozenCol = this.parent.frozenColCount(sheet);
                    if (this.parent.scrollSettings.enableVirtualization) {
                        if (args.startIndex < getCellIndexes(sheet.paneTopLeftCell)[1]) {
                            this.parent.updateTopLeftCell(null, skipHiddenIdx(sheet, args.startIndex - 1 < frozenCol ? frozenCol : args.startIndex - 1, true, 'columns') - frozenCol, 'row');
                            this.parent.renderModule.refreshSheet(false, false, true);
                        }
                        else {
                            if (args.freezePane || args.refreshSheet === true) {
                                this.parent.renderModule.refreshSheet(false, false, true);
                            }
                            else {
                                var frozenRow = this.parent.frozenRowCount(sheet);
                                var frozenIndexes = [];
                                var viewportRowIdx = this.parent.viewport.topIndex;
                                var rowIndex = frozenRow ? getCellIndexes(sheet.topLeftCell)[0] : viewportRowIdx;
                                if (frozenRow) {
                                    frozenIndexes = [frozenRow + viewportRowIdx, frozenCol];
                                }
                                this.parent.renderModule.refreshUI({ rowIndex: rowIndex, refresh: 'Column', colIndex: this.parent.viewport.leftIndex, insertDelete: true,
                                    skipUpdateOnFirst: this.parent.viewport.leftIndex + frozenCol === skipHiddenIdx(sheet, frozenCol, true, 'columns'), frozenIndexes: frozenIndexes });
                                if (frozenRow) {
                                    this.parent.viewport.topIndex = viewportRowIdx;
                                }
                                this.parent.selectRange(sheet.selectedRange);
                            }
                        }
                    }
                    else {
                        this.parent.renderModule.refreshUI({ skipUpdateOnFirst: true, refresh: 'Column', rowIndex: 0, colIndex: this.parent.viewport.leftIndex,
                            insertDelete: true });
                        this.parent.selectRange(sheet.selectedRange);
                    }
                }
                delete args.refreshSheet;
            }
        }
        this.refreshImgElement(args.deletedModel.length, this.parent.activeSheetIndex, args.modelType, args.startIndex);
        if (args.isAction) {
            delete args.isAction;
            this.parent.notify(completeAction, actionArgs);
        }
        else if (!args.isUndoRedo) {
            args.isMethod = true;
            this.parent.notify(triggerDataChange, actionArgs);
        }
    };
    Delete.prototype.addEventListener = function () {
        this.parent.on(deleteAction, this.delete, this);
    };
    /**
     * Destroy delete module.
     *
     * @returns {void} - Destroy delete module.
     */
    Delete.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    Delete.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(deleteAction, this.delete);
        }
    };
    /**
     * Get the delete module name.
     *
     * @returns {string} - Get the delete module name.
     */
    Delete.prototype.getModuleName = function () {
        return 'delete';
    };
    Delete.prototype.refreshImgElement = function (count, sheetIdx, modelType, index) {
        var sheet = this.parent.sheets[sheetIdx];
        var cell;
        var address = [0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
        for (var i = 0; i <= address[2]; i++) {
            for (var j = address[1]; j <= address[3]; j++) {
                cell = getCell(i, j, sheet);
                if (cell && cell.image && cell.image.length > 0) {
                    if ((modelType === 'Row' && i >= index) || (modelType === 'Column' && j >= index)) {
                        this.parent.notify(refreshImagePosition, {
                            rowIdx: i, colIdx: j, sheetIdx: sheetIdx, type: modelType, count: count, status: 'delete'
                        });
                    }
                }
            }
        }
    };
    return Delete;
}());
export { Delete };
