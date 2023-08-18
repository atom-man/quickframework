"use strict";
/**@description 游戏层公共基类 */
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
const UIView_1 = __importDefault(require("./UIView"));
/**
 * @description 游戏视图基类,处理了前后台切换对网络进行后台最大允许时间做统一处理,
 * 游戏层设置为ViewZOrder.zero
 */
const { ccclass, property, menu } = cc_1._decorator;
exports.default = (() => {
    let _classDecorators = [ccclass, menu("Quick公共组件/GameView")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GameView = _classThis = class extends UIView_1.default {
        constructor() {
            super(...arguments);
            this._logic = null;
        }
        get logic() {
            return this._logic;
        }
        /**@description 由管理器统一设置，请勿操作 */
        setLogic(logic) {
            this._logic = logic;
            if (logic) {
                logic.onLoad(this);
            }
        }
        onLoad() {
            super.onLoad();
            //进入场景完成，即onLoad最后一行  必须发进入完成事件
            this.onEnterGameView();
        }
        show(args) {
            super.show(args);
            App.entryManager.onShowGameView(this.bundle, this);
        }
        onEnterGameView() {
            App.entryManager.onEnterGameView(this.bundle, this);
        }
        /**
         * @description 进入指定Bundle
         * @param bundle Bundle名
         * @param userData 用户自定义数据
         */
        enterBundle(bundle, userData) {
            App.entryManager.enterBundle(bundle, userData);
        }
        /**
         * @description 返回上一场景
         * @param userData 用户自定义数据
         */
        backBundle(userData) {
            App.entryManager.backBundle(userData);
        }
        onDestroy() {
            if (this.audioHelper) {
                //停止背景音乐
                //this.audioHelper.stopMusic();
                this.audioHelper.stopAllEffects();
            }
            if (this.logic) {
                App.logicManager.destory(this.logic.bundle);
            }
            App.entryManager.onDestroyGameView(this.bundle, this);
            super.onDestroy();
        }
        update(dt) {
            if (this.logic) {
                this.logic.update(dt);
            }
        }
        /**@description 游戏重置 */
        reset() {
            if (this.logic) {
                this.logic.reset(this);
            }
        }
    };
    __setFunctionName(_classThis, "GameView");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        GameView = _classThis = _classDescriptor.value;
    })();
    _classThis.logicType = null;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GameView = _classThis;
})();
