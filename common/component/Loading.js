"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const Config_1 = require("../config/Config");
/**
 * @description 加载动画
 */
class Loading {
    constructor() {
        this.module = null;
        this.isResident = true;
        /**@description 当前loading节点 */
        this.node = null;
        /**@description 显示的Loading提示内容 */
        this._content = [];
        this._showContentIndex = 0;
        /**@description 超时回调定时器id */
        this._timerId = -1;
        /**@description 显示的提示 */
        this.text = null;
    }
    get prefab() {
        return App.uiManager.getScenePrefab("Loading");
    }
    /**@description 显示超时回调 */
    set timeOutCb(value) {
        this._timeOutCb = value;
    }
    get timeOutCb() {
        return this._timeOutCb;
    }
    /**
     * @description 显示Loading
     * @param content 提示内容
     * @param timeOutCb 超时回调
     * @param timeout 显示超时时间
     */
    show(content, timeOutCb, timeout = Config_1.Config.LOADING_TIME_OUT) {
        this._timeOutCb = timeOutCb;
        if (Array.isArray(content)) {
            this._content = content;
        }
        else {
            this._content = [];
            this._content.push(content);
        }
        this._show(timeout);
        return this;
    }
    _show(timeout) {
        var _a;
        if (!this.prefab) {
            return;
        }
        if (!this.node) {
            this.node = (0, cc_1.instantiate)(this.prefab);
        }
        this.node.removeFromParent();
        App.uiManager.addView(this.node, Config_1.ViewZOrder.Loading);
        this.node.position = cc_1.Vec3.ZERO;
        this.text = (_a = (0, cc_1.find)("content/text", this.node)) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.Label);
        this._showContentIndex = 0;
        this.startShowContent();
        this.startTimeOutTimer(timeout);
        this.node.active = true;
    }
    startShowContent() {
        if (this._content.length == 1) {
            this.text.string = this._content[0];
        }
        else {
            this.stopShowContent();
            (0, cc_1.tween)(this.text.node)
                .call(() => {
                this.text.string = this._content[this._showContentIndex];
            })
                .delay(Config_1.Config.LOADING_CONTENT_CHANGE_INTERVAL)
                .call(() => {
                this._showContentIndex++;
                if (this._showContentIndex >= this._content.length) {
                    this._showContentIndex = 0;
                }
                this.startShowContent();
            })
                .start();
        }
    }
    stopShowContent() {
        if (this.text) {
            cc_1.Tween.stopAllByTarget(this.text.node);
        }
    }
    /**@description 开始计时回调 */
    startTimeOutTimer(timeout) {
        if (timeout > 0) {
            this._timerId = setTimeout(() => {
                this._timeOutCb && this._timeOutCb();
                this.hide();
            }, timeout * 1000);
        }
    }
    /**@description 停止计时 */
    stopTimeOutTimer() {
        this._timeOutCb = undefined;
        clearTimeout(this._timerId);
        this._timerId = -1;
    }
    hide() {
        this.stopShowContent();
        this.stopTimeOutTimer();
        if (this.node)
            this.node.active = false;
    }
}
Loading.module = "【Loading】";
exports.default = Loading;
