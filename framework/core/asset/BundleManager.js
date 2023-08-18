"use strict";
/**
 * @description bundle管理器
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleManager = void 0;
const cc_1 = require("cc");
const Macros_1 = require("../../defines/Macros");
class BundleManager {
    constructor() {
        this.module = null;
    }
    isEngineBundle(key) {
        if (key == cc_1.AssetManager.BuiltinBundleName.MAIN ||
            key == cc_1.AssetManager.BuiltinBundleName.RESOURCES ||
            key == cc_1.AssetManager.BuiltinBundleName.START_SCENE ||
            key == cc_1.AssetManager.BuiltinBundleName.INTERNAL) {
            return true;
        }
        return false;
    }
    /**@description 删除已经加载的bundle */
    removeLoadedBundle(excludeBundles) {
        let loaded = [];
        cc_1.assetManager.bundles.forEach((bundle, key) => {
            //引擎内置包不能删除
            if (!this.isEngineBundle(key)) {
                loaded.push(key);
            }
        });
        let i = loaded.length;
        while (i--) {
            let bundle = loaded[i];
            if (excludeBundles.indexOf(bundle) == -1) {
                //在排除bundle中找不到，直接删除
                if (!App.releaseManger.isExistBunble(bundle)) {
                    App.entryManager.onUnloadBundle(bundle);
                }
                let result = this.getBundle(bundle);
                if (result) {
                    App.cache.removeBundle(bundle);
                    App.releaseManger.removeBundle(result);
                }
            }
        }
    }
    /**
     * @description 获取Bundle
     * @param bundle Bundle名|Bundle
     **/
    getBundle(bundle) {
        if (bundle) {
            if (typeof bundle == "string") {
                return cc_1.assetManager.getBundle(bundle);
            }
            return bundle;
        }
        return null;
    }
    getBundleName(bundle) {
        if (bundle) {
            if (typeof bundle == "string") {
                return bundle;
            }
            else {
                return bundle.name;
            }
        }
        Log.e(`输入参数错误 : ${bundle}`);
        return Macros_1.Macro.UNKNOWN;
    }
    /**
     * 外部接口 进入Bundle
     * @param config 配置
     */
    enterBundle(config) {
        if (config) {
            App.updateManager.dowonLoad(config);
        }
        else {
            Log.e(`无效的入口信息`);
        }
    }
    loadBundle(item) {
        let bundle = this.getBundle(item.bundle);
        if (bundle) {
            Log.d(`${item.bundle}已经加载在缓存中，直接使用`);
            App.releaseManger.onLoadBundle(item.bundle);
            item.handler.onLoadBundleComplete(item);
            return;
        }
        item.handler.onStartLoadBundle(item);
        Log.d(`loadBundle : ${item.bundle}`);
        this._loadBundle(item.bundle, (err, bundle) => {
            if (err) {
                Log.e(`load bundle : ${item.bundle} fail !!!`);
                item.handler.onLoadBundleError(item, err);
            }
            else {
                App.releaseManger.onLoadBundle(item.bundle);
                Log.d(`load bundle : ${item.bundle} success !!!`);
                item.handler.onLoadBundleComplete(item);
            }
        });
    }
    _loadBundle(bundle, onComplete) {
        cc_1.assetManager.loadBundle(bundle, onComplete);
    }
    debug() {
        Log.d(`-------Bundle管理器状态信息-------`);
        let loaded = [];
        cc_1.assetManager.bundles.forEach((bundle, key) => {
            loaded.push(bundle.name);
        });
        Log.d(`当前所有加载完成的bundle : ${loaded.toString()}`);
    }
}
exports.BundleManager = BundleManager;
BundleManager.module = "【Bundle管理器】";
