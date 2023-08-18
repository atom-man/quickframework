"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Framewok = void 0;
const Dispatcher_1 = require("./core/event/Dispatcher");
const UIManager_1 = require("./core/ui/UIManager");
const LocalStorage_1 = require("./core/storage/LocalStorage");
const AssetManager_1 = require("./core/asset/AssetManager");
const CacheManager_1 = require("./core/asset/CacheManager");
const NodePoolManager_1 = require("./core/nodePool/NodePoolManager");
const UpdateManager_1 = require("./core/update/UpdateManager");
const BundleManager_1 = require("./core/asset/BundleManager");
const CocosExtention_1 = require("./plugin/CocosExtention");
const Language_1 = require("./core/language/Language");
const Macros_1 = require("./defines/Macros");
const ProtoManager_1 = require("./core/net/service/ProtoManager");
const EntryManager_1 = require("./core/entry/EntryManager");
const DataCenter_1 = require("./data/DataCenter");
const LogicManager_1 = require("./core/logic/LogicManager");
const Logger_1 = require("./core/log/Logger");
const ServiceManager_1 = require("./core/net/service/ServiceManager");
const ReleaseManager_1 = require("./core/asset/ReleaseManager");
const HttpClient_1 = require("./core/net/http/HttpClient");
const Singleton_1 = require("./utils/Singleton");
const LayoutManager_1 = require("./core/layout/LayoutManager");
const SenderManager_1 = require("./core/net/service/SenderManager");
const HandlerManager_1 = require("./core/net/service/HandlerManager");
const Utils_1 = require("./utils/Utils");
const CanvasHelper_1 = require("./utils/CanvasHelper");
const Platform_1 = require("./platform/Platform");
/**@description 框架层使用的各管理器单例的管理 */
class Framewok {
    constructor() {
        /**@description 当前游戏GameView, GameView进入onLoad赋值 */
        this.gameView = null;
    }
    /**@description 资源是否懒释放，true时，只有收到平台的内存警告才会释放资源，还有在更新时才分释放,否则不会释放资源 */
    get isLazyRelease() {
        return false;
    }
    /**@description 资源释放管理 */
    get releaseManger() {
        return Singleton_1.Singleton.get(ReleaseManager_1.ReleaseManager);
    }
    /**@description 网络Service管理器 */
    get serviceManager() {
        return Singleton_1.Singleton.get(ServiceManager_1.ServiceManager);
    }
    /**@description 网络消息发送管理器 */
    get senderManager() {
        return Singleton_1.Singleton.get(SenderManager_1.SenderManager);
    }
    /**@description 网络消息处理管理器 */
    get handlerManager() {
        return Singleton_1.Singleton.get(HandlerManager_1.HandlerManager);
    }
    /**@description 日志 */
    get logger() {
        return Singleton_1.Singleton.get(Logger_1.LoggerImpl);
    }
    /**@description 逻辑管理器 */
    get logicManager() {
        return Singleton_1.Singleton.get(LogicManager_1.LogicManager);
    }
    /**@description 数据中心 */
    get dataCenter() {
        return Singleton_1.Singleton.get(DataCenter_1.DataCenter);
    }
    /**@description 入口管理器 */
    get entryManager() {
        return Singleton_1.Singleton.get(EntryManager_1.EntryManager);
    }
    get utils() {
        return Singleton_1.Singleton.get(Utils_1.Utils);
    }
    /**@description protobuf类型管理 */
    get protoManager() {
        return Singleton_1.Singleton.get(ProtoManager_1.ProtoManager);
    }
    /**@description bundle管理器 */
    get bundleManager() {
        return Singleton_1.Singleton.get(BundleManager_1.BundleManager);
    }
    /**@description 热更新管理器 */
    get updateManager() {
        return Singleton_1.Singleton.get(UpdateManager_1.UpdateManager);
    }
    /**@description 常驻资源指定的模拟view */
    get retainMemory() {
        return this.uiManager.retainMemory;
    }
    /**@description 语言包 */
    get language() {
        return Singleton_1.Singleton.get(Language_1.Language);
    }
    /**@description 事件派发器 */
    get dispatcher() {
        return Singleton_1.Singleton.get(Dispatcher_1.Dispatcher);
    }
    /**@description 界面管理器 */
    get uiManager() {
        return Singleton_1.Singleton.get(UIManager_1.UIManager);
    }
    /**
     * @description 本地仓库
     * @deprecated 该接口已经弃用，请用使用storage替换
     * */
    get localStorage() {
        return this.storage;
    }
    /**@description 本地仓库 */
    get storage() {
        return Singleton_1.Singleton.get(LocalStorage_1.LocalStorage);
    }
    /**
     * @description 资源管理器
     * @deprecated 该接口已经弃用，请用使用asset替换
     * */
    get assetManager() {
        return this.asset;
    }
    /**@description 资源管理器 */
    get asset() {
        return Singleton_1.Singleton.get(AssetManager_1._AssetManager);
    }
    /**
     * @description 资源缓存管理器
     * @deprecated 该接口已经弃用，请用使用cache替换
     * */
    get cacheManager() {
        return this.cache;
    }
    /**@description 资源缓存管理器 */
    get cache() {
        return Singleton_1.Singleton.get(CacheManager_1.CacheManager);
    }
    /**
     * @description 对象池管理器
     * @deprecated 该接口已经弃用，请用使用pool替换
     * */
    get nodePoolManager() {
        return this.pool;
    }
    /**@description 对象池管理器 */
    get pool() {
        return Singleton_1.Singleton.get(NodePoolManager_1.NodePoolManager);
    }
    get http() {
        return Singleton_1.Singleton.get(HttpClient_1.HttpClient);
    }
    /**@description 小提示 */
    get tips() {
        return null;
    }
    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading() {
        return null;
    }
    /**@description websocket wss 证书url地址 */
    get wssCacertUrl() {
        return "";
    }
    get layout() {
        return Singleton_1.Singleton.get(LayoutManager_1.LayoutManager);
    }
    get canvasHelper() {
        return Singleton_1.Singleton.get(CanvasHelper_1.CanvasHelper);
    }
    /**
     * @description 区分平台相关处理
     */
    get platform() {
        return Singleton_1.Singleton.get(Platform_1.Platform);
    }
    getGameView() {
        return this.gameView;
    }
    /**
     * @description 获取语言包
     *
     */
    getLanguage(key, params = [], bundle = null) {
        if (!bundle) {
            bundle = Macros_1.Macro.BUNDLE_RESOURCES;
        }
        let configs = [];
        configs.push(`${Macros_1.Macro.USING_LAN_KEY}${bundle}.${key}`);
        configs.push(...params);
        return this.language.get(configs);
    }
    init() {
        //引擎扩展初始化
        (0, CocosExtention_1.CocosExtentionInit)();
    }
    onLowMemory() {
        this.releaseManger.onLowMemory();
    }
}
exports.Framewok = Framewok;
