"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const env_1 = require("cc/env");
const Resource_1 = require("./Resource");
/**
 * @description 资源加载器
 */
class ResourceLoader {
    constructor() {
        /** @description 加载资源数据 */
        this._resources = new Map();
        /**@description 当前已经加载的资源数量 */
        this._loadedCount = 0;
        /**@description 加载完成后的数据，为了方便释放时精准释放，没加载成功的资源，不在做释放的判断 */
        this._loadedResource = new Map();
        /**@description 当前是否正在加载资源 */
        this._isLoading = false;
        /**@description 标识 */
        this._tag = null;
    }
    get tag() {
        return this._tag;
    }
    set tag(tag) {
        this._tag = tag;
    }
    set onLoadComplete(cb) {
        this._onLoadComplete = cb;
    }
    get onLoadComplete() {
        return this._onLoadComplete;
    }
    set onLoadProgress(value) {
        this._onLoadProgress = value;
    }
    get onLoadProgress() {
        return this._onLoadProgress;
    }
    set getLoadResources(func) {
        this._getLoadResource = func;
    }
    get getLoadResources() {
        return this._getLoadResource;
    }
    /**
     * @description 加载资源
     */
    loadResources() {
        if (!this.getLoadResources) {
            if (env_1.DEBUG)
                Log.e("未指定 getLoadResources 函数");
            this.onLoadComplete && this.onLoadComplete(Resource_1.Resource.LoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }
        let res = this.getLoadResources();
        if (!res) {
            if (env_1.DEBUG)
                Log.e(`未指定加载资源`);
            this.onLoadComplete && this.onLoadComplete(Resource_1.Resource.LoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }
        if (res.length <= 0) {
            if (env_1.DEBUG)
                Log.w(`加载的资源为空`);
            this.onLoadComplete && this.onLoadComplete(Resource_1.Resource.LoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }
        //如果正在加载中，防止重复调用
        if (this._isLoading) {
            if (env_1.DEBUG)
                Log.w(`资源加载中，未完成加载`);
            this.onLoadComplete && this.onLoadComplete(Resource_1.Resource.LoaderError.LOADING);
            return;
        }
        if (this._resources.size > 0 && this.isLoadComplete()) {
            if (env_1.DEBUG)
                Log.w(`资源已经加载完成，使用已经加载完成的资源`);
            this.onLoadComplete && this.onLoadComplete(Resource_1.Resource.LoaderError.SUCCESS);
            this.onLoadResourceComplete();
            return;
        }
        this._isLoading = true;
        //为防止重复，这里把资源放在一个map中
        res.forEach((value, index) => {
            if (value.url) {
                this._resources.set(value.url, value);
            }
            else if (value.dir) {
                this._resources.set(value.dir, value);
            }
            else {
                if (value.preloadView)
                    this._resources.set(value.preloadView.getPrefabUrl(), value);
            }
        });
        this._loadedCount = 0;
        this._resources.forEach((value, key, source) => {
            if (value.preloadView) {
                App.uiManager.preload(value.preloadView, value.bundle).then((view) => {
                    let cache = new Resource_1.Resource.CacheData();
                    cache.isLoaded = true;
                    cache.data = view;
                    if (value.preloadView)
                        cache.info.url = value.preloadView.getPrefabUrl();
                    cache.info.bundle = value.bundle;
                    this._onLoadResourceComplete(cache);
                });
            }
            else if (value.dir) {
                App.asset.loadDir(value.bundle, value.dir, (value.type), null, this._onLoadResourceComplete.bind(this));
            }
            else {
                App.asset.load(value.bundle, value.url, (value.type), null, this._onLoadResourceComplete.bind(this));
            }
        });
    }
    /**
     * @description 卸载已经加载资源资源
     */
    unLoadResources() {
        this._unLoadResources();
    }
    _unLoadResources() {
        if (this._isLoading || this._resources.size <= 0) {
            //当前正在加载中
            if (this._isLoading) {
                Log.d("resources is loading , waiting for unload!!!");
            }
            return;
        }
        if (this._resources.size > 0) {
            this._resources.forEach((value) => {
                if (value.url) {
                    if (this._loadedResource.has(value.url)) {
                        let data = this._loadedResource.get(value.url);
                        if (data) {
                            App.asset.releaseAsset(data);
                        }
                        this._loadedResource.delete(value.url);
                    }
                }
                else if (value.dir) {
                    if (this._loadedResource.has(value.dir)) {
                        let data = this._loadedResource.get(value.dir);
                        if (data) {
                            App.asset.releaseAsset(data);
                        }
                        this._loadedResource.delete(value.dir);
                    }
                }
            });
        }
        //重置标记
        this._isLoading = false;
        this._loadedCount = 0;
        this._resources.clear();
    }
    _onLoadResourceComplete(data) {
        this._loadedCount++;
        if (this._onLoadProgress) {
            if (this._loadedCount > this._resources.size) {
                this._loadedCount = this._resources.size;
            }
            //cc.log(`----------loadprogress ${this._loadedCount} / ${this._resources.length}--------------`);
            this._onLoadProgress(this._loadedCount, this._resources.size, data);
        }
        if (data && (Array.isArray(data.data) || data.data instanceof cc_1.Asset)) {
            //排除掉界面管理器
            let info = new Resource_1.Resource.Info;
            info.url = data.info.url;
            info.type = data.info.type;
            info.data = data.data;
            info.bundle = data.info.bundle;
            App.asset.retainAsset(info);
            this._loadedResource.set(info.url, info);
        }
        this.checkLoadResourceComplete();
    }
    /**
     * @description 资源加载完成
     */
    checkLoadResourceComplete() {
        //抛出事件给业务逻辑处理
        if (this.isLoadComplete()) {
            //加载完成
            this._isLoading = false;
            this.onLoadComplete && this.onLoadComplete(Resource_1.Resource.LoaderError.SUCCESS);
            this.onLoadResourceComplete();
        }
    }
    /**@description 加载资源完成 */
    onLoadResourceComplete() {
    }
    isLoadComplete() {
        return this._loadedCount >= this._resources.size;
    }
}
exports.default = ResourceLoader;
