"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const cc_1 = require("cc");
/**@description 资源相关 */
var Resource;
(function (Resource) {
    /**@description 资源加载器错误 */
    let LoaderError;
    (function (LoaderError) {
        /**@description 加载中 */
        LoaderError[LoaderError["LOADING"] = 0] = "LOADING";
        /** @description 未找到或设置加载资源*/
        LoaderError[LoaderError["NO_FOUND_LOAD_RESOURCE"] = 1] = "NO_FOUND_LOAD_RESOURCE";
        /**@description 完美加载 */
        LoaderError[LoaderError["SUCCESS"] = 2] = "SUCCESS";
    })(LoaderError = Resource.LoaderError || (Resource.LoaderError = {}));
    /**@description 资源缓存类型 */
    let CacheStatus;
    (function (CacheStatus) {
        /**@description 无状态 */
        CacheStatus[CacheStatus["NONE"] = 0] = "NONE";
        /**@description 等待释放 */
        CacheStatus[CacheStatus["WAITTING_FOR_RELEASE"] = 1] = "WAITTING_FOR_RELEASE";
    })(CacheStatus = Resource.CacheStatus || (Resource.CacheStatus = {}));
    /**@description 资源类型 */
    let Type;
    (function (Type) {
        /**@description 本地 */
        Type[Type["Local"] = 0] = "Local";
        /**@description 远程资源 */
        Type[Type["Remote"] = 1] = "Remote";
    })(Type = Resource.Type || (Resource.Type = {}));
    /**@description 资源信息 */
    class Info {
        constructor() {
            this.url = "";
            this.type = null;
            this.data = null;
            /**@description 是否常驻内存，远程加载资源有效 */
            this.retain = false;
            this.bundle = null;
            /**@description 默认为本地资源 */
            this.resourceType = Type.Local;
            /**@description 加入释放资源的時間戳 */
            this.stamp = null;
        }
    }
    Resource.Info = Info;
    class CacheData {
        constructor() {
            /**@description 是否已经加载完成 */
            this.isLoaded = false;
            /**@description 加载完成数据
             * cc.Prefab
             * cc.SpriteAtlas
             * cc.SpriteFrame
             * cc.AudioClip
             * cc.Font
             * sp.SkeletonData
             * cc.ParticleAsset
             * cc.Texture2D
             * cc.JsonAsset
             * */
            this.data = null;
            this.info = new Info();
            this.status = CacheStatus.NONE;
            /**@description 在加载过程中有地方获取,加载完成后再回调 */
            this.getCb = [];
            /**@description 完成回调，在资源正在加载过程中，又有其它地方调用加载同一个资源，此时需要等待资源加载完成，统一回调 */
            this.finishCb = [];
        }
        doGet(data) {
            for (let i = 0; i < this.getCb.length; i++) {
                if (this.getCb[i])
                    this.getCb[i](data);
            }
            this.getCb = [];
        }
        doFinish(data) {
            for (let i = 0; i < this.finishCb.length; i++) {
                if (this.finishCb[i])
                    this.finishCb[i](data);
            }
            this.finishCb = [];
        }
        get isInvalid() {
            return this.isLoaded && this.data && !(0, cc_1.isValid)(this.data);
        }
    }
    Resource.CacheData = CacheData;
})(Resource || (exports.Resource = Resource = {}));
