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
exports.SpriteAlignType = exports.SpriteScaleType = void 0;
const cc_1 = require("cc");
const env_1 = require("cc/env");
const Adapter_1 = require("./Adapter");
const { ccclass, property, executeInEditMode, menu } = cc_1._decorator;
/**
 * 缩放方式
 */
var SpriteScaleType;
(function (SpriteScaleType) {
    /**
     * 缩放到填满父节点（如果父节点有裁剪，图像可能会被裁剪，节点可能会超出父节点）
     */
    SpriteScaleType[SpriteScaleType["FILL"] = 0] = "FILL";
    /**
     * 缩放到刚好在父节点内部最大化显示（图像会完整显示，但父节点上下或者左右可能会留空）
     */
    SpriteScaleType[SpriteScaleType["SUIT"] = 1] = "SUIT";
})(SpriteScaleType || (exports.SpriteScaleType = SpriteScaleType = {}));
/**
 * 对齐方式
 */
var SpriteAlignType;
(function (SpriteAlignType) {
    /**
     * 缩放后靠左对齐
     */
    SpriteAlignType[SpriteAlignType["LEFT"] = 0] = "LEFT";
    /**
     * 缩放后靠上对齐
     */
    SpriteAlignType[SpriteAlignType["TOP"] = 1] = "TOP";
    /**
     * 缩放后靠右对齐
     */
    SpriteAlignType[SpriteAlignType["RIGHT"] = 2] = "RIGHT";
    /**
     * 缩放后靠下对齐
     */
    SpriteAlignType[SpriteAlignType["BOTTOM"] = 3] = "BOTTOM";
    /**
     * 缩放后居中对齐
     */
    SpriteAlignType[SpriteAlignType["CENTER"] = 4] = "CENTER";
})(SpriteAlignType || (exports.SpriteAlignType = SpriteAlignType = {}));
exports.default = (() => {
    let _classDecorators = [ccclass, executeInEditMode(true), menu("Quick适配组件/AdapterSprite")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _get_scaleType_decorators;
    let _get_alignType_decorators;
    var AdapterSprite = _classThis = class extends Adapter_1.Adapter {
        constructor() {
            super(...arguments);
            this._scaleType = (__runInitializers(this, _instanceExtraInitializers), SpriteScaleType.SUIT);
            this._alignType = SpriteAlignType.CENTER;
            this._sprite = null;
        }
        get scaleType() {
            return this._scaleType;
        }
        set scaleType(value) {
            this._scaleType = value;
            if (env_1.EDITOR) {
                this.updateSprite(this._scaleType, this.alignType);
            }
        }
        get alignType() {
            return this._alignType;
        }
        set alignType(value) {
            this._alignType = value;
            if (env_1.EDITOR) {
                this.updateSprite(this._scaleType, this._alignType);
            }
        }
        onLoad() {
            this._sprite = this.node.getComponent(cc_1.Sprite);
        }
        start() {
            this.updateSprite(this.scaleType, this.alignType);
        }
        onChangeSize() {
            this.updateSprite(this.scaleType, this.alignType);
        }
        updateSprite(scaleType, alignType) {
            var _a;
            if (!this._sprite || !this._sprite.enabled || !this._sprite.spriteFrame) {
                return;
            }
            let widget = (_a = this.node.parent) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.Widget);
            if (widget) {
                widget.updateAlignment();
            }
            this.width = this._sprite.spriteFrame.rect.width;
            this.height = this._sprite.spriteFrame.rect.height;
            let trans = this.parentTrans;
            if (this.width / this.height > trans.width / trans.height) {
                // 设计分辨率宽高比大于显示分辨率
                if (scaleType == SpriteScaleType.SUIT) {
                    let scale = trans.width / this.width;
                    this.node.scale = (0, cc_1.v3)(scale, scale);
                }
                else if (scaleType == SpriteScaleType.FILL) {
                    let scale = trans.height / this.height;
                    this.node.scale = (0, cc_1.v3)(scale, scale);
                }
            }
            else {
                // 设计分辨率宽高比小于显示分辨率
                if (scaleType == SpriteScaleType.SUIT) {
                    let scale = trans.height / this.height;
                    this.node.scale = (0, cc_1.v3)(scale, scale);
                }
                else if (scaleType == SpriteScaleType.FILL) {
                    let scale = trans.width / this.width;
                    this.node.scale = (0, cc_1.v3)(scale, scale);
                }
            }
            switch (alignType) {
                case SpriteAlignType.CENTER:
                    this.node.setPosition((0, cc_1.v3)());
                    break;
                case SpriteAlignType.LEFT:
                    this.node.setPosition((0, cc_1.v3)(-0.5 * (trans.width - this.width * this.node.scale.x), 0));
                    break;
                case SpriteAlignType.RIGHT:
                    this.node.setPosition((0, cc_1.v3)(0.5 * (trans.width - this.width * this.node.scale.x), 0));
                    break;
                case SpriteAlignType.TOP:
                    this.node.setPosition((0, cc_1.v3)(0, 0.5 * (trans.height - this.height * this.node.scale.x)));
                    break;
                case SpriteAlignType.BOTTOM:
                    this.node.setPosition((0, cc_1.v3)(0, -0.5 * (trans.height - this.height * this.node.scale.x)));
                    break;
            }
        }
        get parentTrans() {
            var _a;
            return (_a = this.node.parent) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.UITransform);
        }
    };
    __setFunctionName(_classThis, "AdapterSprite");
    (() => {
        _get_scaleType_decorators = [property({
                type: (0, cc_1.Enum)(SpriteScaleType),
                tooltip: `缩放类型:
        -FILL: 缩放到填满父节点（如果父节点有裁剪，图像可能会被裁剪，节点可能会超出父节点）
        -SUIT: 缩放到刚好在父节点内部最大化显示（图像会完整显示，但父节点上下或者左右可能会留空）`,
            })];
        _get_alignType_decorators = [property({
                type: (0, cc_1.Enum)(SpriteAlignType),
                tooltip: `齐方式类型:
        -LEFT: 缩放后靠左对齐
        -TOP: 缩放后靠上对齐
        -RIGHT: 缩放后靠右对齐
        -BOTTOM: 缩放后靠下对齐
        -CENTER: 缩放后居中对齐`,
            })];
        __esDecorate(_classThis, null, _get_scaleType_decorators, { kind: "getter", name: "scaleType", static: false, private: false, access: { has: obj => "scaleType" in obj, get: obj => obj.scaleType } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_alignType_decorators, { kind: "getter", name: "alignType", static: false, private: false, access: { has: obj => "alignType" in obj, get: obj => obj.alignType } }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AdapterSprite = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdapterSprite = _classThis;
})();
