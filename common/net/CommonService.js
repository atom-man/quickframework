"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const CmdDefines_1 = require("../protocol/CmdDefines");
const Config_1 = require("../config/Config");
const Service_1 = require("../../framework/core/net/service/Service");
const ReconnectHandler_1 = require("./ReconnectHandler");
/**
 * @description service公共基类
 */
class CommonService extends Service_1.Service {
    get data() {
        return App.stageData;
    }
    /**@description 进入后台的最大允许时间，超过了最大值，则进入网络重连 */
    get maxEnterBackgroundTime() {
        return this._maxEnterBackgroundTime;
    }
    set maxEnterBackgroundTime(value) {
        if (value < Config_1.Config.MIN_INBACKGROUND_TIME || value > Config_1.Config.MAX_INBACKGROUND_TIME) {
            value = Config_1.Config.MIN_INBACKGROUND_TIME;
        }
        Log.d(this.module, `maxEnterBackgroundTime ${value}`);
        this._maxEnterBackgroundTime = value;
    }
    constructor() {
        super();
        this.ip = "localhost";
        this.port = 3000;
        this.protocol = "ws";
        this._maxEnterBackgroundTime = Config_1.Config.MAX_INBACKGROUND_TIME;
        this._backgroundTimeOutId = -1;
        this.reconnectHandler = new ReconnectHandler_1.ReconnectHandler(this);
    }
    /**
    * @description 连接网络
    */
    connect() {
        super.connect_server(this.ip, this.port, this.protocol);
    }
    /**
     * @description 发送心跳
     */
    sendHeartbeat() {
        //发送心跳
        if (this.heartbeat) {
            this.send(new this.heartbeat());
        }
        else {
            Log.e("请先设置心跳解析类型");
        }
    }
    /**
     * @description 获取最大心跳超时的次数
     */
    getMaxHeartbeatTimeOut() {
        return super.getMaxHeartbeatTimeOut();
    }
    getHeartbeatInterval() {
        return super.getHeartbeatInterval();
    }
    /**
     * @description 心跳超时
     */
    onHeartbeatTimeOut() {
        Log.w(`${this.module} 心跳超时，您已经断开网络`);
        this.close();
        App.serviceManager.reconnect(this);
    }
    /**
     * @description 是否为心跳消息
     */
    isHeartBeat(data) {
        //示例
        return data.cmd == String(CmdDefines_1.MainCmd.CMD_SYS) + String(CmdDefines_1.SUB_CMD_SYS.CMD_SYS_HEART);
    }
    onEnterBackground() {
        if (this.data.isLoginStage()) {
            return;
        }
        let me = this;
        me._backgroundTimeOutId = setTimeout(() => {
            //进入后台超时，主动关闭网络
            Log.d(`进入后台时间过长，主动关闭网络，等玩家切回前台重新连接网络`);
            me.close();
            App.alert.close(Config_1.Config.RECONNECT_ALERT_TAG);
        }, me.maxEnterBackgroundTime * 1000);
    }
    onEnterForgeground(inBackgroundTime) {
        if (this._backgroundTimeOutId != -1) {
            Log.d(`清除进入后台的超时关闭网络定时器`);
            clearTimeout(this._backgroundTimeOutId);
            Log.d(`在后台时间${inBackgroundTime} , 最大时间为: ${this.maxEnterBackgroundTime}`);
            //登录界面，不做处理
            if (this.data.isLoginStage()) {
                return;
            }
            if (inBackgroundTime > this.maxEnterBackgroundTime) {
                Log.d(`从回台切换，显示重新连接网络`);
                this.close();
                App.alert.close(Config_1.Config.RECONNECT_ALERT_TAG);
                App.serviceManager.reconnect(this);
            }
        }
    }
}
exports.CommonService = CommonService;
