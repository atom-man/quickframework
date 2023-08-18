"use strict";
/**
 */
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
const Adapter_1 = require("./Adapter");
const { ccclass, property, executeInEditMode, menu } = cc_1._decorator;
exports.default = (() => {
    let _classDecorators = [ccclass, executeInEditMode(true), menu("Quick适配组件/AdapterRoot")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdapterRoot = _classThis = class extends Adapter_1.Adapter {
        /**
         * 窗口尺寸发生改变时，更新适配节点的宽高
         */
        onChangeSize() {
            // 1. 先找到 SHOW_ALL 模式适配之后，本节点的实际宽高以及初始缩放值
            let canvasSize = cc_1.screen.windowSize;
            let widthRate = canvasSize.width / this.width;
            let heightRate = canvasSize.height / this.height;
            let scaleForShow = Math.min(widthRate, heightRate);
            // Log.d('scaleForShow:'+scaleForShow);
            let realWidth = this.width * scaleForShow;
            let realHeight = this.height * scaleForShow;
            // 2. 基于第一步的数据，再做缩放适配
            widthRate = canvasSize.width / realWidth;
            heightRate = canvasSize.height / realHeight;
            let scaleForShowAll = Math.max(widthRate, heightRate);
            // // 1. 计算 SHOW_ALL 模式下，本节点缩放到完全能显示节点所有内容的实际缩放值
            let designWidth = cc_1.view.getVisibleSize().width;
            let designHeight = cc_1.view.getVisibleSize().height;
            // Log.d('designWidth:'+designWidth);
            // Log.d('designHeight:'+designHeight);
            // Log.d('realWidth:'+realWidth);
            // Log.d('realHeight:'+realHeight);
            // Log.d('scaleForShowAll:'+scaleForShowAll);
            // // 2. 根据缩放值，重新设置节点的宽高
            this.width = realWidth * scaleForShowAll;
            this.height = realHeight * scaleForShowAll;
            // Log.d('width:' + this.width);
            // Log.d('height:' + this.height);
            // Log.d(`视图窗口可见区域分辨率: ${view.getVisibleSize().width} x ${view.getVisibleSize().height}`);
        }
    };
    __setFunctionName(_classThis, "AdapterRoot");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AdapterRoot = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdapterRoot = _classThis;
})();
