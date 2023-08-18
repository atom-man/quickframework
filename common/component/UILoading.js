"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const Config_1 = require("../config/Config");
/**
 * @description 加载动画
 */
class UILoading {
    constructor() {
        this.module = null;
        this.isResident = true;
        /**@description 当前loading节点 */
        this.node = null;
        this.delay = 0;
        this.content = null;
        this.text = null;
        this._uiName = null;
        /**@description 显示节点的透明度 */
        this._contentOpacity = null;
        this._timerId = -1;
    }
    get prefab() {
        return App.uiManager.getScenePrefab("UILoading");
    }
    get contentOpacity() {
        if (this._contentOpacity) {
            return this._contentOpacity;
        }
        return this.content.getComponent(cc_1.UIOpacity);
    }
    /**
    * @description 显示全屏幕加载动画
    * @param delay 延迟显示时间 当为null时，不会显示loading进度，但会显示阻隔层 >0时为延迟显示的时间
    */
    show(delay, name) {
        if (delay == undefined || delay == null || delay < 0) {
            this.delay = Config_1.Config.LOAD_VIEW_DELAY;
        }
        else {
            this.delay = delay;
        }
        this._uiName = name ? name : "";
        this._show();
    }
    /**
     * @description 显示动画
     * @param timeOut 超时加载时间。默认10为加载界面失败
     * @param timeOutCb 超时回调
     */
    _show() {
        var _a;
        if (!this.node) {
            this.node = (0, cc_1.instantiate)(this.prefab);
        }
        this.node.removeFromParent();
        App.uiManager.addView(this.node, Config_1.ViewZOrder.UILoading);
        this.node.position = cc_1.Vec3.ZERO;
        this.content = (0, cc_1.find)("content", this.node);
        cc_1.Tween.stopAllByTarget(this.contentOpacity);
        this.text = (_a = (0, cc_1.find)("text", this.content)) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.Label);
        this.text.string = "0%";
        this.contentOpacity.opacity = 0;
        if (this.delay > 0) {
            (0, cc_1.tween)(this.contentOpacity).delay(this.delay).set({ opacity: 255 }).start();
        }
        this.startTimeOutTimer(Config_1.Config.LOAD_VIEW_TIME_OUT);
        this.node.active = true;
    }
    /**@description 开始计时回调 */
    startTimeOutTimer(timeout) {
        this.stopTimeOutTimer();
        if (timeout) {
            this._timerId = setTimeout(() => {
                App.tips.show(`加载界面${this._uiName ? this._uiName : ""}超时，请重试`);
                this.hide();
            }, timeout * 1000);
        }
    }
    /**@description 停止计时 */
    stopTimeOutTimer() {
        clearTimeout(this._timerId);
        this._timerId = -1;
    }
    hide() {
        this.stopTimeOutTimer();
        if (this.node) {
            cc_1.Tween.stopAllByTarget(this.content);
            this.node.active = false;
        }
    }
    updateProgress(progress) {
        if (this.text) {
            if (progress == undefined || progress == null || Number.isNaN(progress)) {
                this.hide();
                return;
            }
            if (progress >= 0 && progress <= 100) {
                this.text.string = `${progress}%`;
            }
        }
    }
}
UILoading.module = "【UILoading】";
exports.default = UILoading;
