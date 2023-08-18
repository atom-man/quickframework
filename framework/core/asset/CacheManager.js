"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const env_1 = require("cc/env");
const cc_1 = require("cc");
const Resource_1 = require("./Resource");
const Macros_1 = require("../../defines/Macros");
class ResourceCache {
    constructor(name) {
        this._caches = new Map();
        this.name = Macros_1.Macro.UNKNOWN;
        this.name = name;
    }
    get(path, isCheck) {
        if (this._caches.has(path)) {
            let cache = this._caches.get(path);
            if (isCheck && cache && cache.isInvalid) {
                //资源已经释放
                Log.w(`资源加载完成，但已经被释放 , 重新加载资源 : ${path}`);
                this.remove(path);
                return null;
            }
            return this._caches.get(path);
        }
        return null;
    }
    set(path, data) {
        this._caches.set(path, data);
    }
    remove(path) {
        return this._caches.delete(path);
    }
    removeUnuseCaches() {
        this._caches.forEach((value, key, origin) => {
            if (Array.isArray(value.data)) {
                let isAllDelete = true;
                for (let i = 0; i < value.data.length; i++) {
                    if (value.data[i] && value.data[i].refCount > 0) {
                        isAllDelete = false;
                    }
                }
                if (isAllDelete) {
                    this._caches.delete(key);
                    if (env_1.DEBUG)
                        Log.d(`删除不使用的资源目录 bundle : ${this.name} dir : ${key}`);
                }
            }
            else {
                if (value.data && value.data.refCount <= 0) {
                    this._caches.delete(key);
                    if (env_1.DEBUG)
                        Log.d(`删除不使用的资源 bundle : ${this.name} url : ${key}`);
                }
            }
        });
    }
    get size() {
        return this._caches.size;
    }
    debug() {
        let key = this.name;
        let caches = this._caches;
        if (env_1.DEBUG)
            Log.d(`----------------Bundle ${key} 资源缓存信息开始----------------`);
        let content = [];
        let invalidContent = [];
        caches.forEach((data, key, source) => {
            let itemContent = {
                url: data.info.url,
                isLoaded: data.isLoaded,
                isValid: (0, cc_1.isValid)(data.data),
                assetType: cc_1.js.getClassName(data.info.type),
                data: data.data ? cc_1.js.getClassName(data.data) : null,
                status: data.status
            };
            let item = { url: key, data: itemContent };
            if (data.isLoaded && data.data && !(0, cc_1.isValid)(data.data)) {
                invalidContent.push(item);
            }
            else {
                content.push(item);
            }
        });
        if (content.length > 0) {
            Log.d(`----------- 有效缓存信息 -----------`);
            Log.d(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
            Log.d(`----------- 无效缓存信息 -----------`);
            Log.d(JSON.stringify(invalidContent));
        }
        if (env_1.DEBUG)
            Log.d(`----------------Bundle ${key} 资源缓存信息结束----------------`);
    }
}
class CacheInfo {
    constructor() {
        this.refCount = 0;
        this.url = "";
        /**@description 是否常驻于内存中 */
        this.retain = false;
    }
}
class RemoteCaches {
    constructor() {
        this._caches = new Map();
        this._spriteFrameCaches = new Map();
        this._resMap = new Map();
    }
    /**
     * @description 获取远程缓存数据
     * @param type 远程奖状类型
     * @param url 远程地址
     */
    get(url) {
        if (this._caches.has(url)) {
            return this._caches.get(url);
        }
        return null;
    }
    getSpriteFrame(url) {
        if (this._spriteFrameCaches.has(url)) {
            let cache = this._spriteFrameCaches.get(url);
            let texture2D = this.get(url);
            if (texture2D) {
                return cache;
            }
            else {
                this.remove(url);
                return null;
            }
        }
        return null;
    }
    setSpriteFrame(url, data) {
        if (data && data instanceof cc_1.ImageAsset) {
            //同一图片加载两次也会回调到这里，这里如果当前精灵缓存中有，不在重新创建
            let spriteFrame = this.getSpriteFrame(url);
            if (spriteFrame) {
                return (spriteFrame.data);
            }
            let cache = new Resource_1.Resource.CacheData();
            let sp = new cc_1.SpriteFrame();
            let texture = new cc_1.Texture2D();
            texture.image = data;
            sp.texture = texture;
            cache.data = sp;
            cache.isLoaded = true;
            cache.info.url = url;
            this._spriteFrameCaches.set(url, cache);
            return (cache.data);
        }
        return null;
    }
    set(url, data) {
        data.info.url = url;
        this._caches.set(url, data);
    }
    _getCacheInfo(info, isNoFoundCreate = true) {
        if (info && info.url && info.url.length > 0) {
            if (!this._resMap.has(info.url)) {
                if (isNoFoundCreate) {
                    let cache = new CacheInfo;
                    cache.url = info.url;
                    this._resMap.set(info.url, cache);
                }
                else {
                    return null;
                }
            }
            return this._resMap.get(info.url);
        }
        return null;
    }
    retainAsset(info) {
        if (info && info.data) {
            let cache = this._getCacheInfo(info);
            if (cache) {
                if (cache.retain) {
                    if (!info.retain) {
                        if (env_1.DEBUG)
                            Log.w(`资源 : ${info.url} 已经被设置成常驻资源，不能改变其属性`);
                    }
                }
                else {
                    cache.retain = info.retain;
                }
                info.data.addRef();
                cache.refCount++;
                if (cache.retain) {
                    cache.refCount = 999999;
                }
            }
        }
    }
    releaseAsset(info) {
        if (info && info.data) {
            let cache = this._getCacheInfo(info, false);
            if (cache) {
                if (cache.retain) {
                    //常驻内存中
                    return;
                }
                cache.refCount--;
                if (cache.refCount <= 0) {
                    this.remove(cache.url);
                }
            }
        }
    }
    remove(url) {
        this._resMap.delete(url);
        //先删除精灵帧
        if (this._spriteFrameCaches.has(url)) {
            //先释放引用计数
            this._spriteFrameCaches.get(url).data.decRef(false);
            this._spriteFrameCaches.delete(url);
            if (env_1.DEBUG)
                Log.d(`remove remote sprite frames resource url : ${url}`);
        }
        let cache = this._caches.has(url) ? this._caches.get(url) : null;
        if (cache && cache.data instanceof cc_1.sp.SkeletonData) {
            //这里面需要删除加载进去的三个文件缓存 
            this.remove(`${cache.info.url}.atlas`);
            this.remove(`${cache.info.url}.png`);
            this.remove(`${cache.info.url}.json`);
        }
        if (cache && cache.data instanceof cc_1.Asset) {
            if (env_1.DEBUG)
                Log.d(`释放加载的本地远程资源:${cache.info.url}`);
            cache.data.decRef(false);
            cache.info.data = cache.data;
            App.releaseManger.releaseRemote(cache.info);
        }
        if (env_1.DEBUG)
            Log.d(`remove remote cache url : ${url}`);
        return this._caches.delete(url);
    }
    debug() {
        let spCaches = this._spriteFrameCaches;
        let caches = this._caches;
        let infos = this._resMap;
        Log.d(`---- 远程加载资源缓存信息 ----`);
        let content = [];
        let invalidContent = [];
        spCaches.forEach((data, key, source) => {
            let itemContent = { url: data.info.url, isLoaded: data.isLoaded, isValid: (0, cc_1.isValid)(data.data), assetType: cc_1.js.getClassName(data.info.type), data: data.data ? cc_1.js.getClassName(data.data) : null, status: data.status };
            let item = { url: key, data: itemContent };
            if (data.isLoaded && ((data.data && !(0, cc_1.isValid)(data.data)) || !data.data)) {
                invalidContent.push(item);
            }
            else {
                content.push(item);
            }
        });
        if (content.length > 0) {
            Log.d(`----------------有效 spriteFrame 缓存信息------------------`);
            Log.d(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
            Log.d(`----------------无效 spriteFrame 缓存信息------------------`);
            Log.d(JSON.stringify(invalidContent));
        }
        content = [];
        invalidContent = [];
        caches.forEach((data, key, source) => {
            let itemContent = { url: data.info.url, isLoaded: data.isLoaded, isValid: (0, cc_1.isValid)(data.data), assetType: cc_1.js.getClassName(data.info.type), data: data.data ? cc_1.js.getClassName(data.data) : null, status: data.status };
            let item = { url: key, data: itemContent };
            if (data.isLoaded && data.data && !(0, cc_1.isValid)(data.data)) {
                invalidContent.push(item);
            }
            else {
                content.push(item);
            }
        });
        if (content.length > 0) {
            Log.d(`----------------有效缓存信息------------------`);
            Log.d(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
            Log.d(`----------------无效缓存信息------------------`);
            Log.d(JSON.stringify(invalidContent));
        }
        if (infos.size > 0) {
            Log.d(`----------------当前资源引用计数信息------------------`);
            content = [];
            infos.forEach((value, key) => {
                let item = { url: key, data: { refCount: value.refCount, url: value.url, retain: value.retain } };
                content.push(item);
            });
            Log.d(JSON.stringify(content));
        }
    }
}
class CacheManager {
    constructor() {
        this.isResident = true;
        this.module = null;
        this._bundles = new Map();
        this._remoteCaches = new RemoteCaches();
    }
    get remoteCaches() { return this._remoteCaches; }
    getBundleName(bundle) {
        return App.bundleManager.getBundleName(bundle);
    }
    /**
     * @description 同步获取资源缓存，此接口不会检查资源的状态，只要建立了缓存，就会立即返回
     * @param bundle bundle名
     * @param path 资源路径
     * @param isCheck 是否检查资源有效性，当为ture时，会检查资源是否有效，如果有效直接返回，如果无效，则返回nll
     * @returns
     */
    get(bundle, path, isCheck = true) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) {
            return this._bundles.get(bundleName).get(path, isCheck);
        }
        return null;
    }
    set(bundle, path, data) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName) {
            if (!this._bundles.has(bundleName)) {
                let cache = new ResourceCache(bundleName);
                cache.set(path, data);
                this._bundles.set(bundleName, cache);
            }
            else {
                this._bundles.get(bundleName).set(path, data);
            }
        }
    }
    /**
     * @description
     * @param bundle bundle
     * @param path path
     */
    remove(bundle, path) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) {
            return this._bundles.get(bundleName).remove(path);
        }
        return false;
    }
    removeWithInfo(info) {
        if (info) {
            if (info.data) {
                if (Array.isArray(info.data)) {
                    let isAllDelete = true;
                    for (let i = 0; i < info.data.length; i++) {
                        info.data[i].decRef(false);
                        if (info.data[i].refCount != 0) {
                            isAllDelete = false;
                        }
                    }
                    if (isAllDelete) {
                        this.remove(info.bundle, info.url);
                        return true;
                    }
                }
                else {
                    info.data.decRef(false);
                    if (info.data.refCount == 0) {
                        this.remove(info.bundle, info.url);
                        return true;
                    }
                }
            }
            else {
                Log.e(`info.data is null , bundle : ${info.bundle} url : ${info.url}`);
            }
        }
        else {
            Log.e(`info is null`);
        }
        return false;
    }
    removeBundle(bundle) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) {
            if (env_1.DEBUG) {
                Log.d(`移除bundle cache : ${bundleName}`);
                let data = this._bundles.get(bundleName);
                this._removeUnuseCaches();
                if (data && data.size > 0) {
                    Log.e(`移除bundle ${bundleName} 还有未释放的缓存`);
                }
            }
            this._bundles.delete(bundleName);
        }
    }
    _removeUnuseCaches() {
        this._bundles.forEach((value, key, origin) => {
            if (value) {
                value.removeUnuseCaches();
            }
        });
    }
    _getGetCacheByAsyncArgs() {
        if (arguments.length < 3) {
            if (env_1.DEBUG)
                Log.e(`${this.module}参数传入有误，必须两个参数`);
            return null;
        }
        if (typeof arguments[0] != "string") {
            if (env_1.DEBUG)
                Log.e(`${this.module}传入第一个参数有误,必须是string`);
            return null;
        }
        if (!cc_1.js.isChildClassOf(arguments[1], cc_1.Asset)) {
            if (env_1.DEBUG)
                Log.e(`${this.module}传入的第二个参数有误,必须是cc.Asset的子类`);
            return null;
        }
        return { url: arguments[0], type: arguments[1], bundle: arguments[2] };
    }
    getCache() {
        let args = arguments;
        let me = this;
        return new Promise((resolve) => {
            let _args = me._getGetCacheByAsyncArgs.apply(me, args);
            if (!_args) {
                resolve(null);
                return;
            }
            let cache = me.get(_args.bundle, _args.url);
            if (cache) {
                if (cache.isLoaded) {
                    //已经加载完成
                    if (_args.type) {
                        if (cache.data instanceof _args.type) {
                            resolve(cache.data);
                        }
                        else {
                            if (env_1.DEBUG)
                                Log.e(`${this.module}传入类型:${cc_1.js.getClassName(_args.type)}与资源实际类型: ${cc_1.js.getClassName(cache.data)}不同 url : ${cache.info.url}`);
                            resolve(null);
                        }
                    }
                    else {
                        resolve(cache.data);
                    }
                }
                else {
                    //加载中
                    cache.getCb.push(resolve);
                }
            }
            else {
                resolve(null);
            }
        });
    }
    getCacheByAsync() {
        let me = this;
        let args = this._getGetCacheByAsyncArgs.apply(this, arguments);
        return new Promise((resolve) => {
            if (!args) {
                resolve(null);
                return;
            }
            me.getCache(args.url, args.type, args.bundle).then((data) => {
                args = args;
                if (data && data instanceof args.type) {
                    resolve(data);
                }
                else {
                    //加载资源
                    App.asset.load(args.bundle, args.url, args.type, null, (cache) => {
                        args = args;
                        if (cache && cache.data && cache.data instanceof args.type) {
                            resolve(cache.data);
                        }
                        else {
                            Log.e(`${this.module}加载失败 : ${args.url}`);
                            resolve(null);
                        }
                    });
                }
            });
        });
    }
    getSpriteFrameByAsync(urls, key, view, addExtraLoadResource, bundle) {
        let me = this;
        return new Promise((resolve) => {
            let nIndex = 0;
            let getFun = (url) => {
                me.getCacheByAsync(url, cc_1.SpriteAtlas, bundle).then((atlas) => {
                    let info = new Resource_1.Resource.Info;
                    info.url = url;
                    info.type = cc_1.SpriteAtlas;
                    info.data = atlas;
                    info.bundle = bundle;
                    addExtraLoadResource(view, info);
                    if (atlas) {
                        let spriteFrame = atlas.getSpriteFrame(key);
                        if (spriteFrame) {
                            if ((0, cc_1.isValid)(spriteFrame)) {
                                resolve({ url: url, spriteFrame: spriteFrame });
                            }
                            else {
                                //来到这里面，其实程序已经崩溃了，已经没什么意思，也不知道写这个有啥用，尽量安慰,哈哈哈
                                Log.e(`精灵帧被释放，释放当前无法的图集资源 url ：${url} key : ${key}`);
                                App.asset.releaseAsset(info);
                                resolve({ url: url, spriteFrame: null, isTryReload: true });
                            }
                        }
                        else {
                            nIndex++;
                            if (nIndex >= urls.length) {
                                resolve({ url: url, spriteFrame: null });
                            }
                            else {
                                getFun(urls[nIndex]);
                            }
                        }
                    }
                    else {
                        resolve({ url: url, spriteFrame: null });
                    }
                });
            };
            getFun(urls[nIndex]);
        });
    }
    debug() {
        this._bundles.forEach(v => {
            v.debug();
        });
        this.remoteCaches.debug();
    }
}
exports.CacheManager = CacheManager;
CacheManager.module = "【缓存管理器】";
