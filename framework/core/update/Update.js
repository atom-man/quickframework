"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = void 0;
const cc_1 = require("cc");
const Macros_1 = require("../../defines/Macros");
/**@description 热更新相关*/
var Update;
(function (Update) {
    Update.MAIN_PACK = Macros_1.Macro.MAIN_PACK_BUNDLE_NAME;
    Update.MANIFEST_ROOT = "manifest/";
    let Code;
    (function (Code) {
        /**@description 找不到本地mainfest文件*/
        Code[Code["ERROR_NO_LOCAL_MANIFEST"] = 0] = "ERROR_NO_LOCAL_MANIFEST";
        /**@description 下载manifest文件错误 */
        Code[Code["ERROR_DOWNLOAD_MANIFEST"] = 1] = "ERROR_DOWNLOAD_MANIFEST";
        /**@description 解析manifest文件错误 */
        Code[Code["ERROR_PARSE_MANIFEST"] = 2] = "ERROR_PARSE_MANIFEST";
        /**@description 找到新版本 */
        Code[Code["NEW_VERSION_FOUND"] = 3] = "NEW_VERSION_FOUND";
        /**@description 当前已经是最新版本 */
        Code[Code["ALREADY_UP_TO_DATE"] = 4] = "ALREADY_UP_TO_DATE";
        /**@description 更新下载进度中 */
        Code[Code["UPDATE_PROGRESSION"] = 5] = "UPDATE_PROGRESSION";
        /**@description 资源更新中 */
        Code[Code["ASSET_UPDATED"] = 6] = "ASSET_UPDATED";
        /**@description 更新错误 */
        Code[Code["ERROR_UPDATING"] = 7] = "ERROR_UPDATING";
        /**@description 更新完成 */
        Code[Code["UPDATE_FINISHED"] = 8] = "UPDATE_FINISHED";
        /**@description 更新失败 */
        Code[Code["UPDATE_FAILED"] = 9] = "UPDATE_FAILED";
        /**@description 解压资源失败 */
        Code[Code["ERROR_DECOMPRESS"] = 10] = "ERROR_DECOMPRESS";
        //以下是js中扩展的字段，上面是引擎中已经有的字段
        /**@description 主包版本不匹配，需要升级主包 */
        Code[Code["MAIN_PACK_NEED_UPDATE"] = 11] = "MAIN_PACK_NEED_UPDATE";
        /**@description 预处理版本文件不存在 */
        Code[Code["PRE_VERSIONS_NOT_FOUND"] = 12] = "PRE_VERSIONS_NOT_FOUND";
        /**@description 未初始化 */
        Code[Code["UNINITED"] = 13] = "UNINITED";
    })(Code = Update.Code || (Update.Code = {}));
    let State;
    (function (State) {
        /**@description 未初始化 */
        State[State["UNINITED"] = 0] = "UNINITED";
        /**@description 找到manifest文件 */
        State[State["UNCHECKED"] = 1] = "UNCHECKED";
        /**@description 准备下载版本文件 */
        State[State["PREDOWNLOAD_VERSION"] = 2] = "PREDOWNLOAD_VERSION";
        /**@description 下载版本文件中 */
        State[State["DOWNLOADING_VERSION"] = 3] = "DOWNLOADING_VERSION";
        /**@description 版本文件下载完成 */
        State[State["VERSION_LOADED"] = 4] = "VERSION_LOADED";
        /**@description 准备加载project文件 */
        State[State["PREDOWNLOAD_MANIFEST"] = 5] = "PREDOWNLOAD_MANIFEST";
        /**@description 下载project文件中 */
        State[State["DOWNLOADING_MANIFEST"] = 6] = "DOWNLOADING_MANIFEST";
        /**@description 下载project文件完成 */
        State[State["MANIFEST_LOADED"] = 7] = "MANIFEST_LOADED";
        /**@description 需要下载更新 */
        State[State["NEED_UPDATE"] = 8] = "NEED_UPDATE";
        /**@description 准备更新 */
        State[State["READY_TO_UPDATE"] = 9] = "READY_TO_UPDATE";
        /**@description 更新中 */
        State[State["UPDATING"] = 10] = "UPDATING";
        /**@description 解压中 */
        State[State["UNZIPPING"] = 11] = "UNZIPPING";
        /**@description 已经是最新版本 */
        State[State["UP_TO_DATE"] = 12] = "UP_TO_DATE";
        /**@description 更新失败 */
        State[State["FAIL_TO_UPDATE"] = 13] = "FAIL_TO_UPDATE";
    })(State = Update.State || (Update.State = {}));
    /**
     * @description 热更新状态，
     */
    let Status;
    (function (Status) {
        /**@description 需要下载 */
        Status[Status["NEED_DOWNLOAD"] = 0] = "NEED_DOWNLOAD";
        /**@description 已经是最新版本 */
        Status[Status["UP_TO_DATE"] = 1] = "UP_TO_DATE";
        /**@description 需要下载更新 */
        Status[Status["NEED_UPDATE"] = 2] = "NEED_UPDATE";
    })(Status = Update.Status || (Update.Status = {}));
    class Config {
        /**
         *
         * @param name bundle名 如：大厅
         * @param bundle Bundle名 如:hall
         */
        constructor(name, bundle) {
            /**@description Bundle名 如:hall*/
            this.bundle = "";
            /**@description Bundle名 如:大厅  */
            this.name = "";
            this.name = name;
            this.bundle = bundle;
        }
        clone() {
            return new Config(this.name, this.bundle);
        }
    }
    Update.Config = Config;
    class AssetsManager {
        constructor(name, storagePath) {
            /**@description 当前资源管理器的名称 */
            this.name = "";
            this._manager = null;
            this.type = "";
            this.storagePath = "";
            this.name = name;
            this.type = `type.${name}`;
            this.storagePath = storagePath;
            this.create();
        }
        /**@description 当前资源管理器的实体 jsb.AssetsManager */
        get manager() {
            if (!this._manager) {
                this.create();
            }
            return this._manager;
        }
        set manager(v) {
            this._manager = v;
        }
        reset() {
            this.manager.reset();
        }
        create() {
            Log.d(`创建 ${this.name} AssetsManager`);
            this.manager = new cc_1.native.AssetsManager(this.type, this.storagePath);
        }
    }
    Update.AssetsManager = AssetsManager;
})(Update || (exports.Update = Update = {}));
