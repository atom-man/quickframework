"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectHandler = void 0;
const cc_1 = require("cc");
const Handler_1 = require("../../framework/core/net/service/Handler");
const Macros_1 = require("../../framework/defines/Macros");
const Config_1 = require("../config/Config");
/**
 * @description 重连Handler
 */
class ReconnectHandler extends Handler_1.Handler {
    get module() {
        return this.service.module;
    }
    constructor(service) {
        super();
        /**@description 绑定Service对象 */
        this._service = null;
        this._enabled = false;
        /**@description 当前连接次数 */
        this._connectCount = 0;
        /**@description 最大重连次数 */
        this._maxConnectCount = 3;
        /**@description 是否正在连接中 */
        this.isConnecting = false;
        this.connectID = 1;
        this.connectTimeOutID = 2;
        this._service = service;
    }
    get service() {
        return this._service;
    }
    get data() {
        return App.stageData;
    }
    /**@description 是否启用重连 */
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
    }
    /**@description 尝试重连 */
    reconnect() {
        if (this.isInvalid)
            return;
        this.service.close();
        this.stop();
        this.delayConnect();
    }
    /**@description 停止 */
    stop() {
        this.stopActions();
        this.isConnecting = false;
        this._connectCount = 0;
        App.alert.close(Config_1.Config.RECONNECT_ALERT_TAG);
    }
    delayConnect() {
        if (this.isInvalid)
            return;
        if (this.isConnecting) {
            Log.w(`${this.service.module} 正在连接中...`);
            return;
        }
        let time = 0.3;
        if (this._connectCount > 0) {
            time = (this._connectCount + 1) * time;
            if (time > 3) {
                time = 3;
            } //最多推后3秒进行重连
            Log.d(`${this.service.module}${time}秒后尝试重连`);
        }
        this.stopAction(this.connectID);
        this.delayCall(this.connectID, time, () => {
            this.connect();
        });
    }
    connect() {
        if (this.isInvalid)
            return;
        App.alert.close(Config_1.Config.RECONNECT_ALERT_TAG);
        //说明进入了登录界面
        if (this.data.isLoginStage()) {
            App.uiReconnect.hide();
            Log.w(`重连处于登录界面，停止重连`);
            return;
        }
        this._connectCount++;
        if (this._connectCount > this._maxConnectCount) {
            this.showReconnectDialog();
            return;
        }
        App.uiReconnect.show(App.getLanguage("tryReconnect", [this.service.module, this._connectCount]));
        this.service.connect();
        //启用连接超时处理
        this.stopAction(this.connectTimeOutID);
        this.delayCall(this.connectTimeOutID, Config_1.Config.RECONNECT_TIME_OUT, () => {
            this.connectTimeOut();
        });
    }
    connectTimeOut() {
        if (this.isInvalid)
            return;
        //连接超时了30s，都没有得到服务器的返回，直接提示让玩家确定是否重连连接网络
        this.stopAction(this.connectID);
        this.isConnecting = false;
        //关闭网络
        this.service.close();
        //显示网络弹出提示框
        this.showReconnectDialog();
    }
    showReconnectDialog() {
        if (this.isInvalid)
            return;
        App.uiReconnect.hide();
        Log.d(`${this.service.module} 断开`);
        this.stopAction(this.connectTimeOutID);
        App.alert.show({
            tag: Config_1.Config.RECONNECT_ALERT_TAG,
            isRepeat: false,
            text: App.getLanguage("warningReconnect", [this.service.module]),
            confirmCb: (isOK) => {
                var _a, _b;
                if (isOK) {
                    Log.d(`${(_a = this.service) === null || _a === void 0 ? void 0 : _a.module} 重连连接网络`);
                    this.stop();
                    App.serviceManager.reconnect(this.service);
                }
                else {
                    Log.d(`${(_b = this.service) === null || _b === void 0 ? void 0 : _b.module} 玩家网络不好，不重连，退回到登录界面`);
                    App.entryManager.enterBundle(Macros_1.Macro.BUNDLE_RESOURCES);
                }
            },
            cancelCb: () => {
                var _a;
                Log.d(`${(_a = this.service) === null || _a === void 0 ? void 0 : _a.module} 玩家网络不好，不重连，退回到登录界面`);
                App.entryManager.enterBundle(Macros_1.Macro.BUNDLE_RESOURCES);
            }
        });
    }
    /**@description 网络连接成功 */
    onOpen(ev) {
        if (this.isInvalid)
            return;
        this._connectCount = 0;
        this.isConnecting = false;
        this.stop();
        Log.d(`${this.service.module}服务器重连成功`);
    }
    /**@description 网络关闭 */
    onClose(ev) {
        if (this.isInvalid)
            return;
        this.isConnecting = false;
        this.delayConnect();
    }
    /**@description 网络错误 */
    onError(ev) {
        if (this.isInvalid)
            return;
        this.service.close();
        this.isConnecting = false;
        this.delayConnect();
    }
    /**@description 是否无效 */
    get isInvalid() {
        if (!(this.service && this.enabled && !this.data.isLoginStage())) {
            return true;
        }
        return false;
    }
    stopActions() {
        this.stopAction(this.connectID);
        this.stopAction(this.connectTimeOutID);
    }
    stopAction(tag) {
        cc_1.Tween.stopAllByTag(tag, this);
    }
    delayCall(tag, time, func) {
        (0, cc_1.tween)(this).tag(tag).delay(time).call(func).start();
    }
    onDestroy() {
        this.stopActions();
        super.onDestroy();
    }
}
exports.ReconnectHandler = ReconnectHandler;
