"use strict";
/**@description 全局配置 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetPriority = exports.ViewZOrder = exports.Config = void 0;
var Config;
(function (Config) {
    /**@description 是否显示调试按钮 */
    Config.isShowDebugButton = true;
    /**@description 公共音效路径 */
    Config.audioPath = {
        dialog: "common/audio/dlg_open",
        button: "common/audio/btn_click",
    };
    /**@description 是否跳过热更新检测 */
    Config.isSkipCheckUpdate = false;
    /**@description 测试热更新服务器地址 */
    Config.HOT_UPDATE_URL = "http://172.17.80.1/hotupdate";
    /**@description 是否使用了自动版本 */
    Config.USE_AUTO_VERSION = true;
    /**@description Loading动画显示超时回调默认超时时间 */
    Config.LOADING_TIME_OUT = 30;
    /**@description Loading提示中切换显示内容的时间间隔 */
    Config.LOADING_CONTENT_CHANGE_INTERVAL = 3;
    /**@description 加载界面超时时间,如果在LOAD_VIEW_TIME_OUT秒未加载出，提示玩家加载界面超时 */
    Config.LOAD_VIEW_TIME_OUT = 20;
    /**@description UILoading显示默认时间，即在打开界面时，如果界面在LOAD_VIEW_DELAY之内未显示，就会弹出一的加载界面的进度
     * 在打开界面时，也可直接指定delay的值
     * @example
     * Manager.uiManager.open({ type : LoginLayer, zIndex: ViewZOrder.zero, delay : 0.2});
     */
    Config.LOAD_VIEW_DELAY = 0.1;
    /**@description 重连的超时时间 */
    Config.RECONNECT_TIME_OUT = 30;
    /**@description 进入后台最大时间（单位秒）大于这个时间时就会进入重连*/
    Config.MAX_INBACKGROUND_TIME = 60;
    /**@description 进入后台最小时间（单位秒）大于这个时间时就会进入重连*/
    Config.MIN_INBACKGROUND_TIME = 5;
    /**@description 网络重连弹出框tag */
    Config.RECONNECT_ALERT_TAG = 100;
    Config.SHOW_DEBUG_INFO_KEY = "SHOW_DEBUG_INFO_KEY";
})(Config || (exports.Config = Config = {}));
/**
 * @description 界面层级定义
 */
var ViewZOrder;
(function (ViewZOrder) {
    /**@description 最底层 */
    ViewZOrder.zero = 0;
    /**@description 小喇叭显示层 */
    ViewZOrder.Horn = 10;
    /**@description ui层 */
    ViewZOrder.UI = 100;
    /**@description 提示 */
    ViewZOrder.Tips = 300;
    /**@description 提示弹出框 */
    ViewZOrder.Alert = 299;
    /**@description Loading层 */
    ViewZOrder.Loading = 600;
    /**@description 界面加载动画层，暂时放到最高层，加载动画时，界面未打开完成时，不让玩家点击其它地方 */
    ViewZOrder.UILoading = 700;
})(ViewZOrder || (exports.ViewZOrder = ViewZOrder = {}));
/**@description 网络优先级,值越大，优化级越高 */
var NetPriority;
(function (NetPriority) {
    NetPriority[NetPriority["Game"] = 0] = "Game";
    NetPriority[NetPriority["Chat"] = 1] = "Chat";
    NetPriority[NetPriority["Lobby"] = 2] = "Lobby";
})(NetPriority || (exports.NetPriority = NetPriority = {}));
