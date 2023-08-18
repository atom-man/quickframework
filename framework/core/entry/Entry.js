"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entry = void 0;
const ResourceLoader_1 = __importDefault(require("../asset/ResourceLoader"));
const cc_1 = require("cc");
const env_1 = require("cc/env");
class Entry {
    set gameView(gameView) {
        this._gameView = gameView;
    }
    get gameView() {
        return this._gameView;
    }
    constructor() {
        this.gameViewType = null;
        /**@description 是否是主包入口，只能有一个主包入口 */
        this.isMain = false;
        /**@description 当前bundle名,由管理器指定 */
        this.bundle = "";
        /**@description 当前语言包数据源代码，可为null */
        this.language = null;
        /**@description 模块资源加载器 */
        this.loader = null;
        /**@description 当前MainController所在节点 */
        this.node = null;
        /**@description 当胆入口是否已经运行中 */
        this.isRunning = false;
        this._gameView = null;
        this.loader = new ResourceLoader_1.default();
    }
    /**@description init之后触发,由管理器统一调度 */
    onLoad(node) {
        this.node = node;
        this.isRunning = true;
    }
    /**@description 场景销毁时触发,管理器统一调度 */
    onDestroy() {
        this.isRunning = false;
    }
    /**@description 管理器通知自己进入GameView */
    onEnter(userData) {
        //语言包初始化
        App.language.addDelegate(this.language);
        //初始化游戏数据
        this.initData();
        //添加网络事件
        this.addNetHandler();
        //暂停当前网络处理队列，等资源加载完成后打开界面
        this.pauseMessageQueue();
        //加载资源
        this.loadResources(() => {
            this.openGameView(userData);
        });
    }
    /**@description 这个位置说明自己GameView 进入onLoad完成 */
    onEnterGameView(gameViw) {
        this._gameView = gameViw;
        let viewType = App.uiManager.getViewType(gameViw);
        if (viewType) {
            if (viewType.logicType) {
                viewType.logicType.module = gameViw.bundle;
                let logic = App.logicManager.get(viewType.logicType, true);
                if (logic) {
                    gameViw.setLogic(logic);
                }
            }
            else {
                if (env_1.DEBUG) {
                    Log.w(`${cc_1.js.getClassName(viewType)}未指定logictype`);
                }
            }
        }
    }
    onShowGameView(gameView) {
    }
    onDestroyGameView(gameView) {
        this._gameView = null;
    }
    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle() {
        //自己bundle初始卸载前要关闭当前bundle的所有界面
        App.uiManager.closeBundleView(this.bundle);
        //移除入口语言包数据
        App.language.removeDelegate(this.language);
        //移除本模块网络事件
        this.removeNetHandler();
        //卸载资源
        this.unloadResources();
    }
    unloadResources() {
        this.loader.unLoadResources();
    }
    /**@description 打开游戏主场景视图 */
    openGameView(userData) {
        App.uiManager.open({ type: this.gameViewType, bundle: this.bundle, args: userData });
    }
    closeGameView() {
        App.uiManager.close(this.gameViewType);
    }
    /**@description 外部模块可直接指定bund进行去bundle内调用 */
    call(eventName, args) {
    }
}
exports.Entry = Entry;
Entry.bundle = "";
