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
exports.Adapter = void 0;
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
let Adapter = exports.Adapter = (() => {
    let _classDecorators = [ccclass('Adapter')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Adapter = _classThis = class extends cc_1.Component {
        constructor() {
            super(...arguments);
            this._func = null;
        }
        set width(value) {
            let trans = this.getComponent(cc_1.UITransform);
            if (!trans) {
                return;
            }
            trans.width = value;
        }
        get width() {
            let trans = this.getComponent(cc_1.UITransform);
            if (!trans) {
                return 0;
            }
            return trans.width;
        }
        set height(value) {
            let trans = this.getComponent(cc_1.UITransform);
            if (!trans) {
                return;
            }
            trans.height = value;
        }
        get height() {
            let trans = this.getComponent(cc_1.UITransform);
            if (!trans) {
                return 0;
            }
            return trans.height;
        }
        onLoad() {
            super.onLoad && super.onLoad();
            this.onChangeSize();
        }
        onEnable() {
            super.onEnable && super.onEnable();
            this.addEvents();
        }
        onDisable() {
            this.removeEvents();
            super.onDisable && super.onDisable();
        }
        onDestroy() {
            this.removeEvents();
            super.onDestroy && super.onDestroy();
        }
        addEvents() {
            if (this._func) {
                return;
            }
            this._func = this.onChangeSize.bind(this);
            window.addEventListener("resize", this._func);
            window.addEventListener("orientationchange", this._func);
        }
        removeEvents() {
            if (this._func) {
                window.removeEventListener("resize", this._func);
                window.removeEventListener("orientationchange", this._func);
            }
            this._func = null;
        }
        /**
         * @description 视图发生大小变化
         */
        onChangeSize() {
        }
    };
    __setFunctionName(_classThis, "Adapter");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        Adapter = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Adapter = _classThis;
})();
