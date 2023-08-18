"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConnector = void 0;
const env_1 = require("cc/env");
const WebSocketClient_1 = __importDefault(require("./WebSocketClient"));
/**
 * @description 服务器连接器
 */
class ServerConnector {
    constructor() {
        /**
         * @description websocket实例由外部设置方可使用
         */
        this._wsClient = null;
        this._sendHartId = -1; //发送心跳包的间隔id
        this._curRecvHartTimeOutCount = 0; //当前接收心跳超时的次数
        this._enabled = true;
        this._wsClient = new WebSocketClient_1.default();
        this._wsClient.onClose = this.onClose.bind(this);
        this._wsClient.onError = this.onError.bind(this);
        this._wsClient.onMessage = this.onMessage.bind(this);
        this._wsClient.onOpen = this.onOpen.bind(this);
    }
    /**
     * @description 获取最大心跳超时的次数
     */
    getMaxHeartbeatTimeOut() {
        //默认给5次
        return 5;
    }
    /**@description 心跳发送间隔，默认为5秒 */
    getHeartbeatInterval() {
        return 5000;
    }
    /**
     * @description 是否为心跳消息
     */
    isHeartBeat(data) {
        return false;
    }
    /**
     * @description 网络打开
     */
    onOpen(ev) {
        this.recvHeartbeat();
        this.stopSendHartSchedule();
        this.sendHeartbeat();
        this.startSendHartSchedule();
    }
    /**
     * @description 网络关闭
     */
    onClose(ev) {
        //停止心跳发送，已经没有意义
        this.stopSendHartSchedule();
    }
    /**
     * @description 网络错误
     */
    onError(ev) {
        //网络连接出错误，停止心跳发送
        this.stopSendHartSchedule();
    }
    /**
     * @description 收到网络消息
     */
    onMessage(data) {
        this.recvHeartbeat();
    }
    /**
     * @description 收到心跳
     */
    recvHeartbeat() {
        this._curRecvHartTimeOutCount = 0;
    }
    /**@description 是否启用 */
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
        if (value == false) {
            this.close();
        }
    }
    /**
     * @description 连接网络
     * @param ip
     * @param port
     * @param protocol 协议类型 ws / wss
     */
    connect_server(ip, port = null, protocol = "wss") {
        if (!this.enabled) {
            if (env_1.DEBUG)
                Log.w(`请求先启用`);
            return;
        }
        if (port) {
            if (typeof port == "string" && port.length > 0) {
                this._wsClient && this._wsClient.initWebSocket(ip, port, protocol);
            }
            else if (typeof port == "number" && port > 0) {
                this._wsClient && this._wsClient.initWebSocket(ip, port.toString(), protocol);
            }
            else {
                this._wsClient && this._wsClient.initWebSocket(ip, null, protocol);
            }
        }
        else {
            this._wsClient && this._wsClient.initWebSocket(ip, null, protocol);
        }
    }
    /**
     * @description 清除定时发送心跳的定时器id
     */
    stopSendHartSchedule() {
        if (this._sendHartId != -1) {
            clearInterval(this._sendHartId);
            this._sendHartId = -1;
        }
    }
    /**
     * @description 启动心跳发送
     */
    startSendHartSchedule() {
        let self = this;
        this._sendHartId = setInterval(() => {
            self._curRecvHartTimeOutCount = self._curRecvHartTimeOutCount + 1;
            if (self._curRecvHartTimeOutCount > self.getMaxHeartbeatTimeOut()) {
                self.stopSendHartSchedule();
                self.onHeartbeatTimeOut();
                return;
            }
            self.sendHeartbeat();
        }, self.getHeartbeatInterval());
    }
    /**
     * @description 发送请求
     * @param msg 消息
     */
    sendBuffer(buffer) {
        this._wsClient && this._wsClient.send(buffer);
    }
    close(isEnd = false) {
        this.stopSendHartSchedule();
        this._wsClient && this._wsClient.close(isEnd);
    }
    /**@description 网络是否连接成功 */
    get isConnected() {
        if (this._wsClient) {
            return this._wsClient.isConnected;
        }
        return false;
    }
}
exports.ServerConnector = ServerConnector;
