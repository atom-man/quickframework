"use strict";
/**
 * 资源释放管理
 * DateTime = Mon Dec 13 2021 20:58:18 GMT+0800 (中国标准时间)
 * Author = zheng_fasheng
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseManager = void 0;
const cc_1 = require("cc");
const Macros_1 = require("../../defines/Macros");
const LOG_TAG = "[ReleaseManager] : ";
class LazyInfo {
    constructor(name) {
        this.name = "";
        this._assets = new Map();
        this.name = name;
    }
    /**@description 放入懒释放资源 */
    add(info) {
        //管理器引用加1
        if (Array.isArray(info.data)) {
            Log.d(`${LOG_TAG}向${this.name}加入待释放目录:${info.url}`);
            for (let i = 0; i < info.data.length; i++) {
                if (info.data[i]) {
                    info.data[i].addRef();
                }
            }
        }
        else {
            if (info.data) {
                Log.d(`${LOG_TAG}向${this.name}加入待释放资源:${info.url}`);
                info.data.addRef();
            }
        }
        info.stamp = Date.timeNow();
        this._assets.set(info.url, info);
    }
    get(url) {
        let info = this._assets.get(url);
        let result = null;
        if (info) {
            if (Array.isArray(info.data)) {
                for (let i = 0; i < info.data.length; i++) {
                    if (info.data[i]) {
                        info.data[i].decRef(false);
                    }
                }
                Log.d(`${LOG_TAG}向${this.name}获取待释放目录:${info.url}`);
                result = info.data;
            }
            else {
                if ((0, cc_1.isValid)(info.data)) {
                    //获取后删除当前管理器的引用
                    info.data.decRef(false);
                    Log.d(`${LOG_TAG}向${this.name}获取待释放资源:${info.url}`);
                    result = info.data;
                }
            }
        }
        this._assets.delete(url);
        return result;
    }
    onLowMemory() {
        if (this._assets.size > 0) {
            Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载的资源`);
            if (this.name == Macros_1.Macro.BUNDLE_REMOTE) {
                this._assets.forEach((info, key, source) => {
                    if (info.data instanceof cc_1.Asset) {
                        Log.d(`${LOG_TAG}bundle : ${this.name} 释放远程加载资源${info.url}`);
                        cc_1.assetManager.releaseAsset(info.data);
                    }
                });
                this._assets.clear();
                return;
            }
            let bundle = cc_1.assetManager.getBundle(this.name);
            if (bundle) {
                this._assets.forEach((info, url, source) => {
                    if (Array.isArray(info.data)) {
                        Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载目录${info.url}`);
                        for (let i = 0; i < info.data.length; i++) {
                            if (info.data[i]) {
                                info.data[i].decRef(false);
                                let path = `${info.url}/${info.data[i].name}`;
                                bundle === null || bundle === void 0 ? void 0 : bundle.release(path, info.type);
                                Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载资源${path}`);
                            }
                        }
                    }
                    else {
                        if ((0, cc_1.isValid)(info.data)) {
                            //获取后删除当前管理器的引用
                            info.data.decRef(false);
                            bundle === null || bundle === void 0 ? void 0 : bundle.release(info.url, info.type);
                            Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载资源${info.url}`);
                        }
                    }
                });
                this._assets.clear();
            }
            else {
                Log.w(`${LOG_TAG}释放bundle : ${this.name} 时，Bundle已经被释放，直接清空待释放数据`);
                this._assets.clear();
            }
        }
    }
    tryRemove(bundle) {
        if (this.name != bundle) {
            return;
        }
        this.onLowMemory();
    }
    /**@description 尝试释放长时间未使用资源 */
    tryRemoveTimeoutResources() {
        if (App.isLazyRelease && App.isAutoReleaseUnuseResources) {
            this._assets.forEach((info, url, source) => {
                if (info.retain) {
                    return;
                }
                if (info.stamp == null) {
                    return;
                }
                let now = Date.timeNow();
                let pass = now - info.stamp;
                if (pass >= App.autoReleaseUnuseResourcesTimeout) {
                    if (this.name == Macros_1.Macro.BUNDLE_REMOTE) {
                        if (info.data instanceof cc_1.Asset) {
                            Log.d(`${LOG_TAG}bundle : ${this.name} 释放远程加载资源${info.url}`);
                            cc_1.assetManager.releaseAsset(info.data);
                        }
                        this._assets.delete(url);
                        return;
                    }
                    //释放长时间未使用资源
                    let bundle = App.bundleManager.getBundle(info.bundle);
                    if (Array.isArray(info.data)) {
                        for (let i = 0; i < info.data.length; i++) {
                            let path = `${info.url}/${info.data[i].name}`;
                            bundle.release(path, info.type);
                        }
                        Log.d(`${LOG_TAG}成功释放长时间未使用资源目录 : ${info.bundle}.${info.url}`);
                    }
                    else {
                        bundle.release(info.url, info.type);
                        Log.d(`${LOG_TAG}成功释放长时间未使用资源 : ${info.bundle}.${info.url}`);
                    }
                    this._assets.delete(url);
                }
            });
        }
    }
    get assets() {
        return this._assets;
    }
}
class ReleaseManager {
    constructor() {
        this.isResident = true;
        this.module = null;
        /**@description 待释放资源 */
        this._lazyInfos = new Map();
        /**@description 待释放bundle */
        this._bundles = new Map();
        /**@description 远程资源 */
        this._remote = new LazyInfo(Macros_1.Macro.BUNDLE_REMOTE);
        this._actionTag = 999;
    }
    getBundle(bundle) {
        return App.bundleManager.getBundle(bundle);
    }
    getBundleName(bundle) {
        return App.bundleManager.getBundleName(bundle);
    }
    release(info) {
        let bundle = this.getBundle(info.bundle);
        if (bundle) {
            if (App.isLazyRelease) {
                let name = bundle.name;
                //如果是懒释放，记录一下就行了
                let lazyInfo;
                if (this._lazyInfos.has(name)) {
                    lazyInfo = this._lazyInfos.get(name);
                }
                else {
                    lazyInfo = new LazyInfo(name);
                    this._lazyInfos.set(name, lazyInfo);
                }
                if (lazyInfo) {
                    lazyInfo.add(info);
                }
            }
            else {
                if (Array.isArray(info.data)) {
                    for (let i = 0; i < info.data.length; i++) {
                        let path = `${info.url}/${info.data[i].name}`;
                        bundle.release(path, info.type);
                    }
                    Log.d(`${LOG_TAG}成功释放资源目录 : ${info.bundle}.${info.url}`);
                }
                else {
                    bundle.release(info.url, info.type);
                    Log.d(`${LOG_TAG}成功释放资源 : ${info.bundle}.${info.url}`);
                }
            }
        }
        else {
            Log.e(`${LOG_TAG}${info.bundle} no found`);
        }
    }
    get(bundle, url) {
        let temp = this.getBundle(bundle);
        if (temp) {
            let info = this._lazyInfos.get(temp.name);
            if (info) {
                return info.get(url);
            }
        }
        else {
            Log.w(`${LOG_TAG}${bundle}不存在，删除释放管理器中的缓存`);
            let name = this.getBundleName(bundle);
            this.onLoadBundle(name);
            this._lazyInfos.delete(name);
        }
        return null;
    }
    removeBundle(bundle) {
        let temp = this.getBundle(bundle);
        if (App.isLazyRelease) {
            if (temp) {
                Log.d(`${LOG_TAG}向释放管理器中添加待释放bundle : ${temp === null || temp === void 0 ? void 0 : temp.name}`);
                this._bundles.set(temp === null || temp === void 0 ? void 0 : temp.name, false);
            }
        }
        else {
            Log.d(`${LOG_TAG}释放Bundle : ${temp === null || temp === void 0 ? void 0 : temp.name}`);
            if (temp)
                cc_1.assetManager.removeBundle(temp);
        }
    }
    onLoadBundle(bundle) {
        this._bundles.delete(bundle);
    }
    /**
     * @description 判断bundle是否存在于释放管理器中
     */
    isExistBunble(bundle) {
        if (App.isLazyRelease) {
            //开启了懒释放功能
            let name = this.getBundleName(bundle);
            if (this._bundles.has(name)) {
                return true;
            }
            return false;
        }
        else {
            //未开启，在释放之前已经获取过了，严格来说，不可能走到这里
            return false;
        }
    }
    onLowMemory() {
        Log.d(`${LOG_TAG}------------收到内存警告，释放无用资源------------`);
        this._lazyInfos.forEach((info, key, source) => {
            info.onLowMemory();
        });
        Log.d(`${LOG_TAG}-------------释放无用bundle-------------`);
        this._bundles.forEach((value, bundle) => {
            let temp = cc_1.assetManager.getBundle(bundle);
            if (temp) {
                if (App.bundleManager.isEngineBundle(bundle)) {
                    Log.d(`${bundle} : 引擎bundle，跳过处理`);
                    return;
                }
                Log.d(`释放无用bundle : ${bundle}`);
                cc_1.assetManager.removeBundle(temp);
                this._bundles.delete(bundle);
            }
        });
        Log.d(`${LOG_TAG}-------------释放无用远程资源-------------`);
        this._remote.onLowMemory();
    }
    onAutoReleaseUnuseResources() {
        Log.d(`${LOG_TAG}------------释放长时间未使用资源开始------------`);
        let curBundle = App.stageData.where;
        //排除当前bundle的资源，当前bundle正在运行，没有必要释放当前bundle资源
        this._lazyInfos.forEach((info, bundle, source) => {
            if (bundle == curBundle) {
                return;
            }
            info.tryRemoveTimeoutResources();
        });
        Log.d(`${LOG_TAG}-------------释放无用远程资源-------------`);
        this._remote.tryRemoveTimeoutResources();
        Log.d(`${LOG_TAG}------------释放长时间未使用资源结束------------`);
    }
    /**@description 尝试释放指定bundel的资源 */
    tryRemoveBundle(bundle) {
        Log.d(`${LOG_TAG}--------------尝试释放${bundle}加载资源------------`);
        this._lazyInfos.forEach((info, key, source) => {
            info.tryRemove(bundle);
        });
        let name = this.getBundleName(bundle);
        let temp = cc_1.assetManager.getBundle(name);
        if (temp) {
            Log.d(`释放无用bundle : ${name}`);
            cc_1.assetManager.removeBundle(temp);
            this._bundles.delete(name);
        }
    }
    getRemote(url) {
        return this._remote.get(url);
    }
    releaseRemote(info) {
        if (App.isLazyRelease) {
            this._remote.add(info);
        }
        else {
            if (info.data instanceof cc_1.Asset) {
                cc_1.assetManager.releaseAsset(info.data);
            }
        }
    }
    onLoad(node) {
        (0, cc_1.tween)(node).repeatForever((0, cc_1.tween)(node)
            .delay(App.autoReleaseUnuseResourcesTimeout)
            .call(() => {
            this.onAutoReleaseUnuseResources();
        }))
            .tag(this._actionTag)
            .start();
    }
    onDestroy(node) {
        cc_1.Tween.stopAllByTag(this._actionTag);
    }
    debug() {
        let bundles = [];
        this._bundles.forEach((data, key, source) => {
            bundles.push(key);
        });
        let data = {
            lazyInfo: this._lazyInfos,
            bundles: bundles,
            remote: this._remote
        };
        Log.d(`--------------${this.module}调试信息如下--------------`);
        if (App.isLazyRelease) {
            if (data.bundles.length > 0) {
                Log.d(`待释放Bundle : ${data.bundles.toString()}`);
            }
            if (data.lazyInfo.size > 0) {
                data.lazyInfo.forEach((value, key, source) => {
                    Log.d(`--------------${key}待释放资源--------------`);
                    value.assets.forEach((info, key, source) => {
                        Log.d(`${info.url}`);
                    });
                });
            }
            Log.d(`远程待释放资源`);
            data.remote.assets.forEach((info, key, source) => {
                Log.d(`${info.url}`);
            });
        }
        else {
            Log.w(`未开户懒释放功能!!!!`);
        }
    }
}
exports.ReleaseManager = ReleaseManager;
ReleaseManager.module = "【资源管理器】";
