"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryManager = void 0;
const EntryDelegate_1 = require("./EntryDelegate");
const env_1 = require("cc/env");
const Macros_1 = require("../../defines/Macros");
/**@description 入口管理 */
class EntryManager {
    constructor() {
        this.module = null;
        this.isResident = true;
        this._entrys = new Map();
        /**@description 默认代理，可根据自己项目需要重新实现 */
        this.delegate = new EntryDelegate_1.EntryDelegate();
        this.node = null;
    }
    /**@description 注册入口 */
    register(entryClass, type) {
        let entry = this.getEntry(entryClass.bundle);
        if (entry) {
            if (env_1.DEBUG) {
                Log.w(`${this.module}更新Bundle : ${entryClass.bundle} 入口程序!!!`);
            }
            this._entrys.delete(entryClass.bundle);
        }
        entry = new entryClass;
        entry.bundle = entryClass.bundle;
        entry.gameViewType = type;
        this._entrys.set(entry.bundle, entry);
        if (this.node) {
            if (env_1.DEBUG) {
                Log.d(`${this.module} ${entry.bundle} onLoad`);
            }
            entry.onLoad(this.node);
        }
    }
    onLoad(node) {
        this.node = node;
        this._entrys.forEach((entry, key) => {
            if (!entry.isRunning) {
                entry.onLoad(this.node);
                if (entry.isMain) {
                    if (env_1.DEBUG) {
                        Log.d(`${this.module}${entry.bundle} onEnter`);
                    }
                    //启动主程序入口
                    entry.onEnter();
                }
            }
        });
    }
    onDestroy(node) {
        this._entrys.forEach((entry) => {
            entry.onDestroy();
        });
    }
    /**@description 主包检测更新 */
    onCheckUpdate() {
        this.delegate.onCheckUpdate();
    }
    call(bundle, eventName, ...args) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.call(eventName, args);
        }
    }
    /**
     * @description 进入bundle,默认代理没办法满足需求的情况，可自行定制
     * @param bundle bundle
     * @param userData 用户自定义数据
     **/
    enterBundle(bundle, userData) {
        let config = this.delegate.getEntryConfig(bundle);
        if (config) {
            if (bundle == Macros_1.Macro.BUNDLE_RESOURCES) {
                let entry = this.getEntry(bundle);
                this.delegate.onEnterMain(entry, userData);
            }
            else {
                config.userData = userData;
                App.bundleManager.enterBundle(config);
            }
        }
    }
    /**
     * @description 返回上一场景
     * */
    backBundle(userData) {
        let bundle = App.stageData.prevWhere;
        if (bundle) {
            this.enterBundle(bundle, userData);
        }
        else {
            Log.d(`${this.module}已经是最后一个场景，无法返回`);
        }
    }
    /**@description 加载bundle完成 */
    onLoadBundleComplete(item) {
        // 加载完成后，记录加载过的标识
        item.isLoaded = true;
        //通知入口管理进入bundle
        let entry = this.getEntry(item.bundle);
        if (entry) {
            entry.onEnter(item.userData);
        }
    }
    /**@description 进入GameView完成，卸载除了自己之外的其它bundle */
    onEnterGameView(bundle, gameView) {
        let entry = this.getEntry(bundle);
        if (entry) {
            this.delegate.onEnterGameView(entry, gameView);
            entry.onEnterGameView(gameView);
        }
    }
    /**@description 管理器调用show时,在GameView的onLoad之后  */
    onShowGameView(bundle, gameView) {
        let entry = this.getEntry(bundle);
        if (entry) {
            this.delegate.onShowGameView(entry, gameView);
            entry.onShowGameView(gameView);
        }
    }
    /**@description bundle管事器卸载bundle前通知 */
    onUnloadBundle(bundle) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.onUnloadBundle();
        }
    }
    onDestroyGameView(bundle, gameView) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.onUnloadBundle();
            entry.onDestroyGameView(gameView);
        }
    }
    /**@description 获取bundle入口 */
    getEntry(bundle) {
        let name = App.bundleManager.getBundleName(bundle);
        let entry = this._entrys.get(name);
        if (entry) {
            return entry;
        }
        return null;
    }
    debug() {
        Log.d(`-------Bundle入口管理器-------`);
        this._entrys.forEach(v => {
            Log.d(`bundle : ${v.bundle}`);
        });
    }
}
exports.EntryManager = EntryManager;
EntryManager.module = "【入口管理器】";
