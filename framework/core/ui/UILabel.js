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
/**
 * @description 支持多语言
 */
const { ccclass, property, menu } = cc_1._decorator;
const Bundles = (0, cc_1.Enum)(App.Bundles);
exports.default = (() => {
    let _classDecorators = [ccclass, menu("Quick渲染组件/UILabel")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let __lan_decorators;
    let __lan_initializers = [];
    let __bundle_decorators;
    let __bundle_initializers = [];
    let __params_decorators;
    let __params_initializers = [];
    let __mult_decorators;
    let __mult_initializers = [];
    let _get_bundle_decorators;
    let _get_language_decorators;
    let _get_params_decorators;
    let _get_isUseMultilingual_decorators;
    var UILabel = _classThis = class extends cc_1.Label {
        constructor() {
            super(...arguments);
            /**@description 多谗言包 */
            this._lan = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __lan_initializers, ""));
            /**@description 语言包所在bundle */
            this._bundle = __runInitializers(this, __bundle_initializers, Bundles.resources);
            this._params = __runInitializers(this, __params_initializers, []);
            /**@description 是否是脏数据 */
            this._isDirty = true;
            /**@description 是否启用多语言 */
            this._mult = __runInitializers(this, __mult_initializers, true);
        }
        /**
         * @description 语言包所在bundle
         */
        get bundle() {
            return this._bundle;
        }
        set bundle(v) {
            if (this._bundle == v) {
                return;
            }
            this._bundle = v;
            this._isDirty = true;
        }
        /**
         * @description 设置语言包Key
         * 如果语言包在Bundle内，请先用injectLanguageData装饰语言包数据代理类
         * 注意，语言包只有在编辑器模式下会加入语言包数据代理，运行实需要自己添加
         * 假设resources语言包为
         * @example 示例
         * export let i18n = {
         * language : cc.sys.LANGUAGE_CHINESE,
         *      tips : "您好",
         *      test : "测试 : {0}-->{1}-->{2}"
         * }
         * node.getComponent(cc.Label).language = "tips"; //string显示为：您好
         * */
        get language() {
            return this._lan;
        }
        set language(v) {
            if (this.language == v) {
                return;
            }
            this._lan = v;
            this._isDirty = true;
        }
        /**
         * @description 附加参数 假设resources语言包为
         * @example 示例
         * export let i18n = {
         * language : cc.sys.LANGUAGE_CHINESE,
         *      tips : "您好",
         *      test : "测试 : {0}-->{1}-->{2}"
         * }
         * node.getComponent(cc.Label).language = "tips"; //string显示为：您好
         * node.getComponent(cc.Label).language = "test"; //string显示为：您好
         * node.getComponent(cc.Label).params = [100,200,300]; //string显示为：测试 : 100-->200-->300
         */
        get params() {
            return this._params;
        }
        set params(v) {
            this._params = v;
            this._isDirty = true;
        }
        get isUseMultilingual() {
            return this._mult;
        }
        set isUseMultilingual(v) {
            if (v == this._mult) {
                return;
            }
            this._mult = v;
            this._isDirty = true;
        }
        onLoad() {
            super.onLoad();
            App.language.add(this);
            this.update(0);
        }
        onDestroy() {
            App.language.remove(this);
            super.onDestroy();
        }
        update(dt) {
            if (super.update) {
                super.update(dt);
            }
            if (this._isDirty) {
                this.forceDoLayout();
                this._isDirty = false;
            }
        }
        forceDoLayout() {
            if (this.isUseMultilingual) {
                let bundle = this.bundle;
                let realBundle = Bundles[bundle];
                let str = App.getLanguage(this.language, this.params, realBundle);
                this.string = str;
            }
            super.forceDoLayout();
        }
    };
    __setFunctionName(_classThis, "UILabel");
    (() => {
        __lan_decorators = [property];
        __bundle_decorators = [property];
        __params_decorators = [property];
        __mult_decorators = [property];
        _get_bundle_decorators = [property({ displayName: "语言包所在Bundle", type: Bundles, "tooltip": "语言包所在bundle" })];
        _get_language_decorators = [property({ displayName: "语言包Key", tooltip: "所在Bundle中语言包的key,如果语言包在Bundle内，请先用injectLanguageData装饰语言包数据代理类" })];
        _get_params_decorators = [property({ displayName: "语言包附加参数", tooltip: "附加参数，如果语言包中有 xx{0}{1},有两个占位的参数需要替换", type: cc_1.CCString })];
        _get_isUseMultilingual_decorators = [property({ displayName: "是否启用多语言", tooltip: "是否启用多语言,默认为启用" })];
        __esDecorate(_classThis, null, _get_bundle_decorators, { kind: "getter", name: "bundle", static: false, private: false, access: { has: obj => "bundle" in obj, get: obj => obj.bundle } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_language_decorators, { kind: "getter", name: "language", static: false, private: false, access: { has: obj => "language" in obj, get: obj => obj.language } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_params_decorators, { kind: "getter", name: "params", static: false, private: false, access: { has: obj => "params" in obj, get: obj => obj.params } }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_isUseMultilingual_decorators, { kind: "getter", name: "isUseMultilingual", static: false, private: false, access: { has: obj => "isUseMultilingual" in obj, get: obj => obj.isUseMultilingual } }, null, _instanceExtraInitializers);
        __esDecorate(null, null, __lan_decorators, { kind: "field", name: "_lan", static: false, private: false, access: { has: obj => "_lan" in obj, get: obj => obj._lan, set: (obj, value) => { obj._lan = value; } } }, __lan_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, __bundle_decorators, { kind: "field", name: "_bundle", static: false, private: false, access: { has: obj => "_bundle" in obj, get: obj => obj._bundle, set: (obj, value) => { obj._bundle = value; } } }, __bundle_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, __params_decorators, { kind: "field", name: "_params", static: false, private: false, access: { has: obj => "_params" in obj, get: obj => obj._params, set: (obj, value) => { obj._params = value; } } }, __params_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, __mult_decorators, { kind: "field", name: "_mult", static: false, private: false, access: { has: obj => "_mult" in obj, get: obj => obj._mult, set: (obj, value) => { obj._mult = value; } } }, __mult_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        UILabel = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UILabel = _classThis;
})();
