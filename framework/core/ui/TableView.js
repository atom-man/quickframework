"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const LayoutDefines_1 = require("../layout/LayoutDefines");
const TableViewCell_1 = require("./TableViewCell");
const { ccclass, property, menu } = cc_1._decorator;
var Direction;
(function (Direction) {
    /**
     * @description 水平方向
     */
    Direction[Direction["HORIZONTAL"] = 0] = "HORIZONTAL";
    /**
     * @description 垂直方向
     * */
    Direction[Direction["VERTICAL"] = 1] = "VERTICAL";
})(Direction || (Direction = {}));
;
var FillOrder;
(function (FillOrder) {
    /**
     * @description 水平方向时，从左到右填充，垂直方向时，从上到下填充
     */
    FillOrder[FillOrder["TOP_DOWN"] = 0] = "TOP_DOWN";
    /**
     * @description 水平方向时，从右到左填充，垂直方向时，从下到上填充
     */
    FillOrder[FillOrder["BOTTOM_UP"] = 1] = "BOTTOM_UP";
})(FillOrder || (FillOrder = {}));
/**@description Cell信息 */
class CellInfo {
    constructor(template, view, offset, index) {
        this._view = null;
        this._templete = null;
        this._offset = null;
        this.index = 0;
        /**@description 以自己锚点为中心有左边距离 */
        this.left = 0;
        /**@description 以自己锚点为中心有右边距离 */
        this.right = 0;
        /**@description 以自己锚点为中心有上边距离 */
        this.top = 0;
        /**@description 以自己锚点为中心有下边距离 */
        this.bottom = 0;
        /**@description 节点位置 */
        this.position = (0, cc_1.v3)(0, 0, 0);
        this._templete = template;
        this._view = view;
        this.index = index;
        this.init(offset);
    }
    get isHorizontal() {
        return this._view.direction == Direction.HORIZONTAL;
    }
    get fillOrder() {
        return this._view.fillOrder;
    }
    /**@description 模板节点 */
    get node() {
        return this._templete.node;
    }
    /**@description 相对父亲节点的偏移量 */
    get offset() {
        if (this.isHorizontal) {
            return this._offset.x;
        }
        else {
            return this._offset.y;
        }
    }
    init(offset) {
        const trans = this.node.getComponent(cc_1.UITransform);
        this.left = trans.width * trans.anchorX;
        this.right = trans.width * (1 - trans.anchorX);
        this.top = trans.height * (1 - trans.anchorY);
        this.bottom = trans.height * trans.anchorY;
        if (this.isHorizontal) {
            this._offset = (0, cc_1.v2)(offset, 0);
        }
        else {
            this._offset = (0, cc_1.v2)(0, offset);
        }
    }
    calculatePosition() {
        let result = this._align(this.node, this._view.content, this._offset);
        this.position.x = result.x;
        this.position.y = result.y;
        return this.position;
    }
    clone() {
        let result = new CellInfo(this._templete, this._view, this.offset, this.index);
        result.position.x = this.position.x;
        result.position.y = this.position.y;
        return result;
    }
    /**
     * @description 根据当前填充方式及视图方向设置Cell的对齐方式
     * @param node
     * @param target
     * @param offset
     * @returns
     */
    _align(node, target, offset) {
        let layoutParam = new LayoutDefines_1.LayoutParam;
        layoutParam.node = node;
        layoutParam.target = target;
        if (this.isHorizontal) {
            //水平方向
            //居中对齐 y
            if (this.fillOrder == FillOrder.TOP_DOWN) {
                layoutParam.alignFlags = LayoutDefines_1.LayoutType.MID_LETF;
                layoutParam.left = offset.x;
            }
            else {
                layoutParam.alignFlags = LayoutDefines_1.LayoutType.MID_RIGHT;
                layoutParam.right = offset.x;
            }
        }
        else {
            //垂直方向
            //居中对齐 x
            if (this.fillOrder == FillOrder.TOP_DOWN) {
                //顶对齐 y
                layoutParam.alignFlags = LayoutDefines_1.LayoutType.CENTER_TOP;
                layoutParam.top = offset.y;
            }
            else {
                //底对齐 y
                layoutParam.alignFlags = LayoutDefines_1.LayoutType.CENTER_BOT;
                layoutParam.bottom = offset.y;
            }
        }
        App.layout.align(layoutParam);
        return layoutParam.result.position;
    }
    debug(began, end) {
        let str = `[${this.index}] 位置 : (${this.position.x},${this.position.y}) , 偏移 : ${this.offset} , 左 : ${this.left} , 右 : ${this.right} , 上 : ${this.top} , 下 : ${this.bottom} `;
        if (began) {
            str = began + str;
        }
        if (end) {
            str += end;
        }
        Log.d(str);
    }
    /**
     * @description 计算Cell距离view视图(水平方向 : 左边界,垂直方向 : 上边界)的偏移量
     * */
    calculateSight(fillOrder, isHorizontal, vec, viewSize) {
        let result = {
            isInSight: false,
            offset: 0
        };
        let trans = this.node.getComponent(cc_1.UITransform);
        if (isHorizontal) {
            //水平方向
            if (fillOrder == FillOrder.TOP_DOWN) {
                let scaleX = this.node.scale.x;
                let x = this.position.x;
                if (scaleX < 0) {
                    x -= this.right;
                }
                //左对齐 计算超出view节点可显示区域的宽度
                // Log.d(`vec : (${vec.x},${vec.y})`)
                let left = vec.x + x - this.left;
                if (left >= 0) {
                    if (left < viewSize.width) {
                        //自己最左还在视图内，就处理可显示区域内
                        // Log.d(`【可见】距离左边 : ${left}`);
                        result.isInSight = true;
                    }
                    else {
                        // Log.d(`【不可见】距离左边 : ${left}`);
                    }
                }
                else {
                    let overLeft = trans.width + left;
                    if (overLeft > 0) {
                        // Log.d(`【可见】超出左边界 : ${-left}`);
                        result.isInSight = true;
                    }
                    else {
                        // Log.d(`【不可见】距离左边 : ${overLeft}`);
                    }
                }
                result.offset = left;
            }
            else {
                let scaleX = this.node.scale.x;
                let x = this.position.x;
                if (scaleX < 0) {
                    x += this.left;
                }
                //左对齐 计算超出view节点可显示区域的宽度
                // Log.d(`vec : (${vec.x},${vec.y})`)
                let left = vec.x + x - this.left;
                if (left > 0) {
                    if (left < viewSize.width) {
                        //自己最左还在视图内，就处理可显示区域内
                        // Log.d(`【可见】距离左边 : ${left}`);
                        result.isInSight = true;
                    }
                    else {
                        // Log.d(`【不可见】距离左边 : ${left}`);
                    }
                }
                else {
                    let overLeft = trans.width + left;
                    if (overLeft > 0) {
                        // Log.d(`【可见】距离左边 : ${left}`);
                        result.isInSight = true;
                    }
                    else {
                        // Log.d(`【不可见】超出左边界 : ${-overLeft + this.node.width}`);
                    }
                }
                result.offset = left;
            }
        }
        else {
            //垂直方向
            if (fillOrder == FillOrder.TOP_DOWN) {
                let scaleY = this.node.scale.y;
                let y = this.position.y;
                if (scaleY < 0) {
                    y += this.bottom;
                }
                //顶对齐 计算超出view节点可显示区域的高度
                let top = vec.y + y + this.top;
                // Log.d(`top : ${top}`);
                if (top > 0) {
                    if (top > trans.height) {
                        // Log.d(`【不可见】超出上边界 : ${top}`);
                    }
                    else {
                        // Log.d(`【可见】超出上边界 : ${top}`);
                        result.isInSight = true;
                    }
                }
                else {
                    if (viewSize.height + top < 0) {
                        // Log.d(`【不可见】超出下边界 : ${top}`);
                    }
                    else {
                        // Log.d(`【可见】距离顶部 : ${top}`);
                        result.isInSight = true;
                    }
                }
                result.offset = top;
            }
            else {
                let scaleY = this.node.scale.y;
                let y = this.position.y;
                if (scaleY < 0) {
                    y -= this.top;
                }
                //底对齐 计算超出view节点可显示区域的高度
                let top = -(vec.y + y + this.top);
                // Log.d(`top : ${top}`);
                if (top >= 0) {
                    if (viewSize.height - top < 0) {
                        // Log.d(`【不可见】距离上边界 : ${top}`);
                    }
                    else {
                        // Log.d(`【可见】距离上边界 : ${top}`);
                        result.isInSight = true;
                    }
                }
                else {
                    let overTop = -top;
                    if (overTop > trans.height) {
                        // Log.d(`【不可见】超出上边界 : ${overTop}`);
                    }
                    else {
                        // Log.d(`【可见】超出上边界 : ${overTop}`);
                        result.isInSight = true;
                    }
                }
                result.offset = top;
            }
        }
        return result;
    }
}
exports.default = (() => {
    let _classDecorators = [ccclass("TableView"), menu("QuickUI组件/TableView")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _get_horizontalScrollBar_decorators;
    let _get_verticalScrollBar_decorators;
    let __direction_decorators;
    let __direction_initializers = [];
    let _horizontal_decorators;
    let _horizontal_initializers = [];
    let _vertical_decorators;
    let _vertical_initializers = [];
    let __template_decorators;
    let __template_initializers = [];
    let _fillOrder_decorators;
    let _fillOrder_initializers = [];
    var TableView = _classThis = class extends cc_1.ScrollView {
        constructor() {
            super(...arguments);
            this._direction = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __direction_initializers, Direction.HORIZONTAL));
            /**
             * @deprecated 不支持该方法，请使用direction替代
             */
            this.horizontal = __runInitializers(this, _horizontal_initializers, true);
            /**
            * @deprecated 不支持该方法，请使用direction替代
            */
            this.vertical = __runInitializers(this, _vertical_initializers, true);
            this._template = __runInitializers(this, __template_initializers, []);
            /**@description 模板大小 */
            this._templateSize = new Map();
            this.fillOrder = __runInitializers(this, _fillOrder_initializers, FillOrder.TOP_DOWN);
            this._delegate = null;
            /**@description 当前正在使用的cell */
            this._cellsUsed = [];
            /**@description 当前回收复制的cell */
            this._cellsFreed = [];
            /**@description 保存Cell的信息 */
            this._cellsInfos = [];
            /**@description 当前渲染节点索引 */
            this._indices = new Set();
            /**@description 添加或者删除时，_cellsUsed并不是按index顺序排序的，此时需要重新排序_cellsUsed */
            this._isUsedCellsDirty = false;
            this._oldDirection = null;
            /**@description 在插入或删除时，会收到content的大小改变事件，从来调用刷新，在操作插入删除时，屏蔽掉 */
            this._isDoing = false;
            /**@description 测试用 */
            this._isShowAllCell = false;
        }
        get horizontalScrollBar() {
            return this._horizontalScrollBar;
        }
        set horizontalScrollBar(value) {
            if (this._horizontalScrollBar === value) {
                return;
            }
            this._horizontalScrollBar = value;
            if (this._horizontalScrollBar) {
                this._horizontalScrollBar.setScrollView(this);
                this._updateScrollBar(cc_1.Vec2.ZERO);
            }
        }
        get verticalScrollBar() {
            return this._verticalScrollBar;
        }
        set verticalScrollBar(value) {
            if (this._verticalScrollBar === value) {
                return;
            }
            this._verticalScrollBar = value;
            if (this._verticalScrollBar) {
                this._verticalScrollBar.setScrollView(this);
                this._updateScrollBar(cc_1.Vec2.ZERO);
            }
        }
        /**@description 视图滚动方向 */
        get direction() {
            return this._direction;
        }
        set direction(v) {
            if (this._direction == v) {
                return;
            }
            this._direction = v;
        }
        /**
         * @description 使用需要注意，设置模板时，要一次性设置，不要拿着当前模板操作
         * @example
         * let template = this.template;
         * template.push(template1)
         * template.push(template2)
         * template.push(template3)
         * this.template = template;
         * */
        get template() {
            return this._template;
        }
        set template(v) {
            this._template = v;
        }
        /**@description 代理 */
        get delegate() {
            if (!this._delegate) {
                Log.e(`【${this.name}】致命错误 : 未设置TableView代理`);
            }
            return this._delegate;
        }
        set delegate(v) {
            if (this._delegate === v) {
                return;
            }
            this._delegate = v;
        }
        get viewSize() {
            var _a;
            let trans = (_a = this.view) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.UITransform);
            if (trans) {
                return trans.contentSize;
            }
            return cc_1.Size.ZERO;
        }
        get viewAnchor() {
            var _a;
            let out = (_a = this.view) === null || _a === void 0 ? void 0 : _a.anchorPoint;
            if (out) {
                return out;
            }
            return cc_1.Vec2.ZERO;
        }
        get contentSize() {
            var _a;
            let trans = (_a = this.content) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.UITransform);
            if (trans) {
                return trans.contentSize;
            }
            return cc_1.Size.ZERO;
        }
        get contentAnchor() {
            var _a;
            let trans = (_a = this.content) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.UITransform);
            if (trans) {
                return trans.anchorPoint;
            }
            return cc_1.Vec2.ZERO;
        }
        /**@description 滚动到指定项 */
        scrollToIndex(index, timeInSecond = 0, attenuated = true) {
            if (!this.content) {
                return;
            }
            if (!(index >= 0 && index < this.delegate.numberOfCellsInTableView(this))) {
                Log.e(`错误的index : ${index}`);
                return;
            }
            // Log.d(`滚动到 : ${index}`);
            let offset = this.getScrollOffset();
            let info = this._cellsInfos[index];
            // Log.d(`offset : (${offset.x},${offset.y})`)
            if (this.fillOrder == FillOrder.TOP_DOWN) {
                if (this.direction == Direction.HORIZONTAL) {
                    offset.x = info.offset;
                }
                else {
                    offset.y = info.offset;
                }
            }
            else {
                let next = this._cellsInfos[index + 1];
                if (this.direction == Direction.HORIZONTAL) {
                    offset.x = this.contentSize.width - next.offset;
                }
                else {
                    offset.y = this.contentSize.height - next.offset;
                }
            }
            this.scrollToOffset(offset, timeInSecond, attenuated);
        }
        /**
         * @description 更新指定项
         * @param index
         */
        updateCellAtIndex(index) {
            let count = this.delegate.numberOfCellsInTableView(this);
            if (!(count > 0 && index < count && index >= 0)) {
                return;
            }
            let cell = this.cellAtIndex(index);
            if (cell) {
                //先移除旧的
                this._moveCellOutOfSight(cell);
            }
            //获取cell类型
            let type = this.delegate.tableCellTypeAtIndex(this, index);
            //获取是否有可复用的节点
            cell = this._dequeueCell(type);
            if (!cell) {
                //如果有可复用的，直接刷新
                let template = this._getTemplete(type);
                if (!template) {
                    return;
                }
                let node = (0, cc_1.instantiate)(template.node);
                cell = node.getComponent(TableViewCell_1.TableViewCell);
            }
            if (!cell) {
                return;
            }
            this._setIndexForCell(index, cell);
            this._addCellIfNecessary(cell);
            cell.init();
            this._updateCellData(cell);
        }
        /**
         * @description 插入项，默认为插入到最后,数据先插入才能调用，注意：注入时，需要数据项先更新数据
         * 如果是最后插入时，应该返回已经插入数据项的length-1,即最后一个数据项的下标索引
         * @param index
         */
        insertCellAtIndex(index) {
            let count = this.delegate.numberOfCellsInTableView(this);
            if (count == 0) {
                return;
            }
            if (index == undefined || index == null) {
                index = count - 1;
            }
            if (index > count - 1) {
                return;
            }
            this._isDoing = true;
            let offset = this.getScrollOffset();
            this._updateCellOffsets();
            this._updateContentSize();
            let cell = this.cellAtIndex(index);
            if (cell) {
                Log.d(`插入的Cell[${index}]在显示区域内`);
                let start = this._getCellIndex(cell);
                this._moveCellIndex(start);
            }
            else {
                Log.d(`插入的Cell${index}不在显示区域内,更新显示区域内的索引`);
                this._moveCellIndex(index);
            }
            let type = this.delegate.tableCellTypeAtIndex(this, index);
            let newCell = this._dequeueCell(type);
            if (!newCell) {
                let template = this._getTemplete(type);
                if (!template) {
                    return;
                }
                let node = (0, cc_1.instantiate)(template.node);
                newCell = node.getComponent(TableViewCell_1.TableViewCell);
            }
            if (!newCell) {
                return;
            }
            this._setIndexForCell(index, newCell);
            this._addCellIfNecessary(newCell);
            newCell.init();
            this._updateCellData(newCell);
            this._isDoing = false;
            this._calculateSightArea();
            this.scrollToOffset(offset);
        }
        /**
         * @description 删除指定项
         * @param index
         * @description 通知删除数据，在些回调用删除数据源
         */
        removeCellAtIndex(index, deleteDataFunc) {
            let count = this.delegate.numberOfCellsInTableView(this);
            if (!(count > 0 && index >= 0 && index < count)) {
                return;
            }
            let offset = this.getScrollOffset();
            //先从显示区域内获得该节点
            //通知删除数据
            deleteDataFunc(index);
            this._isDoing = true;
            this._updateCellOffsets();
            this._updateContentSize();
            this._moveCellIndex(index, true);
            this._isDoing = false;
            this._calculateSightArea();
            this.scrollToOffset(offset);
        }
        /**
         * @description 重置数据
         */
        reloadData(isResePosition = true) {
            var _a;
            if (isResePosition) {
                this._oldDirection = null;
            }
            else {
                this._oldDirection = this.direction;
            }
            //删除当前渲染的cell
            for (let i = 0; i < this._cellsUsed.length; i++) {
                let cell = this._cellsUsed[i];
                if (this.delegate.tableCellWillRecycle) {
                    this.delegate.tableCellWillRecycle(this, cell);
                }
                this._cellsFreed.push(cell);
                cell.reset();
                if (cell.node.parent == this.content) {
                    (_a = this.content) === null || _a === void 0 ? void 0 : _a.removeChild(cell.node);
                }
            }
            //清空渲染节点索引
            this._indices.clear();
            //清空当前使用的节点
            this._cellsUsed = [];
            this._isDoing = true;
            //刷新节点的位置
            this._updateCellOffsets();
            this._updateContentSize();
            this._isDoing = false;
            this._calculateSightArea();
            if (this._oldDirection != this.direction) {
                if (this.delegate.numberOfCellsInTableView(this) > 0) {
                    if (this.direction == Direction.HORIZONTAL) {
                        this.scrollToLeft();
                    }
                    else {
                        this.scrollToTop();
                    }
                }
                this._oldDirection = this.direction;
            }
        }
        /**
         * @description 返回指定位置的cell,注意：只会从当前显示节点中返回，如果没有在显示，会返回null
         * @param index
         * @returns
         */
        cellAtIndex(index) {
            if (this._indices.has(index)) {
                for (let i = 0; i < this._cellsUsed.length; i++) {
                    if (this._cellsUsed[i].index == index) {
                        return this._cellsUsed[i];
                    }
                }
            }
            return null;
        }
        /**
         * @description 更新Cell显示索引
         * @param data
         */
        _updateCellIndices(data) {
            let origin = [];
            this._indices.forEach((v, v2, set) => {
                origin.push(v);
            });
            if (origin.length <= 0) {
                return;
            }
            this._indices.clear();
            for (let i = 0; i < origin.length; i++) {
                let changeData = data.find((v) => {
                    if (v.from == origin[i]) {
                        return true;
                    }
                    return false;
                });
                if (changeData) {
                    origin[i] = changeData.to;
                }
                this._indices.add(origin[i]);
            }
        }
        /**
         * @description 移动cell的incdex
         * @param start 开始位置
         * @param isDelete 是否是删除 默认为false
         */
        _moveCellIndex(start, isDelete = false) {
            let update = [];
            let offset = isDelete ? -1 : 1;
            if (isDelete) {
                let deleteCellIndex = this._cellsUsed.findIndex((v, index, arr) => {
                    if (v.index == start) {
                        return true;
                    }
                    return false;
                });
                if (deleteCellIndex != -1) {
                    this._moveCellOutOfSight(this._cellsUsed[deleteCellIndex]);
                }
            }
            for (let i = 0; i < this._cellsUsed.length; i++) {
                let temp = this._cellsUsed[i];
                if (temp.index >= start) {
                    if (isDelete && temp.index == start) {
                        continue;
                    }
                    let from = temp.index;
                    let to = temp.index + offset;
                    this._setIndexForCell(to, temp);
                    this._updateCellData(temp);
                    update.push({ from: from, to: to });
                }
                else {
                    //区域外的，需要更新位置
                    this._updateCellPosition(temp);
                }
            }
            //更新当前显示的索引
            this._updateCellIndices(update);
        }
        /**
         * @description 按index的升序排序
         */
        _sortCell() {
            this._cellsUsed = this._cellsUsed.sort((a, b) => {
                return a.index - b.index;
            });
        }
        _debugCellInfos(title) {
            Log.d(`--------------------- ${title} ---------------------`);
            this._cellsInfos.forEach(v => {
                v.debug();
            });
        }
        _debugCell(title) {
            Log.d(`--------------------- ${title} ---------------------`);
            Log.d(`当前显示节点 :`, this._indices);
            this._cellsUsed.forEach((v, index, array) => {
                Log.d(`[${index}] , type : ${v.type} ,index : ${v.index} , ${v.string} , position : (${v.node.position.x},${v.node.position.y})`);
            });
        }
        _getCellIndex(cell) {
            for (let i = 0; i < this._cellsUsed.length; i++) {
                if (this._cellsUsed[i] === cell) {
                    return this._cellsUsed[i].index;
                }
            }
            return -1;
        }
        _debugData() {
            if (this.delegate && this.delegate.tableDebug) {
                this.delegate.tableDebug(this);
            }
        }
        _updateCellData(cell) {
            // Log.d(`通知更新Cell[${cell.index}]项`);
            this.delegate.updateCellData(this, cell);
        }
        /**@description 更新Cell位置 */
        _updateCellPosition(cell) {
            let info = this._cellsInfos[cell.index];
            cell.node.setPosition(info.position);
        }
        _addCellIfNecessary(cell) {
            var _a;
            if (cell.node.parent != this.content) {
                (_a = this.content) === null || _a === void 0 ? void 0 : _a.addChild(cell.node);
            }
            else {
                Log.e(`添加的Cell 已经有父节点`);
            }
            this._cellsUsed.push(cell);
            this._indices.add(cell.index);
            this._isUsedCellsDirty = true;
        }
        _setIndexForCell(index, cell) {
            cell.view = this;
            cell.index = index;
            cell.node.active = true;
            let info = this._cellsInfos[index];
            cell.node.setPosition(info.position);
        }
        /**
        * @description 返回当前可重用节点
        * @param type 指定类型获取
        * @returns
        */
        _dequeueCell(type) {
            let cell = null;
            if (this._cellsFreed.length <= 0) {
                return cell;
            }
            for (let i = 0; i < this._cellsFreed.length; i++) {
                let v = this._cellsFreed[i];
                if (v.type == type) {
                    this._cellsFreed.splice(i, 1);
                    return v;
                }
            }
            return cell;
        }
        /**
         * @description 更新Cell位置偏移
         * @param isUpdatePosition 默认为true
         */
        _updateCellOffsets() {
            let count = this.delegate.numberOfCellsInTableView(this);
            this._cellsInfos = [];
            if (count > 0) {
                let cur = 0;
                let size = { width: 0, height: 0 };
                let type;
                let i = 0;
                let cell = null;
                for (i = 0; i < count; i++) {
                    type = this.delegate.tableCellTypeAtIndex(this, i);
                    cell = this._getTemplete(type);
                    let info = new CellInfo(cell, this, cur, i);
                    this._cellsInfos.push(info);
                    let trans = cell.node.getComponent(cc_1.UITransform);
                    size.width = trans.width;
                    size.height = trans.height;
                    if (this.direction == Direction.HORIZONTAL) {
                        //水平
                        cur += size.width;
                    }
                    else {
                        cur += size.height;
                    }
                }
                //最后一项
                let info = new CellInfo(cell, this, cur, i);
                this._cellsInfos.push(info);
            }
        }
        /**@description 更新Cell位置数据 */
        _updateCellPositions() {
            this._cellsInfos.forEach(v => {
                v.calculatePosition();
            });
        }
        /**
         * @description 更新content的大小
         */
        _updateContentSize() {
            let size = new cc_1.Size(0, 0);
            let count = this.delegate.numberOfCellsInTableView(this);
            if (count > 0) {
                let maxPos = this._cellsInfos[count].offset;
                if (this.direction == Direction.HORIZONTAL) {
                    size = new cc_1.Size(maxPos, this.viewSize.height);
                }
                else {
                    size = new cc_1.Size(this.viewSize.width, maxPos);
                }
            }
            if (this.content) {
                let trans = this.content.getComponent(cc_1.UITransform);
                trans.setContentSize(size);
            }
            this._updateCellPositions();
        }
        /**
         * @description 计算显示区域
         * @returns
         */
        _calculateSightArea() {
            if (!this.content) {
                return;
            }
            if (this._isDoing) {
                return;
            }
            //计算开始点结束点
            let _offset = this.content.position;
            let offset = new cc_1.Vec2(_offset.x, _offset.y);
            let contentSize = this.contentSize;
            let contentAnchor = this.contentAnchor;
            let viewSize = this.viewSize;
            let viewAnchor = this.viewAnchor;
            let contentBottom = -contentAnchor.y * contentSize.height;
            let viewBottom = -viewAnchor.y * viewSize.height;
            let viewLeft = viewAnchor.x * viewSize.width;
            contentBottom = offset.y + contentBottom;
            let vec = null;
            if (this.direction == Direction.HORIZONTAL) {
                vec = (0, cc_1.v2)(viewLeft, offset.y).add(offset);
            }
            else {
                vec = (0, cc_1.v2)(offset.x, viewBottom).add(offset);
            }
            // 要先排序，才能进行计算
            if (this._isUsedCellsDirty) {
                this._sortCell();
            }
            let maxId = Math.max(this.delegate.numberOfCellsInTableView(this) - 1, 0);
            let result = this._calculateInInSight(vec);
            if (result) {
                //移除start之前的不可显示节点
                if (this._cellsUsed.length > 0) {
                    let cell = this._cellsUsed[0];
                    let idx = cell.index;
                    while (idx < result.start) {
                        this._moveCellOutOfSight(cell);
                        if (this._cellsUsed.length > 0) {
                            cell = this._cellsUsed[0];
                            idx = cell.index;
                        }
                        else {
                            break;
                        }
                    }
                }
                //移除end之后的不可显示节点
                if (this._cellsUsed.length > 0) {
                    let cell = this._cellsUsed[this._cellsUsed.length - 1];
                    let idx = cell.index;
                    while (idx <= maxId && idx > result.end) {
                        this._moveCellOutOfSight(cell);
                        if (this._cellsUsed.length > 0) {
                            cell = this._cellsUsed[this._cellsUsed.length - 1];
                            idx = cell.index;
                        }
                        else {
                            break;
                        }
                    }
                }
                //更新显示项
                for (let i = result.start; i <= result.end; i++) {
                    //正在显示的，跳过更新
                    if (this._indices.has(i)) {
                        // Log.d(`Cell[${i}]项已经显示，跳过更新`);
                        continue;
                    }
                    this.updateCellAtIndex(i);
                }
            }
        }
        _getTemplete(type) {
            for (let i = 0; i < this.template.length; i++) {
                let v = this.template[i];
                if (v.type == type) {
                    return this.template[i];
                }
            }
            return null;
        }
        _moveCellOutOfSight(cell) {
            var _a;
            if (this.delegate && this.delegate.tableCellWillRecycle) {
                this.delegate.tableCellWillRecycle(this, cell);
            }
            // Log.d(`移除Cell ${cell.index}`);
            this._cellsFreed.push(cell);
            let index = this._cellsUsed.indexOf(cell);
            if (index != -1) {
                this._cellsUsed.splice(index, 1);
            }
            this._indices.delete(cell.index);
            cell.reset();
            if (cell.node.parent == this.content) {
                (_a = this.content) === null || _a === void 0 ? void 0 : _a.removeChild(cell.node);
            }
            this._isUsedCellsDirty = true;
        }
        /**
         * @description 计算当前可见Cell (二分查找，速度快点)
         * */
        _calculateInInSight(offset) {
            let result = null;
            if (this._cellsInfos.length <= 0) {
                return result;
            }
            let count = this.delegate.numberOfCellsInTableView(this);
            if (count <= 0) {
                return result;
            }
            result = { start: 0, end: 0, count: count };
            if (this._isShowAllCell) {
                result.start = 0;
                result.end = count - 1;
                return result;
            }
            if (count == 1) {
                return result;
            }
            let low = 0;
            let high = count;
            let viewSize = this.viewSize;
            let search = -1;
            let index = 0;
            while (high >= low) {
                index = Math.floor(low + (high - low) / 2);
                if (index < 0 || index >= this._cellsInfos.length) {
                    return null;
                }
                let cellStart = this._cellsInfos[index];
                let startResult = cellStart.calculateSight(this.fillOrder, this.direction == Direction.HORIZONTAL, offset, viewSize);
                if (startResult.isInSight) {
                    search = index;
                    break;
                }
                if (index + 1 < 0 || index + 1 >= this._cellsInfos.length) {
                    return null;
                }
                let cellEnd = this._cellsInfos[index + 1];
                let endResult = cellEnd.calculateSight(this.fillOrder, this.direction == Direction.HORIZONTAL, offset, viewSize);
                if (endResult.isInSight) {
                    search = index;
                    break;
                }
                //都没有找到，向偏移为0的靠拢
                if (Math.abs(startResult.offset) < Math.abs(endResult.offset)) {
                    high = index - 1;
                }
                else {
                    low = index + 1;
                }
            }
            if (search < 0) {
                return null;
            }
            result.start = search;
            result.end = search;
            //向前找出可显示Cell
            for (let i = search - 1; i >= 0; i--) {
                let cell = this._cellsInfos[i];
                let temp = cell.calculateSight(this.fillOrder, this.direction == Direction.HORIZONTAL, offset, viewSize);
                if (temp.isInSight) {
                    result.start = i;
                }
                else {
                    break;
                }
            }
            //向后找出可显示Cell
            for (let i = search + 1; i < count; i++) {
                let cell = this._cellsInfos[i];
                let temp = cell.calculateSight(this.fillOrder, this.direction == Direction.HORIZONTAL, offset, viewSize);
                if (temp.isInSight) {
                    result.end = i;
                }
                else {
                    break;
                }
            }
            // Log.d(`可显示节点 : ${result.start} -> ${result.end}`);
            return result;
        }
        /**
         * @description 不支持该方法
         */
        scrollToTopLeft(timeInSecond, attenuated) {
            Log.w(`不支持该方法`);
        }
        /**
         * @description 不支持该方法
         */
        scrollToTopRight(timeInSecond, attenuated) {
            Log.w(`不支持该方法`);
        }
        /**
         * @deprecated 不支持该方法
         */
        scrollToBottomLeft(timeInSecond, attenuated) {
            Log.w(`不支持该方法`);
        }
        /**
         * @description 不支持该方法
         */
        scrollToBottomRight(timeInSecond, attenuated) {
            Log.w(`不支持该方法`);
        }
        _onMouseWheel(event, captureListeners) {
            if (!this.enabledInHierarchy) {
                return;
            }
            if (this._hasNestedViewGroup(event, captureListeners)) {
                return;
            }
            const deltaMove = new cc_1.Vec3();
            const wheelPrecision = -0.1;
            const scrollY = event.getScrollY();
            if (this.direction == Direction.VERTICAL) {
                deltaMove.set(0, scrollY * wheelPrecision, 0);
            }
            else {
                deltaMove.set(scrollY * wheelPrecision, 0, 0);
            }
            this._mouseWheelEventElapsedTime = 0;
            this._processDeltaMove(deltaMove);
            if (!this._stopMouseWheel) {
                this._handlePressLogic();
                this.schedule(this._checkMouseWheel, 1.0 / 60, NaN, 0);
                this._stopMouseWheel = true;
            }
            this._stopPropagationIfTargetIsMe(event);
        }
        _flattenVectorByDirection(vector) {
            const result = vector;
            result.x = this.direction == Direction.HORIZONTAL ? result.x : 0;
            result.y = this.direction == Direction.VERTICAL ? result.y : 0;
            return result;
        }
        /**
        * @description 重写ScrollView的私有方法
        * @param position
        * @returns
        */
        _setContentPosition(position) {
            var _a;
            if (!this._content) {
                return;
            }
            const contentPos = (_a = this.content) === null || _a === void 0 ? void 0 : _a.getPosition();
            if (Math.abs(position.x - contentPos.x) < this.getScrollEndedEventTiming() && Math.abs(position.y - contentPos.y) < this.getScrollEndedEventTiming()) {
                return;
            }
            this._content.setPosition(position);
            this._calculateSightArea();
            this._outOfBoundaryAmountDirty = true;
        }
    };
    __setFunctionName(_classThis, "TableView");
    (() => {
        _get_horizontalScrollBar_decorators = [property({
                override: true, displayOrder: 20,
                visible: function () {
                    return this.direction == Direction.HORIZONTAL;
                }
            })];
        _get_verticalScrollBar_decorators = [property({
                override: true, displayOrder: 21,
                visible: function () {
                    return this.direction == Direction.VERTICAL;
                }
            })];
        __direction_decorators = [property({
                tooltip: "滚动方向 \nHORIZONTAL 水平方向 \nVERTICAL 垂直方向", displayName: "Direction", type: (0, cc_1.Enum)(Direction), visible: true, displayOrder: 22
            })];
        _horizontal_decorators = [property({ visible: false, override: true })];
        _vertical_decorators = [property({ visible: false, override: true })];
        __template_decorators = [property({ tooltip: "Cell项模板", displayName: "Template", type: TableViewCell_1.TableViewCell, visible: true, displayOrder: 23 })];
        _fillOrder_decorators = [property({ displayOrder: 24, tooltip: "填充方式 \nTOP_DOWN 水平方向时，从左到右填充，垂直方向时，从上到下填充 \nBOTTOM_UP 水平方向时，从右到左填充，垂直方向时，从下到上填充", type: (0, cc_1.Enum)(FillOrder) })];
        __esDecorate(_classThis, null, _get_horizontalScrollBar_decorators, { kind: "getter", name: "horizontalScrollBar", static: false, private: false, access: { has: obj => "horizontalScrollBar" in obj, get: obj => obj.horizontalScrollBar } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_verticalScrollBar_decorators, { kind: "getter", name: "verticalScrollBar", static: false, private: false, access: { has: obj => "verticalScrollBar" in obj, get: obj => obj.verticalScrollBar } }, null, _instanceExtraInitializers);
        __esDecorate(null, null, __direction_decorators, { kind: "field", name: "_direction", static: false, private: false, access: { has: obj => "_direction" in obj, get: obj => obj._direction, set: (obj, value) => { obj._direction = value; } } }, __direction_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _horizontal_decorators, { kind: "field", name: "horizontal", static: false, private: false, access: { has: obj => "horizontal" in obj, get: obj => obj.horizontal, set: (obj, value) => { obj.horizontal = value; } } }, _horizontal_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _vertical_decorators, { kind: "field", name: "vertical", static: false, private: false, access: { has: obj => "vertical" in obj, get: obj => obj.vertical, set: (obj, value) => { obj.vertical = value; } } }, _vertical_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, __template_decorators, { kind: "field", name: "_template", static: false, private: false, access: { has: obj => "_template" in obj, get: obj => obj._template, set: (obj, value) => { obj._template = value; } } }, __template_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _fillOrder_decorators, { kind: "field", name: "fillOrder", static: false, private: false, access: { has: obj => "fillOrder" in obj, get: obj => obj.fillOrder, set: (obj, value) => { obj.fillOrder = value; } } }, _fillOrder_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        TableView = _classThis = _classDescriptor.value;
    })();
    _classThis.Direction = Direction;
    _classThis.FillOrder = FillOrder;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TableView = _classThis;
})();
