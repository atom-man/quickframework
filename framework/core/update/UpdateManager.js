"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateManager = void 0;
const Update_1 = require("./Update");
const cc_1 = require("cc");
const env_1 = require("cc/env");
const Macros_1 = require("../../defines/Macros");
const HttpClient_1 = require("../net/http/HttpClient");
const UpdateItem_1 = require("./UpdateItem");
const VERSION_FILENAME = "versions.json";
/**
 * @description 热更新组件
 */
class UpdateManager {
    constructor() {
        this.isResident = true;
        this.module = null;
        /**@description 所有下载项 */
        this.items = [];
        /**@description 当前项 */
        this.current = null;
        this._hotUpdateUrl = "";
        /**@description 是否路过热更新 */
        this.isSkipCheckUpdate = false;
        /**@description 资源管理器 */
        this.assetsManagers = {};
        /**@description 预处理版本信息 */
        this.preVersions = {};
        /**@description 远程所有版本信息 */
        this.remoteVersions = {};
        /**@description 默认版本 */
        this.defaultVersion = "1.0";
        /**@description 默认md5 */
        this.defaultMD5 = Macros_1.Macro.UNKNOWN;
        /**@description 主包包含资源目录,固定的，请勿修改 */
        this.mainBundles = ["src", "jsb-adapter", "assets/resources", "assets/main", "assets/internal", "main.js"];
        /**@description 是否使用了自动版本 */
        this.isAutoVersion = true;
    }
    /**@description 本地存储热更新文件的路径,注意，该路径不能变动，Game.cpp中已经写了，如果要变动，需要连C++层一起改 */
    get storagePath() {
        return cc_1.native.fileUtils.getWritablePath() + "caches/";
    }
    /**@description 通用的热更新地址，当在子游戏或大厅未指定热更新地址时，都统一使用服务器传回来的默认全局更新地址 */
    get hotUpdateUrl() {
        Log.d(`当前热更新地址为:${this._hotUpdateUrl}`);
        return this._hotUpdateUrl;
    }
    set hotUpdateUrl(value) {
        this._hotUpdateUrl = value;
    }
    /**@description 是否是预览或浏览器 */
    get isBrowser() {
        return cc_1.sys.platform == cc_1.sys.Platform.WECHAT_GAME || env_1.PREVIEW || cc_1.sys.isBrowser;
    }
    /**@description 获取资源管理器，默认为hall 大厅的资源管理器 */
    getAssetsManager(item) {
        //初始化资源管理器
        let name = item.convertBundle(item.bundle);
        if (env_1.JSB) {
            if (!this.assetsManagers[name]) {
                this.assetsManagers[name] = new Update_1.Update.AssetsManager(name, this.storagePath);
                //设置下载并发量
                this.assetsManagers[name].manager.setPackageUrl(this.hotUpdateUrl);
                this.assetsManagers[name].manager.setMainBundles(this.mainBundles);
                //设置重新下载的标准
                this.assetsManagers[name].manager.setDownloadAgainZip(0.8);
            }
        }
        return this.assetsManagers[name];
    }
    /**@description 下载update项，以最新的为当前操作的对象 */
    dowonLoad(item) {
        if (item.isSkipUpdate) {
            item.handler.onLoadBundle(item);
        }
        else {
            this.current = this.getItem(item);
            if (this.current) {
                if (this.current.isUpdating) {
                    Log.d(`${item.bundle} 正在更新中...`);
                    this.current.handler.onShowUpdating(this.current);
                }
                else {
                    Log.d(`${item.bundle} 不在更新状态，进入更新...`);
                    this._dowonLoad(item);
                }
            }
            else {
                Log.d(`${item.bundle} 放入下载队列中...`);
                this.items.push(item);
                this._dowonLoad(item);
            }
        }
    }
    _dowonLoad(item) {
        return __awaiter(this, void 0, void 0, function* () {
            this.current = item;
            let isOk = yield this.loadVersions(this.current);
            if (isOk) {
                let status = this.getStatus(item.bundle);
                if (status == Update_1.Update.Status.UP_TO_DATE) {
                    item.state = Update_1.Update.State.UP_TO_DATE;
                    if (item.bundle == Macros_1.Macro.BUNDLE_HALL && this.isMd5Change(Update_1.Update.MAIN_PACK)) {
                        //大厅已经是最新，需要检测主包是否有更新
                        Log.d(`进入${item.bundle} 时，需要更新主包`);
                        item.handler.onNeedUpdateMain(item);
                    }
                    else {
                        Log.d(`${item.bundle} 已经是最新，直接进入...`);
                        item.handler.onLoadBundle(item);
                    }
                }
                else {
                    Log.d(`${item.bundle} 进入检测更新...`);
                    item.state = Update_1.Update.State.READY_TO_UPDATE;
                    item.checkUpdate();
                }
            }
        });
    }
    getItem(item) {
        if (item instanceof UpdateItem_1.UpdateItem) {
            return this._getItem(item.bundle);
        }
        else {
            let temp = this._getItem(item.bundle);
            if (temp == null) {
                temp = new UpdateItem_1.UpdateItem(item);
            }
            return temp;
        }
    }
    _getItem(bundle) {
        for (let i = 0; i < this.items.length; i++) {
            if (bundle == this.items[i].bundle) {
                return this.items[i];
            }
        }
        return null;
    }
    checkAllowUpdate(item, code) {
        //非主包检测更新
        //有新版本，看下是否与主包版本匹配
        let md5 = item.remoteMd5;
        let versionInfo = this.preVersions[item.updateName];
        if (versionInfo == undefined || versionInfo == null) {
            Log.e(`预处理版本未存在!!!!`);
            return Update_1.Update.Code.PRE_VERSIONS_NOT_FOUND;
        }
        else {
            //先检查主包是否需要更新
            if (versionInfo.md5 == md5) {
                //主包无需要更新
                Log.d(`${item.bundle} 将要下载版本 md5 与远程版本 md5 相同，可以下载 version : ${versionInfo.version} md5:${versionInfo.md5}`);
            }
            else {
                if (item.bundle == Macros_1.Macro.BUNDLE_HALL) {
                    //如果是大厅更新，只要主包的md5不发生变化，则可以直接更新大厅
                    Log.d(`${item.bundle} 更新`);
                    if (this.isMd5Change(Update_1.Update.MAIN_PACK)) {
                        Log.d(`更新${item.bundle}时，主包有更新，需要先更新主包`);
                        code = Update_1.Update.Code.MAIN_PACK_NEED_UPDATE;
                    }
                    else {
                        Log.d(`更新${item.bundle}时，主包无更新，直接更新进入`);
                    }
                }
                else {
                    //更新其它子包，只需要大厅的md5及主包md5没有变化，即可直接更新进入bundle
                    if (this.isMd5Change(Update_1.Update.MAIN_PACK) || this.isMd5Change(Macros_1.Macro.BUNDLE_HALL)) {
                        Log.d(`更新${item.bundle}时，主包与大厅有更新，下载 md5 :${md5} 与预处理md5不一致，需要对主包先进行更新`);
                        code = Update_1.Update.Code.MAIN_PACK_NEED_UPDATE;
                    }
                    else {
                        Log.e(`更新${item.bundle}时，主包与大厅无更新，可直接下载更新！！`);
                    }
                }
            }
            return code;
        }
    }
    /**@description 检测主包md5 */
    checkMainMd5(item, code) {
        Log.d(`${item.bundle} 无更新，检测主包md5是否变化，如果变更，需要提示玩家更新主包`);
        if (this.isMd5Change(Update_1.Update.MAIN_PACK)) {
            Log.d(`进入${item.bundle}时，主包有更新，需要先更新主包`);
            code = Update_1.Update.Code.MAIN_PACK_NEED_UPDATE;
        }
        return code;
    }
    /**
     * @description 获取当前bundle的状态
     * @param bundle bundle名
     * @returns
     */
    getStatus(bundle) {
        if (this.isBrowser || this.isSkipCheckUpdate) {
            //浏览器无更新
            return Update_1.Update.Status.UP_TO_DATE;
        }
        bundle = this.convertBundle(bundle);
        let versionInfo = this.getVersionInfo(bundle);
        if (versionInfo) {
            if (versionInfo.md5 == this.remoteVersions[bundle].md5) {
                return Update_1.Update.Status.UP_TO_DATE;
            }
            return Update_1.Update.Status.NEED_UPDATE;
        }
        else {
            return Update_1.Update.Status.NEED_DOWNLOAD;
        }
    }
    /**@description app 版本号 */
    get appVersion() {
        if (this.isBrowser) {
            return this.defaultVersion;
        }
        else {
            let path = `${Update_1.Update.MANIFEST_ROOT}$apk.json`;
            let dataStr = this.getString(path);
            if (dataStr) {
                let data = JSON.parse(dataStr);
                return `v${data.version}`;
            }
            else {
                Log.e(`${this.module}无法读取到${path}`);
                return this.defaultVersion;
            }
        }
    }
    /**
     * @description 返回当前bundle的md5
     * @param bundle
     */
    getMd5(bundle) {
        if (this.isBrowser) {
            return this.defaultMD5;
        }
        else {
            bundle = this.convertBundle(bundle);
            let versionInfo = this.getVersionInfo(bundle);
            if (versionInfo) {
                return `${versionInfo.md5}`;
            }
            else {
                if (this.remoteVersions[bundle]) {
                    Log.w(`${this.module}本地无版本信息,返回远程版本${this.remoteVersions[bundle].md5}`);
                    return `${this.remoteVersions[bundle].md5}`;
                }
                else {
                    Log.e(`${this.module}远程无版本信息，返回默认版本${this.defaultMD5}`);
                    return this.defaultMD5;
                }
            }
        }
    }
    /**
     * @description 获取版本号,此版本号只是显示用，该热更新跟版本号无任何关系
     * @param bundle
     */
    getVersion(bundle) {
        if (this.isBrowser) {
            return this.defaultVersion;
        }
        else {
            bundle = this.convertBundle(bundle);
            if (this.isAutoVersion) {
                ///如果使用了自动版本，所有的版本号都是一致的,都使用主包版本号
                bundle = Macros_1.Macro.MAIN_PACK_BUNDLE_NAME;
            }
            let versionInfo = this.getVersionInfo(bundle);
            if (versionInfo) {
                return `${versionInfo.version}`;
            }
            else {
                if (this.remoteVersions[bundle]) {
                    Log.w(`${this.module}本地无版本信息,返回远程版本${this.remoteVersions[bundle].version}`);
                    return `${this.remoteVersions[bundle].version}`;
                }
                else {
                    Log.e(`${this.module}远程无版本信息，返回默认版本${this.defaultVersion}`);
                    return this.defaultVersion;
                }
            }
        }
    }
    /**
     * @description md5是否发生变化
     * @param bundle
     */
    isMd5Change(bundle) {
        bundle = this.convertBundle(bundle);
        if (this.preVersions[bundle] && this.remoteVersions[bundle] && this.preVersions[bundle].md5 != this.remoteVersions[bundle].md5) {
            return true;
        }
        return false;
    }
    getString(path) {
        //下载缓存中
        let cachedPath = `${this.storagePath}${path}`;
        if (cc_1.native.fileUtils.isFileExist(cachedPath)) {
            return cc_1.native.fileUtils.getStringFromFile(cachedPath);
        }
        else {
            //包内
            if (cc_1.native.fileUtils.isFileExist(path)) {
                return cc_1.native.fileUtils.getStringFromFile(path);
            }
            else {
                return undefined;
            }
        }
    }
    getVersionString(bundle) {
        bundle = this.convertBundle(bundle);
        let path = `${Update_1.Update.MANIFEST_ROOT}${bundle}_version.json`;
        return this.getString(path);
    }
    getProjectString(bundle) {
        bundle = this.convertBundle(bundle);
        let path = `${Update_1.Update.MANIFEST_ROOT}${bundle}_project.json`;
        return this.getString(path);
    }
    getVersionInfo(bundle) {
        let content = this.getVersionString(bundle);
        if (content) {
            let obj = JSON.parse(content);
            return obj;
        }
        return undefined;
    }
    /**
     * @description 热更新初始化,先读取本地的所有版本信息，再拉取远程所有的版本信息
     * */
    loadVersions(item) {
        return new Promise((resolove, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.isBrowser) {
                resolove(true);
                return;
            }
            item.state = Update_1.Update.State.PREDOWNLOAD_VERSION;
            item.handler.onShowUpdating(item);
            Log.d(`${this.module} 请求远程版本信息`);
            let data = yield this.readRemoteVersions();
            if (data) {
                this.remoteVersions = JSON.parse(data);
                let bundle = item.convertBundle(item.bundle);
                if (bundle == Update_1.Update.MAIN_PACK && this.getStatus(bundle) == Update_1.Update.Status.UP_TO_DATE) {
                    Log.d(`${this.module} 主包已经是最新，写入远程的版本信息`);
                    this.savePreVersions();
                    //主包更新完成，清除路径缓存信息;
                    cc_1.native.fileUtils.purgeCachedEntries();
                }
                Log.d(`${this.module} 加载${item.bundle}时，加载远程版本信息成功...`);
                item.state = Update_1.Update.State.VERSION_LOADED;
                resolove(true);
            }
            else {
                this.remoteVersions = {};
                item.state = Update_1.Update.State.FAIL_TO_UPDATE;
                item.code = Update_1.Update.Code.PRE_VERSIONS_NOT_FOUND;
                item.handler.onPreVersionFailed(item);
                Log.e(`${this.module} 加载${item.bundle}时，加载远程版本信息失败...`);
                resolove(false);
            }
        }));
    }
    /**
     * @description 转换成热更新bundle
     * @param bundle
     * @returns
     */
    convertBundle(bundle) {
        if (bundle == Macros_1.Macro.BUNDLE_RESOURCES) {
            return Update_1.Update.MAIN_PACK;
        }
        return bundle;
    }
    /**@description 读取远程版本文件 */
    readRemoteVersions() {
        return new Promise((resolove) => {
            let httpPackage = new HttpClient_1.HttpPackage;
            httpPackage.data.url = `${this.hotUpdateUrl}/${Update_1.Update.MANIFEST_ROOT}${VERSION_FILENAME}`;
            httpPackage.data.isAutoAttachCurrentTime = true;
            httpPackage.send((data) => {
                resolove(data);
            }, (err) => {
                Log.dump(err);
                resolove(null);
            });
        });
    }
    savePreVersions() {
        // 到了这个位置，说明 this.remoteVersions 已经有数据了
        if (Object.keys(this.remoteVersions).length > 0) {
            Log.d(`${this.module} 保存远程版本信息如下:`);
            let versions = JSON.stringify(this.remoteVersions);
            Log.d(versions);
            this.preVersions = JSON.parse(versions);
        }
        else {
            Log.e(`${this.module} 致命更新错误,无法读取到远程版本信息!!!`);
        }
    }
    debug() {
        Log.d(`-----------热火更新管理器中相关信息------------`);
        Log.dump({ name: "预处理版本信息", data: this.preVersions });
        Log.dump({ name: "远程版本信息", data: this.remoteVersions });
    }
}
exports.UpdateManager = UpdateManager;
UpdateManager.module = "【更新管理器】";
