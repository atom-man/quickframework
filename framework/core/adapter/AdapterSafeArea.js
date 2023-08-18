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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const Adapter_1 = require("./Adapter");
const AdapterView_1 = __importDefault(require("./AdapterView"));
const { ccclass, property, executeInEditMode, menu } = cc_1._decorator;
exports.default = (() => {
    let _classDecorators = [ccclass, executeInEditMode(true), menu("Quick适配组件/AdapterSafeArea")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _withInsertTop_decorators;
    let _withInsertTop_initializers = [];
    let _withInsertBottom_decorators;
    let _withInsertBottom_initializers = [];
    let _withInsertLeft_decorators;
    let _withInsertLeft_initializers = [];
    let _withInsertRight_decorators;
    let _withInsertRight_initializers = [];
    var AdapterSafeArea = _classThis = class extends Adapter_1.Adapter {
        constructor() {
            super(...arguments);
            this.withInsertTop = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _withInsertTop_initializers, false));
            this.withInsertBottom = __runInitializers(this, _withInsertBottom_initializers, false);
            this.withInsertLeft = __runInitializers(this, _withInsertLeft_initializers, false);
            this.withInsertRight = __runInitializers(this, _withInsertRight_initializers, false);
        }
        onChangeSize() {
            let widget = this.getComponent(cc_1.Widget);
            if (!widget || !widget.enabled) {
                return;
            }
            // 如果对齐上边界，并且包含安全区域到屏幕上边界的缝隙
            if (widget.isAlignTop && this.withInsertTop) {
                widget.isAbsoluteTop = true;
                widget.top = -AdapterView_1.default.screenPxToDesignPx(AdapterView_1.default.safeArea.safeAreaMarginTop);
                this.height += Math.abs(widget.top);
            }
            // 如果对齐下边界，并且包含安全区域到屏幕下边界的缝隙
            if (widget.isAlignBottom && this.withInsertBottom) {
                widget.isAbsoluteBottom = true;
                widget.bottom = -AdapterView_1.default.screenPxToDesignPx(AdapterView_1.default.safeArea.safeAreaMarginBottom);
                this.height += Math.abs(widget.bottom);
            }
            // 如果对齐左边界，并且包含安全区域到屏幕左边界的缝隙
            if (widget.isAlignLeft && this.withInsertLeft) {
                widget.isAbsoluteLeft = true;
                widget.left = -AdapterView_1.default.screenPxToDesignPx(AdapterView_1.default.safeArea.safeAreaMarginLeft);
                this.width += Math.abs(widget.left);
            }
            // 如果对齐右边界，并且包含安全区域到屏幕右边界的缝隙
            if (widget.isAlignRight && this.withInsertRight) {
                widget.isAbsoluteRight = true;
                widget.right = -AdapterView_1.default.screenPxToDesignPx(AdapterView_1.default.safeArea.safeAreaMarginRight);
                this.width += Math.abs(widget.right);
            }
            widget.updateAlignment();
        }
    };
    __setFunctionName(_classThis, "AdapterSafeArea");
    (() => {
        _withInsertTop_decorators = [property({
                tooltip: "是否包含安全区域和屏幕上边界之间的缝隙",
            })];
        _withInsertBottom_decorators = [property({
                tooltip: "是否包含安全区域和屏幕下边界之间的缝隙",
            })];
        _withInsertLeft_decorators = [property({
                tooltip: "是否包含安全区域和屏幕左边界之间的缝隙",
            })];
        _withInsertRight_decorators = [property({
                tooltip: "是否包含安全区域和屏幕右边界之间的缝隙",
            })];
        __esDecorate(null, null, _withInsertTop_decorators, { kind: "field", name: "withInsertTop", static: false, private: false, access: { has: obj => "withInsertTop" in obj, get: obj => obj.withInsertTop, set: (obj, value) => { obj.withInsertTop = value; } } }, _withInsertTop_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _withInsertBottom_decorators, { kind: "field", name: "withInsertBottom", static: false, private: false, access: { has: obj => "withInsertBottom" in obj, get: obj => obj.withInsertBottom, set: (obj, value) => { obj.withInsertBottom = value; } } }, _withInsertBottom_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _withInsertLeft_decorators, { kind: "field", name: "withInsertLeft", static: false, private: false, access: { has: obj => "withInsertLeft" in obj, get: obj => obj.withInsertLeft, set: (obj, value) => { obj.withInsertLeft = value; } } }, _withInsertLeft_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _withInsertRight_decorators, { kind: "field", name: "withInsertRight", static: false, private: false, access: { has: obj => "withInsertRight" in obj, get: obj => obj.withInsertRight, set: (obj, value) => { obj.withInsertRight = value; } } }, _withInsertRight_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AdapterSafeArea = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdapterSafeArea = _classThis;
})();
