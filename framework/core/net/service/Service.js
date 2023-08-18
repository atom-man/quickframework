"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const env_1 = require("cc/env");
const Macros_1 = require("../../../defines/Macros");
const Net_1 = require("../Net");
const ServerConnector_1 = require("../socket/ServerConnector");
const Process_1 = require("./Process");
/** @description 处理函数声明 handleType 为你之前注册的handleType类型的数据 返回值number 为处理函数需要的时间 */
class Service extends ServerConnector_1.ServerConnector {
    constructor() {
        super(...arguments);
        /**@description 该字段由ServiceManager指定 */
        this.module = Macros_1.Macro.UNKNOWN;
        /**@description 网络重连 */
        this.reconnectHandler = null;
        this._Process = new Process_1.Process();
        // protected get messageHeader() { return this._messageHeader }
        this._Heartbeat = null;
        /**@description 值越大，优先级越高 */
        this.priority = 0;
        this.serviceType = Net_1.Net.ServiceType.Unknown;
    }
    set Process(val) {
        if (val == null) {
            return;
        }
        this._Process = new val;
        this._Process.serviceType = this.serviceType;
    }
    /**@description 数据流消息包头定义类型 */
    set Codec(value) { this._Process.Codec = value; }
    /**@description 心跳的消息定义类型 */
    get heartbeat() { return this._Heartbeat; }
    set heartbeat(value) {
        this._Heartbeat = value;
        this.serviceType = value.type;
        this._Process.serviceType = value.type;
    }
    onOpen(ev) {
        super.onOpen(ev);
        App.serviceManager.onOpen(ev, this);
    }
    onClose(ev) {
        super.onClose(ev);
        App.serviceManager.onClose(ev, this);
    }
    onError(ev) {
        super.onError(ev);
        App.serviceManager.onError(ev, this);
    }
    onMessage(data) {
        this.recvHeartbeat();
        //先对包信进行解析
        let header = new this._Process.Codec;
        if (!header.unPack(data)) {
            Log.e(`decode header error`);
            return;
        }
        if (this.isHeartBeat(header)) {
            //心跳消息，路过处理，应该不会有人注册心跳吧
            this.onRecvHeartBeat();
            return;
        }
        super.onMessage(data);
        this._Process.onMessage(header);
    }
    /**@description 收到心跳 */
    onRecvHeartBeat() {
    }
    /**
  * @description 添加服务器数据监听
  * @param handleType 处理类型，指你用哪一个类来进行解析数据
  * @param handleFunc 处理回调
  * @param isQueue 是否进入消息队列
  */
    addListener(cmd, handleType, handleFunc, isQueue, target) {
        this._Process.addListener(cmd, handleType, handleFunc, isQueue, target);
    }
    removeListeners(target, eventName) {
        this._Process.removeListeners(target, eventName);
    }
    addMessageQueue(key, data, encode = false) {
        this._Process.addMessageQueue(key, data, encode);
    }
    /**
     * @description 暂停消息队列消息处理
     */
    pauseMessageQueue() { this._Process.isPause = true; }
    /**
     * @description 恢复消息队列消息处理
     */
    resumeMessageQueue() { this._Process.isPause = false; }
    handMessage() { this._Process.handMessage(); }
    /**
     * @description 重置
     */
    reset() { this._Process.reset(); }
    close(isEnd = false) {
        //清空消息处理队列
        this._Process.close();
        //不能恢复这个队列，可能在重新连接网络时，如游戏的Logic层暂停掉了处理队列去加载资源，期望加载完成资源后再恢复队列的处理
        //this.resumeMessageQueue();
        super.close(isEnd);
    }
    send(msg) {
        if (this._Process.Codec) {
            if (msg.encode()) {
                let header = new this._Process.Codec;
                header.pack(msg);
                if (this.isHeartBeat(msg)) {
                    if (env_1.DEBUG)
                        Log.d(`send request cmd : ${msg.cmd} `);
                }
                else {
                    Log.d(`send request main cmd : ${msg.cmd} `);
                }
                this.sendBuffer(header.buffer);
            }
            else {
                Log.e(`encode error`);
            }
        }
        else {
            Log.e("请求指定数据包头处理类型");
        }
    }
    destory() {
        if (this.reconnectHandler) {
            this.reconnectHandler.onDestroy();
        }
    }
}
exports.Service = Service;
/**@description Service所属模块，如Lobby,game */
Service.module = Macros_1.Macro.UNKNOWN;
