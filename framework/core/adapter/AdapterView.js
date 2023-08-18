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
const env_1 = require("cc/env");
const Adapter_1 = require("./Adapter");
const { ccclass, property, executeInEditMode, menu } = cc_1._decorator;
exports.default = (() => {
    let _classDecorators = [ccclass, executeInEditMode(true), menu("Quick适配组件/AdapterView")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdapterView = _classThis = class extends Adapter_1.Adapter {
        onChangeSize() {
            AdapterView.safeArea = null;
            if (this.node) {
                // 将屏幕尺寸下的安全区域大小，转换为设计分辨率下的大小，重新给节点设置大小
                this.width = AdapterView.safeArea.safeAreaWidth / AdapterView.safeArea.designPxToScreenPxRatio;
                this.height = AdapterView.safeArea.safeAreaHeight / AdapterView.safeArea.designPxToScreenPxRatio;
                // 根据安全区域的 margin 设置节点的偏移，使重置宽高后的节点位置在安全中心
                // 需要将屏幕尺寸下的像素值转换为设计费分辨率下的像素值
                this.node.setPosition((0, cc_1.v3)(AdapterView.safeArea.safeAreaXOffset / AdapterView.safeArea.designPxToScreenPxRatio, AdapterView.safeArea.safeAreaYOffset / AdapterView.safeArea.designPxToScreenPxRatio));
            }
        }
        static set safeArea(value) {
            this._safeArea = value;
        }
        /**
         * 基于屏幕尺寸的安全区域
         *
         * 可以通过 screenPxToDesignPx 转换为基于设计画布尺寸的像素大小
         */
        static get safeArea() {
            if (this._safeArea == null || this._safeArea == undefined) {
                // 初始屏幕宽高像素
                let screenWidth = cc_1.screen.windowSize.width;
                let screenHeight = cc_1.screen.windowSize.height;
                if (env_1.EDITOR) {
                    screenWidth = cc_1.view.getDesignResolutionSize().width;
                    screenHeight = cc_1.view.getDesignResolutionSize().height;
                }
                // 安全区域距离屏幕边缘的距离像素
                let safeAreaMarginTop = 0;
                let safeAreaMarginBottom = 0;
                let safeAreaMarginLeft = 0;
                let safeAreaMarginRight = 0;
                // 「设计分辨率」像素值转换到 「屏幕分辨率」 下的像素比
                let designWidth = cc_1.view.getVisibleSize().width;
                let designHeight = cc_1.view.getVisibleSize().height;
                let designPxToScreenPxRatio = Math.min(screenWidth / designWidth, screenHeight / designHeight);
                if (env_1.JSB) {
                    // 设计分辨率下的安全区域大小
                    let safeAreaRectInDesignPx = cc_1.sys.getSafeAreaRect();
                    // 求出设计分辨率下，屏幕宽高
                    let screenWidthToDesgignWidth = screenWidth / designPxToScreenPxRatio;
                    let screenHeightToDesignHeight = screenHeight / designPxToScreenPxRatio;
                    // 求出设计分辨率下的安全区域的位置（相对于 Cocos 坐标系，X轴正方向往右，Y轴正方向往上）
                    let safeAreaRectLeftBottomXInDesign = -designWidth * 0.5 + safeAreaRectInDesignPx.x;
                    let safeAreaRectLeftBottomYInDesign = -designHeight * 0.5 + safeAreaRectInDesignPx.y;
                    let safeAreaRectWidthInDesign = safeAreaRectInDesignPx.width;
                    let safeAreaRectHeightInDesign = safeAreaRectInDesignPx.height;
                    // 求出安全区域在设计分辨率下的margin值
                    let safeAreaMarginTopInDesign = screenHeightToDesignHeight * 0.5 - (safeAreaRectLeftBottomYInDesign + safeAreaRectHeightInDesign);
                    let safeAreaMarginBottomInDesign = Math.abs(-screenHeightToDesignHeight * 0.5 - safeAreaRectLeftBottomYInDesign);
                    let safeAreaMarginLeftInDesign = Math.abs(-screenWidthToDesgignWidth * 0.5 - safeAreaRectLeftBottomXInDesign);
                    let safeAreaMarginRightInDesign = screenWidthToDesgignWidth * 0.5 - (safeAreaRectLeftBottomXInDesign + safeAreaRectWidthInDesign);
                    // 求出安全区域在屏幕分辨率下的margin值
                    safeAreaMarginTop = safeAreaMarginTopInDesign * designPxToScreenPxRatio;
                    safeAreaMarginBottom = safeAreaMarginBottomInDesign * designPxToScreenPxRatio;
                    safeAreaMarginLeft = safeAreaMarginLeftInDesign * designPxToScreenPxRatio;
                    safeAreaMarginRight = safeAreaMarginRightInDesign * designPxToScreenPxRatio;
                }
                // // 微信平台 安全区域
                // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                //     try {
                //         if (wx.getSystemInfoSync) {
                //             let res = wx.getSystemInfoSync();
                //             if (res) {
                //                 screenWidth = res.screenWidth * res.pixelRatio;
                //                 screenHeight = res.screenHeight * res.pixelRatio;
                //                 let safeArea = res.safeArea;
                //                 if (safeArea) {
                //                     safeAreaMarginTop = safeArea.top * res.pixelRatio;
                //                     safeAreaMarginBottom = screenHeight - safeArea.bottom * res.pixelRatio;
                //                     safeAreaMarginLeft = safeArea.left * res.pixelRatio;
                //                     safeAreaMarginRight = screenWidth - safeArea.right * res.pixelRatio;
                //                 }
                //             }
                //         }
                //     } catch (error) {
                //         if (CC_DEBUG) {
                //             cc.error("获取微信安全区域失败", error);
                //         }
                //     }
                // }
                // 调试模式下模拟安全区域
                // if (DEBUG) {
                //     safeAreaMarginTop = 0;
                //     safeAreaMarginBottom = 50;
                //     safeAreaMarginLeft = 0;
                //     safeAreaMarginRight = 0;
                // }
                // 计算安全区域的宽高像素
                let safeAreaWidth = screenWidth - safeAreaMarginLeft - safeAreaMarginRight;
                let safeAreaHeight = screenHeight - safeAreaMarginTop - safeAreaMarginBottom;
                // 计算安全区域 X、Y 偏移像素（相对于 Cocos 坐标系，X轴正方向往右，Y轴正方向往上）
                let safeAreaXOffset = (safeAreaMarginLeft - safeAreaMarginRight) * 0.5;
                let safeAreaYOffset = (safeAreaMarginBottom - safeAreaMarginTop) * 0.5;
                this._safeArea = {
                    screenWidth: screenWidth,
                    screenHeight: screenHeight,
                    safeAreaWidth: safeAreaWidth,
                    safeAreaHeight: safeAreaHeight,
                    safeAreaMarginTop: safeAreaMarginTop,
                    safeAreaMarginBottom: safeAreaMarginBottom,
                    safeAreaMarginLeft: safeAreaMarginLeft,
                    safeAreaMarginRight: safeAreaMarginRight,
                    safeAreaXOffset: safeAreaXOffset,
                    safeAreaYOffset: safeAreaYOffset,
                    designPxToScreenPxRatio: designPxToScreenPxRatio,
                };
            }
            return this._safeArea;
        }
        static screenPxToDesignPx(screenPx) {
            return screenPx / this.safeArea.designPxToScreenPxRatio;
        }
        static designPxToScreenPx(designPx) {
            return designPx * this.safeArea.designPxToScreenPxRatio;
        }
    };
    __setFunctionName(_classThis, "AdapterView");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AdapterView = _classThis = _classDescriptor.value;
    })();
    _classThis._safeArea = null;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdapterView = _classThis;
})();
