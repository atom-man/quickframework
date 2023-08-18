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
const EventComponent_1 = __importDefault(require("../../componects/EventComponent"));
const AudioComponent_1 = __importDefault(require("../../componects/AudioComponent"));
const cc_1 = require("cc");
const Macros_1 = require("../../defines/Macros");
/**
 * @description 视图基类
 */
const { ccclass, property, menu } = cc_1._decorator;
exports.default = (() => {
    let _classDecorators = [ccclass, menu("Quick公共组件/UIView")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UIView = _classThis = class extends EventComponent_1.default {
        constructor() {
            super(...arguments);
            /**本组件的类名 */
            this._className = "unknow";
            this._bundle = null;
            this._enabledKeyUp = false;
            this._enabledKeyDown = false;
            this.audioHelper = null;
            this._enterBackgroundTime = 0;
            this._enableFrontAndBackgroundSwitch = false;
        }
        /**
         *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer,如果是在主场景上的节点，使用Canvas:xx/xx
         */
        static getPrefabUrl() {
            Log.e(`请求实现public static getPrefabUrl`);
            return Macros_1.Macro.UNKNOWN;
        }
        /**@description 通过UI管理器打开时的传入ViewOption.args参数 */
        get args() {
            return this._args;
        }
        set args(args) {
            this._args = args;
        }
        set className(value) {
            this._className = value;
        }
        get className() {
            return this._className;
        }
        /**指向当前View打开时的bundle */
        set bundle(value) {
            this._bundle = value;
        }
        get bundle() {
            return this._bundle;
        }
        /**@description 关闭界面动画 */
        get closeAction() {
            return null;
        }
        close() {
            if (this.closeAction) {
                this.closeAction(() => {
                    App.uiManager.close(this.className);
                });
            }
            else {
                App.uiManager.close(this.className);
            }
        }
        get showAction() {
            return null;
        }
        /**@description args为open代入的参数 */
        show(args) {
            //再如果界面已经存在于界面管理器中，此时传入新的参数，只从show里面过来,这里重新对_args重新赋值
            this._args = args;
            if (this.node)
                this.node.active = true;
            if (this.showAction) {
                this.showAction(() => { });
            }
        }
        get hideAction() {
            return null;
        }
        hide() {
            if (this.hideAction) {
                this.hideAction(() => {
                    if (this.node)
                        this.node.removeFromParent();
                });
            }
            else {
                if (this.node)
                    this.node.removeFromParent();
            }
        }
        /**@description 是否启用键盘抬起事件 */
        get enabledKeyUp() {
            return this._enabledKeyUp;
        }
        set enabledKeyUp(value) {
            this._enabledKeyUp = value;
            if (value) {
                this.onI(cc_1.Input.EventType.KEY_UP, this.onKeyUp);
            }
            else {
                this.offI(cc_1.Input.EventType.KEY_UP, this.onKeyUp);
            }
        }
        /**@description 是否启用键盘按下事件 */
        get enabledKeyDown() {
            return this._enabledKeyUp;
        }
        set enabledKeyDown(value) {
            this._enabledKeyUp = value;
            if (value) {
                this.onI(cc_1.Input.EventType.KEY_DOWN, this.onKeyDown);
            }
            else {
                this.offI(cc_1.Input.EventType.KEY_DOWN, this.onKeyDown);
            }
        }
        onKeyUp(ev) {
            if (ev.keyCode == cc_1.macro.KEY.escape) {
                this.onKeyBackUp(ev);
            }
            else {
                ev.propagationStopped = true;
            }
        }
        onKeyDown(ev) {
            if (ev.keyCode == cc_1.macro.KEY.escape) {
                this.onKeyBackDown(ev);
            }
            else {
                ev.propagationStopped = true;
            }
        }
        onKeyBackUp(ev) {
            //只有一个接受，不再向上传播
            ev.propagationStopped = true;
        }
        onKeyBackDown(ev) {
            ev.propagationStopped = true;
        }
        onLoad() {
            this.audioHelper = (this.addComponent(AudioComponent_1.default));
            this.audioHelper.owner = this;
            super.onLoad();
        }
        set enableFrontAndBackgroundSwitch(value) {
            this._enableFrontAndBackgroundSwitch = value;
            if (value) {
                this.onG(cc_1.Game.EVENT_SHOW, this._onEnterForgeGround);
                this.onG(cc_1.Game.EVENT_HIDE, this._onEnterBackground);
            }
            else {
                this.offG(cc_1.Game.EVENT_SHOW, this._onEnterForgeGround);
                this.offG(cc_1.Game.EVENT_HIDE, this._onEnterBackground);
            }
        }
        get enableFrontAndBackgroundSwitch() {
            return this._enableFrontAndBackgroundSwitch;
        }
        _onEnterBackground() {
            this._enterBackgroundTime = Date.timeNow();
            this.onEnterBackground();
        }
        _onEnterForgeGround() {
            let now = Date.timeNow();
            let inBackgroundTime = now - this._enterBackgroundTime;
            this.onEnterForgeground(inBackgroundTime);
        }
        onEnterForgeground(inBackgroundTime) {
        }
        onEnterBackground() {
        }
    };
    __setFunctionName(_classThis, "UIView");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        UIView = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UIView = _classThis;
})();
