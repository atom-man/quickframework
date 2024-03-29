"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._AssetManager = void 0;
const cc_1 = require("cc");
const env_1 = require("cc/env");
const Macros_1 = require("../../defines/Macros");
const Resource_1 = require("./Resource");
class RemoteLoader {
    constructor() {
        this._logTag = `[RemoteLoader] `;
    }
    loadImage(url, isNeedCache) {
        let me = this;
        return new Promise((resolve) => {
            if (url == null || url == undefined || url.length <= 0) {
                resolve(null);
                return;
            }
            if (isNeedCache) {
                //如果存在缓存 ，直接取出
                let spCache = App.cache.remoteCaches.getSpriteFrame(url);
                if (spCache && spCache.data) {
                    if (env_1.DEBUG)
                        Log.d(this._logTag, `从缓存精灵帧中获取:${url}`);
                    resolve((spCache.data));
                    return;
                }
                else {
                    //错误处理
                    if (env_1.DEBUG) {
                        if (spCache)
                            Log.d(this._logTag, `错误资源，删除缓存信息，重新加载:${url}`);
                    }
                    App.cache.remoteCaches.remove(url);
                }
            }
            else {
                //不需要缓存，先删除之前的,再重新加载
                if (env_1.DEBUG)
                    Log.d(this._logTag, `不需要缓存信息，删除缓存，重新加载${url}`);
                App.cache.remoteCaches.remove(url);
            }
            me._loadRemoteRes(url, cc_1.Texture2D, isNeedCache).then((data) => {
                //改变缓存类型
                let cache = App.cache.remoteCaches.get(url);
                if (data && cache) {
                    if (env_1.DEBUG)
                        Log.d(`${this._logTag}加载图片完成${url}`);
                    cache.data = data;
                    cache.data.name = url;
                    let spriteFrame = App.cache.remoteCaches.setSpriteFrame(url, cache.data);
                    resolve(spriteFrame);
                }
                else {
                    if (env_1.DEBUG)
                        Log.w(`${this._logTag}加载图片错误${url}`);
                    resolve(null);
                }
            });
        });
    }
    loadSkeleton(path, name, isNeedCache) {
        let me = this;
        return new Promise((resolve) => {
            if (path && name) {
                let url = `${path}/${name}`;
                let spineAtlas = `${path}/${name}.atlas`;
                let spinePng = `${path}/${name}.png`;
                let spineJson = `${path}/${name}.json`;
                let res = App.releaseManger.getRemote(url);
                if (res) {
                    let cache = App.cache.remoteCaches.get(url);
                    if (cache) {
                        cache.isLoaded = true;
                        cache.data = res;
                        cache.info.data = res;
                        cache.info.url = url;
                        resolve((cache.data));
                        cache.doFinish(cache.data);
                    }
                    else {
                        cache = new Resource_1.Resource.CacheData();
                        cache.info.resourceType = Resource_1.Resource.Type.Remote;
                        cache.info.type = cc_1.sp.SkeletonData;
                        cache.info.bundle = Macros_1.Macro.BUNDLE_REMOTE;
                        cache.isLoaded = true;
                        cache.data = res;
                        cache.info.data = res;
                        cache.info.url = url;
                        App.cache.remoteCaches.set(url, cache);
                        resolve((cache.data));
                        cache.doFinish(cache.data);
                    }
                    return;
                }
                let cache = App.cache.remoteCaches.get(url);
                if (cache) {
                    if (cache.isLoaded) {
                        resolve((cache.data));
                    }
                    else {
                        cache.finishCb.push(resolve);
                    }
                }
                else {
                    cache = new Resource_1.Resource.CacheData();
                    cache.info.resourceType = Resource_1.Resource.Type.Remote;
                    cache.info.type = cc_1.sp.SkeletonData;
                    cache.info.bundle = Macros_1.Macro.BUNDLE_REMOTE;
                    App.cache.remoteCaches.set(url, cache);
                    me._loadRemoteRes(spinePng, cc_1.Asset, isNeedCache).then((image) => {
                        if (image) {
                            me._loadRemoteRes(spineJson, cc_1.JsonAsset, isNeedCache).then((json) => {
                                if (json) {
                                    me._loadRemoteRes(spineAtlas, cc_1.JsonAsset, isNeedCache).then((atlas) => {
                                        if (atlas) {
                                            //生成SkeletonData数据
                                            let asset = new cc_1.sp.SkeletonData;
                                            asset.skeletonJson = json.json;
                                            asset.atlasText = atlas.text;
                                            let texture = new cc_1.Texture2D();
                                            texture.image = image;
                                            asset.textures = [texture];
                                            let pngName = name + ".png";
                                            asset.textureNames = [pngName];
                                            cache = cache;
                                            cache.info.url = url;
                                            asset.name = url;
                                            cache.data = asset;
                                            cache.isLoaded = true;
                                            resolve((cache.data));
                                            cache.doFinish(cache.data);
                                        }
                                        else {
                                            resolve(null);
                                            cache = cache;
                                            cache.doFinish(null);
                                            App.cache.remoteCaches.remove(url);
                                        }
                                    });
                                }
                                else {
                                    resolve(null);
                                    cache = cache;
                                    cache.doFinish(null);
                                    App.cache.remoteCaches.remove(url);
                                }
                            });
                        }
                        else {
                            resolve(null);
                            cache = cache;
                            cache.doFinish(null);
                            App.cache.remoteCaches.remove(url);
                        }
                    });
                }
            }
            else {
                resolve(null);
            }
        });
    }
    _loadRemoteRes(url, type, isNeedCache) {
        return new Promise((resolve) => {
            let cache = App.cache.remoteCaches.get(url);
            if (cache) {
                //有缓存,查看是否已经加载
                if (cache.isLoaded) {
                    //如果已经加载完成
                    resolve(cache.data);
                }
                else {
                    //正在加载中
                    cache.finishCb.push(resolve);
                }
            }
            else {
                //没有缓存存在,生成加载缓存
                cache = new Resource_1.Resource.CacheData();
                cache.info.resourceType = Resource_1.Resource.Type.Remote;
                cache.info.type = type;
                App.cache.remoteCaches.set(url, cache);
                let res = App.releaseManger.getRemote(url);
                if (res) {
                    cache.isLoaded = true;
                    cache.data = res;
                    cache.data.addRef();
                    //把再加载过程里，双加载同一资源的回调都回调回去
                    cache.doFinish(res);
                    resolve(cache.data);
                    return;
                }
                cc_1.assetManager.loadRemote(url, { cacheAsset: true, reloadAsset: !isNeedCache }, (error, data) => {
                    if (cache) {
                        cache.isLoaded = true;
                        if (data) {
                            cache.data = data;
                            cache.data.addRef();
                            if (env_1.DEBUG)
                                Log.d(`${this._logTag}加载远程资源完成:${url}`);
                        }
                        else {
                            if (env_1.DEBUG)
                                Log.w(`${this._logTag}加载本地资源异常:${url}`);
                        }
                        //把再加载过程里，双加载同一资源的回调都回调回去
                        cache.doFinish(data);
                        resolve(cache.data);
                    }
                });
            }
        });
    }
    /**@description 由主游戏控制器驱动，在下载远程资源时，设置一个上限下载任务数据，以免同一时间任务数量过大 */
    update() {
    }
}
class _AssetManager {
    constructor() {
        this.isResident = true;
        this.module = null;
        this._remote = new RemoteLoader();
    }
    get remote() { return this._remote; }
    /**
     * @description 获取Bundle
     * @param bundle Bundle名|Bundle
     */
    getBundle(bundle) {
        return App.bundleManager.getBundle(bundle);
    }
    load(bundle, path, type, onProgress, onComplete) {
        if (env_1.DEBUG) {
            Log.d(`load bundle : ${bundle} path : ${path}`);
        }
        let cache = App.cache.get(bundle, path);
        if (cache) {
            //存在缓存信息
            if (cache.isLoaded) {
                //已经加载完成
                if (env_1.DEBUG && cache.status == Resource_1.Resource.CacheStatus.WAITTING_FOR_RELEASE) {
                    Log.w(this.module, `资源:${path} 等待释放，但资源已经加载完成，此时有人又重新加载，不进行释放处理`);
                }
                //加载完成
                onComplete(cache);
            }
            else {
                if (env_1.DEBUG && cache.status == Resource_1.Resource.CacheStatus.WAITTING_FOR_RELEASE) {
                    Log.w(this.module, `资源:${path}等待释放，但资源处理加载过程中，此时有人又重新加载，不进行释放处理`);
                }
                cache.finishCb.push(onComplete);
            }
            //重新复位资源状态
            cache.status = Resource_1.Resource.CacheStatus.NONE;
        }
        else {
            //无缓存信息
            cache = new Resource_1.Resource.CacheData();
            cache.info.url = path;
            cache.info.type = type;
            cache.info.bundle = bundle;
            App.cache.set(bundle, path, cache);
            console.time(`加载资源 : ${cache.info.url}`);
            //先到释放管理器中查找 
            let res = App.releaseManger.get(bundle, path);
            if (res) {
                this._onLoadComplete(cache, onComplete, null, res);
                return;
            }
            let _bundle = this.getBundle(bundle);
            if (!_bundle) {
                //如果bundle不存在
                let error = new Error(`${this.module} ${bundle} 没有加载，请先加载`);
                this._onLoadComplete(cache, onComplete, error, null);
                return;
            }
            res = _bundle.get(path, type);
            if (res) {
                this._onLoadComplete(cache, onComplete, null, res);
            }
            else {
                if (onProgress) {
                    _bundle.load(path, type, onProgress, this._onLoadComplete.bind(this, cache, onComplete));
                }
                else {
                    _bundle.load(path, type, this._onLoadComplete.bind(this, cache, onComplete));
                }
            }
        }
    }
    _onLoadComplete(cache, complete, err, data) {
        cache.isLoaded = true;
        //添加引用关系
        let tempCache = cache;
        if (err) {
            Log.e(`${this.module}加载资源失败:${cache.info.url} 原因:${err.message ? err.message : "未知"}`);
            cache.data = null;
            tempCache.data = null;
            App.cache.remove(cache.info.bundle, cache.info.url);
            complete(cache);
        }
        else {
            if (env_1.DEBUG)
                Log.d(`${this.module}加载资源成功:${cache.info.url}`);
            cache.data = data;
            tempCache.data = data;
            complete(cache);
        }
        //加载过程，有不同地方调用过来加载同一个资源的地方，都回调回去
        cache.doFinish(tempCache);
        cache.doGet(tempCache.data);
        if (cache.status == Resource_1.Resource.CacheStatus.WAITTING_FOR_RELEASE) {
            if (env_1.DEBUG)
                Log.w(this.module, `资源:${cache.info.url}加载完成，但缓存状态为等待销毁，销毁资源`);
            if (cache.data) {
                cache.status = Resource_1.Resource.CacheStatus.NONE;
                let info = new Resource_1.Resource.Info;
                info.url = cache.info.url;
                info.type = cache.info.type;
                info.data = cache.data;
                info.bundle = cache.info.bundle;
                this.releaseAsset(info);
            }
        }
        console.timeEnd(`加载资源 : ${cache.info.url}`);
    }
    loadDir(bundle, path, type, onProgress, onComplete) {
        if (env_1.DEBUG) {
            Log.d(`load bundle : ${bundle} path : ${path}`);
        }
        let cache = App.cache.get(bundle, path);
        if (cache) {
            //存在缓存信息
            if (cache.isLoaded) {
                //已经加载完成
                if (env_1.DEBUG && cache.status == Resource_1.Resource.CacheStatus.WAITTING_FOR_RELEASE) {
                    Log.w(this.module, `资源:${path} 等待释放，但资源已经加载完成，此时有人又重新加载，不进行释放处理`);
                }
                //加载完成
                onComplete(cache);
            }
            else {
                if (env_1.DEBUG && cache.status == Resource_1.Resource.CacheStatus.WAITTING_FOR_RELEASE) {
                    Log.w(this.module, `资源:${path}等待释放，但资源处理加载过程中，此时有人又重新加载，不进行释放处理`);
                }
                cache.finishCb.push(onComplete);
            }
            //重新复位资源状态
            cache.status = Resource_1.Resource.CacheStatus.NONE;
        }
        else {
            //无缓存信息
            cache = new Resource_1.Resource.CacheData();
            cache.info.url = path;
            cache.info.type = type;
            cache.info.bundle = bundle;
            App.cache.set(bundle, path, cache);
            console.time(`加载资源 : ${cache.info.url}`);
            let res = App.releaseManger.get(bundle, path);
            if (res) {
                this._onLoadComplete(cache, onComplete, null, res);
                return;
            }
            let _bundle = this.getBundle(bundle);
            if (!_bundle) {
                //如果bundle不存在
                let error = new Error(`${this.module} ${bundle} 没有加载，请先加载`);
                this._onLoadComplete(cache, onComplete, error, null);
                return;
            }
            if (onProgress) {
                _bundle.loadDir(path, type, onProgress, this._onLoadComplete.bind(this, cache, onComplete));
            }
            else {
                _bundle.loadDir(path, type, this._onLoadComplete.bind(this, cache, onComplete));
            }
        }
    }
    releaseAsset(info) {
        if (info && info.bundle) {
            let cache = App.cache.get(info.bundle, info.url, false);
            if (!cache) {
                return;
            }
            else {
                if (cache.isInvalid) {
                    if (env_1.DEBUG)
                        Log.w(`资源已经释放 url : ${info.url}`);
                    return;
                }
            }
            if (cache.isLoaded) {
                if (cache.info.retain) {
                    if (env_1.DEBUG)
                        Log.d(`常驻资源 url : ${cache.info.url}`);
                    return;
                }
                if (App.cache.removeWithInfo(info)) {
                    App.releaseManger.release(info);
                }
                else {
                    if (env_1.DEBUG) {
                        if (Array.isArray(info.data)) {
                            for (let i = 0; i < info.data.length; i++) {
                                if (info.data[i].refCount > 0) {
                                    Log.w(`资源bundle : ${info.bundle} url : ${info.url}/${info.data[i].name} 被其它界面引用 refCount : ${info.data[i].refCount}`);
                                }
                            }
                        }
                        else {
                            Log.w(`资源bundle : ${info.bundle} url : ${info.url} 被其它界面引用 refCount : ${info.data.refCount}`);
                        }
                    }
                }
            }
            else {
                cache.status = Resource_1.Resource.CacheStatus.WAITTING_FOR_RELEASE;
                if (env_1.DEBUG)
                    Log.w(`${cache.info.url} 正在加载，等待加载完成后进行释放`);
            }
        }
    }
    retainAsset(info) {
        if (info) {
            let cache = App.cache.get(info.bundle, info.url);
            if (cache) {
                if (env_1.DEBUG) {
                    if (info.data != cache.data) {
                        Log.e(`错误的retainAsset :${info.url}`);
                    }
                }
                if (!cache.info.retain) {
                    cache.info.retain = info.retain;
                }
                if (Array.isArray(cache.data)) {
                    //里面是数组 
                    for (let i = 0; i < cache.data.length; i++) {
                        cache.data[i] && cache.data[i].addRef();
                    }
                }
                else {
                    cache.data && cache.data.addRef();
                }
            }
            else {
                if (env_1.DEBUG)
                    Log.e(`retainAsset cache.data is null`);
            }
        }
        else {
            if (env_1.DEBUG)
                Log.e(`retainAsset info is null`);
        }
    }
    /**
     * @description 添加常驻资源
     * @param prefab
     */
    addPersistAsset(url, data, bundle) {
        let info = new Resource_1.Resource.Info;
        info.url = url;
        info.data = data;
        info.bundle = bundle;
        info.retain = true;
        this.retainAsset(info);
    }
}
exports._AssetManager = _AssetManager;
_AssetManager.module = "【AssetManager】";
