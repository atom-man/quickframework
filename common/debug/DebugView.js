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
exports.DebugView = void 0;
const cc_1 = require("cc");
const EventComponent_1 = __importDefault(require("../../framework/componects/EventComponent"));
const Decorators_1 = require("../../framework/defines/Decorators");
const Enums_1 = require("../../framework/defines/Enums");
const Singleton_1 = require("../../framework/utils/Singleton");
const Config_1 = require("../config/Config");
const { ccclass, property } = cc_1._decorator;
let DebugView = exports.DebugView = (() => {
    let _classDecorators = [ccclass('DebugView')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _logView_decorators;
    let _logView_initializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _background_decorators;
    let _background_initializers = [];
    let _logViewBackground_decorators;
    let _logViewBackground_initializers = [];
    var DebugView = _classThis = class extends EventComponent_1.default {
        constructor() {
            super(...arguments);
            this.logView = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _logView_initializers, null));
            this.content = __runInitializers(this, _content_initializers, null);
            this.background = __runInitializers(this, _background_initializers, null);
            this.logViewBackground = __runInitializers(this, _logViewBackground_initializers, null);
            this.debug = null;
        }
        onLoad() {
            //显示界面信息
            this.bindEvent("showUI", this.onShowUI);
            //显示节点信息
            this.bindEvent("showNode", this.onShowNode);
            //显示资源缓存信息
            this.bindEvent("showRes", this.onShowRes);
            //显示当前组件信息
            this.bindEvent("showComponent", this.onShowComp);
            //显示调试信息
            this.bindEvent("showDebugInfo", this.onShowDebugInfo);
            this.bindEvent("log", this.onLog);
            //逻辑管理器信息输出
            this.bindEvent("logic", this.onLogicManager);
            //数据中心
            this.bindEvent("dataCenter", this.onDataCenter);
            //bundle入口管理器
            this.bindEvent("entry", this.onEntry);
            //proto 信息输出 
            this.bindEvent("proto", this.onProto);
            //bundle管理器
            this.bindEvent("bundleMgr", this.onBundleMgr);
            //节点缓存池
            this.bindEvent("pool", this.onPool);
            //Senders
            this.bindEvent("sender", this.onSender);
            this.bindEvent("handler", this.onHandler);
            //网络管理器
            this.bindEvent("serviceManager", this.onServiceManager);
            //热火更新管理
            this.bindEvent("hotupdate", this.onHotUpdate);
            //内存警告
            this.bindEvent("lowMemory", this.onLowMemory);
            //释放管理器
            this.bindEvent("releaseManager", this.onReleaseManager);
            //适配器
            this.bindEvent("adaptor", this.onAdaptor);
            //当前所有单例
            this.bindEvent("singleton", this.onSingleton);
            this.doOther();
        }
        doOther() {
            if (this.logView) {
                this.logView.active = false;
                this.initLogView();
            }
            this.onN(this.background, cc_1.Input.EventType.TOUCH_END, () => {
                this.node.active = false;
                if (this.debug)
                    this.debug.active = true;
            });
        }
        bindEvent(path, cb) {
            let node = (0, cc_1.find)(path, this.content);
            this.onN(node, cc_1.Input.EventType.TOUCH_END, cb);
        }
        initLogView() {
            this.onN(this.logViewBackground, cc_1.Input.EventType.TOUCH_END, () => {
                this.logView.active = false;
            });
            let level = (0, cc_1.find)("level", this.logView);
            if (level) {
                for (let i = 0; i < level.children.length - 1; i++) {
                    let node = (0, cc_1.find)(`type${i}`, level);
                    if (node) {
                        let toggle = node.getComponent(cc_1.Toggle);
                        if (toggle) {
                            toggle.isChecked = App.logger.isValid(this.getLogLevel(i));
                        }
                        this.onN(node, "toggle", (toggle) => {
                            if (toggle.isChecked) {
                                App.logger.attach(this.getLogLevel(i));
                            }
                            else {
                                App.logger.detach(this.getLogLevel(i));
                            }
                        });
                    }
                }
            }
        }
        getLogLevel(index) {
            switch (index) {
                case 0: return Enums_1.LogLevel.DEBUG;
                case 1: return Enums_1.LogLevel.WARN;
                case 2: return Enums_1.LogLevel.ERROR;
                case 3: return Enums_1.LogLevel.DUMP;
                default: return Enums_1.LogLevel.DEBUG;
            }
        }
        onLogicManager() {
            App.logicManager.debug();
        }
        onDataCenter() {
            App.dataCenter.debug();
        }
        onEntry() {
            App.entryManager.debug();
        }
        onProto() {
            App.protoManager.debug();
        }
        onBundleMgr() {
            App.bundleManager.debug();
        }
        onPool() {
            App.pool.debug();
        }
        onLog() {
            this.logView.active = true;
        }
        onShowDebugInfo() {
            if (cc_1.profiler.isShowingStats()) {
                cc_1.profiler.hideStats();
            }
            else {
                cc_1.profiler.showStats();
            }
            App.storage.setItem(Config_1.Config.SHOW_DEBUG_INFO_KEY, cc_1.profiler.isShowingStats());
        }
        onShowUI() {
            App.uiManager.debug({ showViews: true });
        }
        onShowNode() {
            App.uiManager.debug({ showChildren: true });
        }
        onShowRes() {
            App.cache.debug();
        }
        onShowComp() {
            App.uiManager.debug({ showComp: true });
        }
        onSender() {
            App.senderManager.debug();
        }
        onHandler() {
            App.handlerManager.debug();
        }
        onServiceManager() {
            App.serviceManager.debug();
        }
        onHotUpdate() {
            App.updateManager.debug();
        }
        onLowMemory() {
            App.onLowMemory();
        }
        onReleaseManager() {
            App.releaseManger.debug();
        }
        onAdaptor() {
            Log.d(`-----------------------------适配信息-----------------------------------------------`);
            Log.d(`屏幕分辨率: ${cc_1.screen.windowSize.width} x ${cc_1.screen.windowSize.height}`);
            Log.d(`视图窗口可见区域分辨率: ${cc_1.view.getVisibleSize().width} x ${cc_1.view.getVisibleSize().height}`);
            Log.d(`视图中边框尺寸: ${cc_1.screen.windowSize.width} x ${cc_1.screen.windowSize.height}`);
            Log.d(`设备或浏览器像素比例: ${cc_1.screen.devicePixelRatio}`);
            Log.d(`返回视图窗口可见区域像素尺寸: ${cc_1.view.getVisibleSizeInPixel().width} x ${cc_1.view.getVisibleSizeInPixel().height}`);
            Log.d(`当前场景设计分辨率: ${cc_1.view.getDesignResolutionSize().width} x ${cc_1.view.getDesignResolutionSize().height}`);
            let viewRate = cc_1.screen.windowSize.width / cc_1.screen.windowSize.height;
            let designRate = cc_1.view.getDesignResolutionSize().width / cc_1.view.getDesignResolutionSize().height;
            Log.d(`视图宽高比:${viewRate}`);
            Log.d(`设置分辨率宽高比:${designRate}`);
        }
        onSingleton() {
            Singleton_1.Singleton.debug();
        }
    };
    __setFunctionName(_classThis, "DebugView");
    (() => {
        _logView_decorators = [(0, Decorators_1.inject)("logView", cc_1.Node)];
        _content_decorators = [(0, Decorators_1.inject)("content", cc_1.Node)];
        _background_decorators = [(0, Decorators_1.inject)("background", cc_1.Node)];
        _logViewBackground_decorators = [(0, Decorators_1.inject)("background", cc_1.Node, "logView")];
        __esDecorate(null, null, _logView_decorators, { kind: "field", name: "logView", static: false, private: false, access: { has: obj => "logView" in obj, get: obj => obj.logView, set: (obj, value) => { obj.logView = value; } } }, _logView_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } } }, _content_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _background_decorators, { kind: "field", name: "background", static: false, private: false, access: { has: obj => "background" in obj, get: obj => obj.background, set: (obj, value) => { obj.background = value; } } }, _background_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _logViewBackground_decorators, { kind: "field", name: "logViewBackground", static: false, private: false, access: { has: obj => "logViewBackground" in obj, get: obj => obj.logViewBackground, set: (obj, value) => { obj.logViewBackground = value; } } }, _logViewBackground_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DebugView = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DebugView = _classThis;
})();
