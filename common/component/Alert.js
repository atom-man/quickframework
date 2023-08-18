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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const EventComponent_1 = __importDefault(require("../../framework/componects/EventComponent"));
const Decorators_1 = require("../../framework/defines/Decorators");
const Config_1 = require("../config/Config");
let AlertDialog = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let __closeBtn_decorators;
    let __closeBtn_initializers = [];
    let __content_decorators;
    let __content_initializers = [];
    let __textContent_decorators;
    let __textContent_initializers = [];
    let __richTextContent_decorators;
    let __richTextContent_initializers = [];
    let __title_decorators;
    let __title_initializers = [];
    let __confirm_decorators;
    let __confirm_initializers = [];
    let __cancel_decorators;
    let __cancel_initializers = [];
    return _a = class AlertDialog extends EventComponent_1.default {
            constructor() {
                super(...arguments);
                /**@description 关闭按钮 */
                this._closeBtn = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __closeBtn_initializers, null));
                /**@description 显示内容 */
                this._content = __runInitializers(this, __content_initializers, null);
                /**@description 常规显示文字 */
                this._textContent = __runInitializers(this, __textContent_initializers, null);
                /**@description 富文本显示文字 */
                this._richTextContent = __runInitializers(this, __richTextContent_initializers, null);
                /**@description 标题 */
                this._title = __runInitializers(this, __title_initializers, null);
                /**@description 确定按钮 */
                this._confirm = __runInitializers(this, __confirm_initializers, null);
                /**@description 取消按钮 */
                this._cancel = __runInitializers(this, __cancel_initializers, null);
                /**@description 配置信息 */
                this._config = null;
            }
            get config() {
                return this._config;
            }
            show(config) {
                if (!config.title) {
                    config.title = App.getLanguage("alert_title");
                }
                if (!config.confirmString) {
                    config.confirmString = App.getLanguage("alert_confirm");
                }
                if (!config.cancelString) {
                    config.cancelString = App.getLanguage("alert_cancel");
                }
                this._config = config;
                this.writeContent(config);
                this.showButton(config);
                this._show();
            }
            _show() {
                if (this._content) {
                    (0, cc_1.tween)(this._content)
                        .set({ scale: new cc_1.Vec3(0.2, 0.2, 0.2) })
                        .to(0.2, { scale: new cc_1.Vec3(1.1, 1.1, 1.1) })
                        .delay(0.05)
                        .to(0.1, { scale: new cc_1.Vec3(1.0, 1, 1) })
                        .start();
                }
            }
            /**@description 写入提示文字 */
            writeContent(config) {
                //写内容,
                if (config.richText) {
                    this._textContent.node.active = false;
                    this._richTextContent.node.active = true;
                    this._richTextContent.string = config.richText;
                }
                else {
                    this._textContent.node.active = true;
                    this._richTextContent.node.active = false;
                    if (config.text) {
                        this._textContent.string = config.text;
                    }
                    else {
                        Log.e("请指定提示内容");
                        this._textContent.string = "";
                    }
                }
                //写标题
                if (config.title) {
                    this._title.string = config.title;
                }
                //写按钮
                if (config.confirmString) {
                    let title = (0, cc_1.find)("Label", this._confirm);
                    if (title) {
                        let lb = title.getComponent(cc_1.Label);
                        if (lb)
                            lb.string = config.confirmString;
                    }
                }
                if (config.cancelString) {
                    let title = (0, cc_1.find)("Label", this._cancel);
                    if (title) {
                        let lb = title.getComponent(cc_1.Label);
                        if (lb)
                            lb.string = config.cancelString;
                    }
                }
            }
            /**@description 显示按钮 */
            showButton(config) {
                if (this._confirm && this._cancel && this._closeBtn) {
                    //关闭按钮
                    this.onN(this._closeBtn, cc_1.Input.EventType.TOUCH_END, this.close.bind(this));
                    //确定按钮
                    if (config.confirmCb) {
                        this._confirm.active = true;
                        this.onN(this._confirm, cc_1.Input.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, true));
                        this.onN(this._closeBtn, cc_1.Input.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, false));
                    }
                    else {
                        this._confirm.active = false;
                    }
                    //取消按钮
                    if (config.cancelCb) {
                        this._cancel.active = true;
                        this.onN(this._cancel, cc_1.Input.EventType.TOUCH_END, this.onClick.bind(this, config.cancelCb, false));
                    }
                    else {
                        this._cancel.active = false;
                    }
                    if (this._confirm.active) {
                        //确定按钮有显示
                        if (this._cancel.active) {
                            //两个按钮都显示，
                        }
                        else {
                            //只有显示确定
                            this._confirm.setPosition(new cc_1.Vec3(0, this._confirm.position.y, this._confirm.position.z));
                        }
                    }
                    else {
                        //确定按钮没有显示
                        if (this._cancel.active) {
                            //只有一个取消按钮
                            this._confirm.setPosition(new cc_1.Vec3(0, this._confirm.position.y, this._confirm.position.z));
                        }
                        else {
                            //无按钮显示，输入警告
                            Log.w("提示框无按钮显示");
                        }
                    }
                }
            }
            /**@description 关闭 */
            close() {
                this._close(null);
            }
            _close(complete) {
                if ((0, cc_1.isValid)(this._content)) {
                    // this._content.stopAllActions();
                    (0, cc_1.tween)(this._content)
                        .to(0.2, { scale: new cc_1.Vec3(1.15, 1.15, 1.15) })
                        .to(0.1, { scale: new cc_1.Vec3(0.3, 0.3, 0.3) })
                        .call(() => {
                        App.alert.finishAlert();
                        if (complete)
                            complete();
                    })
                        .start();
                }
            }
            onClick(cb, isOk) {
                if (this._config.immediatelyCallback) {
                    if (cb)
                        cb(isOk);
                    this._close(null);
                }
                else {
                    this._close(() => {
                        if (cb)
                            cb(isOk);
                    });
                }
            }
        },
        (() => {
            __closeBtn_decorators = [(0, Decorators_1.inject)("close", cc_1.Node, "content")];
            __content_decorators = [(0, Decorators_1.inject)("content", cc_1.Node)];
            __textContent_decorators = [(0, Decorators_1.inject)("content", cc_1.Label, "content")];
            __richTextContent_decorators = [(0, Decorators_1.inject)("richContent", cc_1.RichText, "content")];
            __title_decorators = [(0, Decorators_1.inject)("title", cc_1.Label, "content")];
            __confirm_decorators = [(0, Decorators_1.inject)("confirm", cc_1.Node, "content")];
            __cancel_decorators = [(0, Decorators_1.inject)("cancel", cc_1.Node, "content")];
            __esDecorate(null, null, __closeBtn_decorators, { kind: "field", name: "_closeBtn", static: false, private: false, access: { has: obj => "_closeBtn" in obj, get: obj => obj._closeBtn, set: (obj, value) => { obj._closeBtn = value; } } }, __closeBtn_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, __content_decorators, { kind: "field", name: "_content", static: false, private: false, access: { has: obj => "_content" in obj, get: obj => obj._content, set: (obj, value) => { obj._content = value; } } }, __content_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, __textContent_decorators, { kind: "field", name: "_textContent", static: false, private: false, access: { has: obj => "_textContent" in obj, get: obj => obj._textContent, set: (obj, value) => { obj._textContent = value; } } }, __textContent_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, __richTextContent_decorators, { kind: "field", name: "_richTextContent", static: false, private: false, access: { has: obj => "_richTextContent" in obj, get: obj => obj._richTextContent, set: (obj, value) => { obj._richTextContent = value; } } }, __richTextContent_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, __title_decorators, { kind: "field", name: "_title", static: false, private: false, access: { has: obj => "_title" in obj, get: obj => obj._title, set: (obj, value) => { obj._title = value; } } }, __title_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, __confirm_decorators, { kind: "field", name: "_confirm", static: false, private: false, access: { has: obj => "_confirm" in obj, get: obj => obj._confirm, set: (obj, value) => { obj._confirm = value; } } }, __confirm_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, __cancel_decorators, { kind: "field", name: "_cancel", static: false, private: false, access: { has: obj => "_cancel" in obj, get: obj => obj._cancel, set: (obj, value) => { obj._cancel = value; } } }, __cancel_initializers, _instanceExtraInitializers);
        })(),
        _a;
})();
class Alert {
    constructor() {
        this.module = null;
        this.isResident = true;
        this.curPanel = null;
        this.queue = [];
    }
    getConfig(config) {
        let result = {};
        if (config.tag) {
            result.tag = config.tag;
        }
        if (config.text) {
            result.text = config.text;
        }
        if (config.title) {
            result.title = config.title;
        }
        if (config.confirmString) {
            result.confirmString = config.confirmString;
        }
        if (config.cancelString) {
            result.cancelString = config.cancelString;
        }
        if (config.richText) {
            result.richText = config.richText;
        }
        if (config.immediatelyCallback) {
            result.immediatelyCallback = config.immediatelyCallback;
        }
        if (config.isRepeat) {
            result.isRepeat = config.isRepeat;
        }
        return result;
    }
    /**
     * @description 显示弹出框
     * @param config 配置信息
     */
    show(config) {
        if (config.tag && config.isRepeat === false) {
            if (this.isRepeat(config.tag)) {
                Log.w(`弹出框已经存在 config : ${JSON.stringify(this.getConfig(config))}`);
                return false;
            }
        }
        this.queue.push(config);
        this._show(config);
        return true;
    }
    /**@description 当前显示的弹出框是否是tag */
    isCurrentShow(tag) {
        var _a;
        if (this.curPanel) {
            let current = (_a = this.curPanel.getComponent(AlertDialog)) === null || _a === void 0 ? void 0 : _a.config;
            if (current && current.tag == tag) {
                return true;
            }
        }
        return false;
    }
    /**@description 获取当前显示弹出的配置 */
    currentShow(tag) {
        var _a;
        if (this.curPanel) {
            let current = (_a = this.curPanel.getComponent(AlertDialog)) === null || _a === void 0 ? void 0 : _a.config;
            if (tag && current && current.tag == tag) {
                return current;
            }
            else {
                return current;
            }
        }
        return null;
    }
    /**@description 是否有该类型的弹出框 */
    isRepeat(tag) {
        var _a;
        if (this.curPanel) {
            let current = (_a = this.curPanel.getComponent(AlertDialog)) === null || _a === void 0 ? void 0 : _a.config;
            if (current && current.tag == tag) {
                Log.w(`重复的弹出框 config ; ${JSON.stringify(this.getConfig(current))}`);
                return true;
            }
        }
        else {
            for (let i = 0; i < this.queue.length; i++) {
                let data = this.queue[i];
                if (data.tag == tag) {
                    Log.w(`重复的弹出框 config ; ${JSON.stringify(this.getConfig(data))}`);
                    return true;
                }
            }
        }
        return false;
    }
    /**@description 关闭当前显示的
     * @param tag 可不传，关闭当前的弹出框，否则关闭指定tag的弹出框
     */
    close(tag) {
        var _a;
        if (tag) {
            let j = this.queue.length;
            while (j--) {
                if (this.queue[j].tag == tag) {
                    this.queue.splice(j, 1);
                }
            }
            if (this.curPanel) {
                let current = (_a = this.curPanel.getComponent(AlertDialog)) === null || _a === void 0 ? void 0 : _a.config;
                if (current && current.tag == tag) {
                    this.finishAlert();
                }
            }
        }
        else {
            this.finishAlert();
        }
    }
    closeAll() {
        this.queue = [];
        this.finishAlert();
    }
    finishAlert() {
        if (this.curPanel) {
            this.curPanel.destroy();
            this.curPanel = null;
        }
        let config = this.queue.shift();
        if (this.queue.length != 0) {
            this._show(this.queue[0]);
            return this.queue[0];
        }
        return config;
    }
    _show(config) {
        if (!this.curPanel) {
            this.curPanel = (0, cc_1.instantiate)(App.uiManager.getScenePrefab("Alert"));
            let dialog = this.curPanel.addComponent(AlertDialog);
            App.uiManager.addView(this.curPanel, Config_1.ViewZOrder.Alert);
            dialog.show(config);
        }
    }
}
Alert.module = "【Alert】";
exports.default = Alert;
