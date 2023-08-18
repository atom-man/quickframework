"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const env_1 = require("cc/env");
const EventProcessor_1 = require("../../event/EventProcessor");
const Macros_1 = require("../../../defines/Macros");
/**
 * @description 该模块只负责对网络消息的返回处理
 */
class Handler extends EventProcessor_1.EventProcessor {
    constructor() {
        super(...arguments);
        this._module = Macros_1.Macro.UNKNOWN;
    }
    /**@description 该字段由NetHelper指定 */
    get module() {
        return this._module;
    }
    set module(value) {
        this._module = value;
    }
    /**
     * @description 注册网络事件
     * @param cmd cmd
     * @param func 处理函数
     * @param handleType 处理数据类型
     * @param isQueue 接收到消息，是否进行队列处理
     */
    onS(cmd, func, handleType, isQueue = true) {
        let service = this.service;
        if (service && service.addListener) {
            service.addListener(cmd, handleType, func, isQueue, this);
            return;
        }
        if (env_1.DEBUG) {
            Log.w(`未绑定Service`);
        }
    }
    /**
     * @description 反注册网络消息处理
     * @param cmd 如果为null，则反注册当前对象注册过的所有处理过程，否则对特定cmd反注册
     **/
    offS(cmd) {
        let service = this.service;
        if (service && service.removeListeners) {
            service.removeListeners(this, cmd);
            return;
        }
        if (env_1.DEBUG) {
            Log.w(`未绑定Service`);
        }
    }
    /**
     * @description 该方法会在Handler销毁时，调用
     */
    onDestroy() {
        //移除当前Handler绑定事件
        this.offS();
        super.onDestroy();
    }
    debug() {
        Log.d(this.module);
    }
    destory() {
        this.onDestroy();
    }
    init() {
        this.onLoad();
    }
}
exports.Handler = Handler;
/**@description Sender所属模块，如聊天,vip, */
Handler.module = Macros_1.Macro.UNKNOWN;
