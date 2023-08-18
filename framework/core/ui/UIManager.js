"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIManager = exports.ViewDynamicLoadData = void 0;
const cc_1 = require("cc");
const env_1 = require("cc/env");
const Enums_1 = require("../../defines/Enums");
const Macros_1 = require("../../defines/Macros");
const AdapterView_1 = __importDefault(require("../adapter/AdapterView"));
const Resource_1 = require("../asset/Resource");
/**@description 动态加载垃圾数据名 */
const DYNAMIC_LOAD_GARBAGE = "DYNAMIC_LOAD_GARBAGE";
/**@description 动画加载全局数据名 */
const DYNAMIC_LOAD_RETAIN_MEMORY = "DYNAMIC_LOAD_RETAIN_MEMORY";
class ViewDynamicLoadData {
    constructor(name = null) {
        this.local = new Map();
        this.remote = new Map();
        this.name = name;
    }
    /**@description 添加动态加载的本地资源 */
    addLocal(info, className = null) {
        if (info && info.url) {
            if (this.name == DYNAMIC_LOAD_GARBAGE) {
                Log.e(`找不到资源持有者: ${info.url}`);
            }
            if (env_1.DEBUG)
                App.uiManager.checkView(info.url, className);
            if (!this.local.has(info.url)) {
                App.asset.retainAsset(info);
                this.local.set(info.url, info);
            }
        }
    }
    /**@description 添加动态加载的远程资源 */
    addRemote(info, className = null) {
        if (info && info.data && !this.remote.has(info.url)) {
            if (this.name == DYNAMIC_LOAD_GARBAGE) {
                Log.e(`找不到资源持有者 : ${info.url}`);
            }
            if (env_1.DEBUG)
                App.uiManager.checkView(info.url, className);
            App.cache.remoteCaches.retainAsset(info);
            this.remote.set(info.url, info);
        }
    }
    /**@description 清除远程加载资源 */
    clear() {
        if (this.name == DYNAMIC_LOAD_GARBAGE) {
            //先输出
            let isShow = this.local.size > 0 || this.remote.size > 0;
            if (isShow) {
                Log.e(`当前未能释放资源如下:`);
            }
            if (this.local && this.local.size > 0) {
                Log.e("-----------local-----------");
                if (this.local) {
                    this.local.forEach((info) => {
                        Log.e(info.url);
                    });
                }
            }
            if (this.remote && this.remote.size > 0) {
                Log.e("-----------remote-----------");
                if (this.remote) {
                    this.remote.forEach((info, url) => {
                        Log.e(info.url);
                    });
                }
            }
        }
        else {
            //先清除当前资源的引用关系
            if (this.local) {
                this.local.forEach((info) => {
                    App.asset.releaseAsset(info);
                });
                this.local.clear();
            }
            if (this.remote) {
                this.remote.forEach((info, url) => {
                    App.cache.remoteCaches.releaseAsset(info);
                });
                this.remote.clear();
            }
        }
    }
}
exports.ViewDynamicLoadData = ViewDynamicLoadData;
/**@description 界面数据，这里需要处理一个问题，当一个界面打开，收到另一个人的关闭，此时如果界面未加载完成
 * 可能导致另一个人关闭无效，等界面加载完成后，又显示出来
 */
class ViewData {
    constructor() {
        /**@description 界面是否已经加载 */
        this.isLoaded = false;
        /**@description 界面当前等待操作状态 */
        this.status = Enums_1.ViewStatus.WAITTING_NONE;
        /**@description 实际显示界面 */
        this.view = null;
        /**@description 等待加载完成回调 */
        this.finishCb = [];
        /**@description 等待获取界面回调 */
        this.getViewCb = [];
        /**是否预加载,不显示出来，但会加到当前场景上 */
        this.isPreload = false;
        /**@description 是否通过预置创建 */
        this.isPrefab = true;
        /**@description 资源信息 */
        this.info = null;
        /**@description 界面的类型 */
        this.viewType = null;
        /**@description bundle */
        this.bundle = null;
        /**@description 界面动态加载的数据 */
        this.loadData = new ViewDynamicLoadData();
        this.node = null;
    }
    doGet(view, className, msg) {
        for (let i = 0; i < this.getViewCb.length; i++) {
            let cb = this.getViewCb[i];
            if (cb) {
                cb(view);
                if (env_1.DEBUG)
                    Log.w(`ViewData do get view : ${className} msg : ${msg}`);
            }
        }
        this.getViewCb = [];
    }
    doFinish(view, className, msg) {
        for (let i = 0; i < this.finishCb.length; i++) {
            let cb = this.finishCb[i];
            if (cb) {
                cb(view);
                if (env_1.DEBUG)
                    Log.w(`ViewData do finish view : ${className} msg : ${msg}`);
            }
        }
        this.finishCb = [];
    }
    doCallback(view, className, msg) {
        this.doFinish(view, className, msg);
        this.doGet(view, className, msg);
    }
}
class UIManager {
    constructor() {
        this.isResident = true;
        this.module = null;
        /**@description 视图 */
        this._viewDatas = new Map();
        /**@description 无主资源 */
        this.garbage = new ViewDynamicLoadData(DYNAMIC_LOAD_GARBAGE);
        /**@description 驻留内存资源 */
        this.retainMemory = new ViewDynamicLoadData(DYNAMIC_LOAD_RETAIN_MEMORY);
        this._canvas = null;
        this._viewRoot = null;
        this._componentRoot = null;
        this._mainController = null;
        this._prefabs = null;
        this._root3D = null;
    }
    getViewData(data) {
        let className = this.getClassName(data);
        if (!className)
            return undefined;
        let viewData = this._viewDatas.has(className) ? this._viewDatas.get(className) : undefined;
        return viewData;
    }
    /**
     * @description 通过当前视图，获取视图的类型
     * @param view
     * @returns
     */
    getViewType(view) {
        if (!(0, cc_1.isValid)(view)) {
            return null;
        }
        let className = view.className;
        if (!className)
            return null;
        let viewData = this._viewDatas.get(className);
        if (viewData) {
            return viewData.viewType;
        }
        else {
            return null;
        }
    }
    getClassName(data) {
        if (!data)
            return undefined;
        let className = undefined;
        if (typeof data == "string") {
            className = data;
        }
        else {
            className = cc_1.js.getClassName(data);
        }
        return className;
    }
    defaultOpenOption(options) {
        let out = {
            bundle: Macros_1.Macro.BUNDLE_RESOURCES,
            delay: options.delay,
            name: options.name,
            zIndex: 0,
            preload: false,
            type: options.type,
            args: options.args,
        };
        if (options.bundle != undefined) {
            out.bundle = options.bundle;
        }
        if (options.zIndex != undefined) {
            out.zIndex = options.zIndex;
        }
        if (options.preload != undefined) {
            out.preload = options.preload;
        }
        return out;
    }
    /**
     * @description 预加载视图
     * @param uiClass
     * @param bundle
     * @returns
     */
    preload(uiClass, bundle) {
        return this.open({ type: uiClass, preload: true, bundle: bundle });
    }
    parsePrefabUrl(url) {
        if (url[0] == "@") {
            return { isPrefab: false, url: url.substr(1) };
        }
        else {
            return { isPrefab: true, url: url };
        }
    }
    /**
     * @description 打开视图
     * @param type UIView视图类型
     * @param OpenOption 打开设置
     * @param viewOption 视图显示设置参数，即UIView.show参数
     * @returns
     */
    open(openOption) {
        let _OpenOption = this.defaultOpenOption(openOption);
        return this._open(_OpenOption);
    }
    _open(openOption) {
        return new Promise((reslove, reject) => {
            if (!openOption.type) {
                if (env_1.DEBUG)
                    Log.d(`${this.module}open ui class error`);
                reslove(null);
                return;
            }
            let className = cc_1.js.getClassName(openOption.type);
            let root = this.viewRoot;
            if (!root) {
                if (env_1.DEBUG)
                    Log.e(`${this.module}找不到场景的Canvas节点`);
                reslove(null);
                return;
            }
            let viewData = this.getViewData(openOption.type);
            if (viewData) {
                viewData.isPreload = openOption.preload;
                //已经加载
                if (viewData.isLoaded) {
                    viewData.status = Enums_1.ViewStatus.WAITTING_NONE;
                    if (!openOption.preload) {
                        if (viewData.view && (0, cc_1.isValid)(viewData.node)) {
                            viewData.node.zIndex = openOption.zIndex;
                            if (!viewData.node.parent) {
                                this.addView(viewData.node, openOption.zIndex);
                            }
                            viewData.view.show(openOption.args);
                        }
                    }
                    reslove(viewData.view);
                    return;
                }
                else {
                    viewData.status = Enums_1.ViewStatus.WAITTING_NONE;
                    if (!openOption.preload) {
                        App.uiLoading.show(openOption.delay, openOption.name);
                    }
                    //正在加载中
                    if (env_1.DEBUG)
                        Log.w(`${this.module}${className} 正在加载中...`);
                    viewData.finishCb.push(reslove);
                    return;
                }
            }
            else {
                viewData = new ViewData();
                viewData.loadData.name = className;
                let prefabUrl = openOption.type.getPrefabUrl();
                let result = this.parsePrefabUrl(prefabUrl);
                viewData.isPreload = openOption.preload;
                viewData.isPrefab = result.isPrefab;
                viewData.viewType = openOption.type;
                viewData.bundle = openOption.bundle;
                this._viewDatas.set(className, viewData);
                if (!result.isPrefab) {
                    //说明存在于主场景中
                    viewData.info = new Resource_1.Resource.Info;
                    viewData.info.url = result.url;
                    viewData.info.type = cc_1.Prefab;
                    viewData.info.data = this.getScenePrefab(result.url);
                    viewData.info.bundle = openOption.bundle;
                    this.createNode(viewData, reslove, openOption);
                    return;
                }
                let progressCallback = null;
                if (!openOption.preload) {
                    App.uiLoading.show(openOption.delay, openOption.name);
                    //预加载界面不显示进度
                    progressCallback = (completedCount, totalCount, item) => {
                        let progress = Math.ceil((completedCount / totalCount) * 100);
                        App.uiLoading.updateProgress(progress);
                    };
                }
                this.loadPrefab(openOption.bundle, prefabUrl, progressCallback)
                    .then((prefab) => {
                    viewData.info = new Resource_1.Resource.Info;
                    viewData.info.url = prefabUrl;
                    viewData.info.type = cc_1.Prefab;
                    viewData.info.data = prefab;
                    viewData.info.bundle = openOption.bundle;
                    App.asset.retainAsset(viewData.info);
                    this.createNode(viewData, reslove, openOption);
                    App.uiLoading.hide();
                }).catch((reason) => {
                    viewData.isLoaded = true;
                    Log.e(reason);
                    this.close(openOption.type);
                    viewData.doCallback(null, className, "打开界面异常");
                    reslove(null);
                    let uiName = "";
                    if (env_1.DEBUG) {
                        uiName = className;
                    }
                    if (openOption.name) {
                        uiName = openOption.name;
                    }
                    App.tips.show(`加载界面${uiName}失败，请重试`);
                    App.uiLoading.hide();
                });
            }
        });
    }
    _addComponent(uiNode, viewData, openOption) {
        if (uiNode) {
            let className = this.getClassName(viewData.viewType);
            //挂载脚本
            let view = uiNode.getComponent(viewData.viewType);
            if (!view) {
                view = uiNode.addComponent(viewData.viewType);
                if (!view) {
                    if (env_1.DEBUG)
                        Log.e(`${this.module}挂载脚本失败 : ${className}`);
                    return null;
                }
                else {
                    if (env_1.DEBUG)
                        Log.d(`${this.module}挂载脚本 : ${className}`);
                }
            }
            view.className = className;
            view.bundle = openOption.bundle;
            viewData.view = view;
            view.args = openOption.args;
            //界面显示在屏幕中间
            let widget = view.getComponent(cc_1.Widget);
            if (widget) {
                if (env_1.DEBUG)
                    Log.e(`${this.module}请不要在根节点挂载cc.Widget组件`);
                widget.destroy();
            }
            if (!view.getComponent(AdapterView_1.default)) {
                view.addComponent(AdapterView_1.default);
            }
            if (!viewData.isPreload) {
                this.addView(uiNode, openOption.zIndex);
            }
            return view;
        }
        else {
            return null;
        }
    }
    createNode(viewData, reslove, openOptions) {
        viewData.isLoaded = true;
        let className = this.getClassName(viewData.viewType);
        if (viewData.status == Enums_1.ViewStatus.WAITTING_CLOSE) {
            //加载过程中有人关闭了界面
            reslove(null);
            if (env_1.DEBUG)
                Log.w(`${this.module}${className}正等待关闭`);
            //如果此时有地方正在获取界面，直接返回空
            viewData.doCallback(null, className, "获取界内已经关闭");
            return;
        }
        let uiNode = (0, cc_1.instantiate)(viewData.info.data);
        viewData.node = uiNode;
        let view = this._addComponent(uiNode, viewData, openOptions);
        if (!view) {
            reslove(null);
            return;
        }
        if (viewData.status == Enums_1.ViewStatus.WATITING_HIDE) {
            //加载过程中有人隐藏了界面
            view.hide();
            if (env_1.DEBUG)
                Log.w(`${this.module}加载过程隐藏了界面${className}`);
            reslove(view);
            viewData.doCallback(view, className, "加载完成，但加载过程中被隐藏");
        }
        else {
            if (env_1.DEBUG)
                Log.d(`${this.module}open view : ${className}`);
            if (!viewData.isPreload) {
                view.show(openOptions.args);
            }
            reslove(view);
            viewData.doCallback(view, className, "加载完成，回调之前加载中的界面");
        }
    }
    loadPrefab(bundle, url, progressCallback) {
        return new Promise((resolove, reject) => {
            App.asset.load(bundle, url, cc_1.Prefab, progressCallback, (data) => {
                if (data && data.data && data.data instanceof cc_1.Prefab) {
                    resolove(data.data);
                }
                else {
                    reject(`加载prefab : ${url} 失败`);
                }
            });
        });
    }
    get viewRoot() {
        if (!this._viewRoot && !(0, cc_1.isValid)(this._viewRoot)) {
            this._viewRoot = (0, cc_1.find)("viewRoot", this.canvas);
        }
        return this._viewRoot;
    }
    get componentRoot() {
        if (!this._componentRoot && !(0, cc_1.isValid)(this._componentRoot)) {
            this._componentRoot = (0, cc_1.find)("componentRoot", this.canvas);
        }
        return this._componentRoot;
    }
    /*获取当前canvas的组件 */
    get mainController() {
        if (!this._mainController && !(0, cc_1.isValid)(this._mainController)) {
            return this._mainController;
        }
        let canvas = this.canvas;
        if (canvas) {
            this._mainController = canvas.getComponent("MainController");
            return this._mainController;
        }
        return null;
    }
    get prefabs() {
        if (!this._prefabs && !(0, cc_1.isValid)(this._prefabs)) {
            this._prefabs = (0, cc_1.find)("prefabs", this.canvas);
        }
        return this._prefabs;
    }
    /**@description 3d根节点 */
    get root3D() {
        return (0, cc_1.find)("3d", this.canvas.parent);
    }
    /**@description 3d相机 */
    get camera3d() {
        var _a;
        return (_a = (0, cc_1.find)("Camera3D", this.canvas.parent)) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.Camera);
    }
    /**@description 截图cavans */
    get screenShotCamera() {
        var _a;
        return (_a = (0, cc_1.find)("ScreenShotCamera", this.canvas)) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.Camera);
    }
    get uiCamera() {
        var _a;
        return (_a = (0, cc_1.find)("UICamera", this.canvas)) === null || _a === void 0 ? void 0 : _a.getComponent(cc_1.Camera);
    }
    /**@description 获取主场景预置节点 */
    getScenePrefab(name) {
        return (0, cc_1.find)(name, this.prefabs);
    }
    onLoad(node) {
        this._canvas = node;
    }
    /**
     * @description 走到这里面，说明游戏结束，或都重启游戏，直接清空,避免double free
     * @param node
     */
    onDestroy(node) {
        this._viewDatas.clear();
    }
    get canvas() {
        return this._canvas;
    }
    addView(node, zOrder) {
        this.viewRoot.addChild(node);
        node.zIndex = zOrder;
        window["cc"].updateZIndex(this.viewRoot);
    }
    /**@description 添加动态加载的本地资源 */
    addLocal(info, className) {
        if (info) {
            let viewData = this.getViewData(className);
            if (viewData) {
                viewData.loadData.addLocal(info, className);
            }
        }
    }
    /**@description 添加动态加载的远程资源 */
    addRemote(info, className) {
        if (info) {
            let viewData = this.getViewData(className);
            if (viewData) {
                viewData.loadData.addRemote(info, className);
            }
        }
    }
    close(data) {
        //当前所有界面都已经加载完成
        let viewData = this.getViewData(data);
        if (viewData) {
            viewData.status = Enums_1.ViewStatus.WAITTING_CLOSE;
            let className = this.getClassName(data);
            if (viewData.view && (0, cc_1.isValid)(viewData.node)) {
                viewData.node.removeFromParent();
                viewData.node.destroy();
            }
            viewData.loadData.clear();
            if (viewData.isPrefab) {
                App.asset.releaseAsset(viewData.info);
            }
            this._viewDatas.delete(className);
            Log.d(`${this.module} close view : ${className}`);
        }
    }
    /**@description 关闭除传入参数以外的所有其它界面,不传入，关闭所有界面 */
    closeExcept(views) {
        let self = this;
        if (views == undefined || views == null || views.length == 0) {
            //关闭所有界面
            if (env_1.DEBUG)
                Log.e(`请检查参数，至少需要保留一个界面，不然就黑屏了，大兄弟`);
            this._viewDatas.forEach((viewData, key) => {
                self.close(key);
            });
            return;
        }
        let viewClassNames = new Set();
        for (let i = 0; i < views.length; i++) {
            viewClassNames.add(this.getClassName(views[i]));
        }
        this._viewDatas.forEach((viewData, key) => {
            if (viewClassNames.has(key)) {
                //如果包含，不做处理，是排除项
                return;
            }
            self.close(key);
        });
    }
    /**@description 关闭指定bundle的视图 */
    closeBundleView(bundle) {
        let self = this;
        this._viewDatas.forEach((viewData, key) => {
            if (viewData.bundle == bundle) {
                self.close(key);
            }
        });
    }
    hide(data) {
        let viewData = this.getViewData(data);
        if (viewData) {
            if (viewData.isLoaded) {
                //已经加载完成，说明已经是直实存在的界面，按照正常游戏进行删除
                if (viewData.view && (0, cc_1.isValid)(viewData.view.node)) {
                    viewData.view.hide();
                }
                if (env_1.DEBUG)
                    Log.d(`${this.module}hide view : ${viewData.loadData.name}`);
            }
            else {
                //没有加载写成，正常加载中
                viewData.status = Enums_1.ViewStatus.WATITING_HIDE;
            }
        }
    }
    getView(data) {
        return new Promise((resolove, reject) => {
            if (data == undefined || data == null) {
                resolove(null);
                return;
            }
            let viewData = this.getViewData(data);
            if (viewData) {
                if (viewData.isPreload) {
                    //如果只是预加载，返回空，让使用者用open的方式打开
                    resolove(null);
                }
                else {
                    if (viewData.isLoaded) {
                        resolove(viewData.view);
                    }
                    else {
                        //加载中
                        viewData.getViewCb.push(resolove);
                    }
                }
            }
            else {
                resolove(null);
            }
        });
    }
    checkView(url, className) {
        if (env_1.DEBUG && className) {
            this.getView(className).then((view) => {
                if (!view) {
                    let viewData = this.getViewData(className);
                    if (viewData) {
                        //预置加载返回的view是空
                        //排除掉这种方式的
                        if (!viewData.isPreload) {
                            Log.e(`资源 : ${url} 的持有者必须由UIManager.open方式打开`);
                        }
                    }
                    else {
                        Log.e(`资源 : ${url} 的持有者必须由UIManager.open方式打开`);
                    }
                }
            });
        }
    }
    isShow(data) {
        let viewData = this.getViewData(data);
        if (!viewData) {
            return false;
        }
        if (viewData.isLoaded && viewData.status == Enums_1.ViewStatus.WAITTING_NONE) {
            if (viewData.view)
                return viewData.view.node.active;
        }
        return false;
    }
    addComponent(data) {
        let root = this.componentRoot;
        if (root) {
            let component = root.getComponent(data);
            if (component) {
                if (typeof data == "string") {
                    if (env_1.DEBUG)
                        Log.w(`${this.module}已经存在 Component ${component}`);
                }
                else {
                    if (env_1.DEBUG)
                        Log.w(`${this.module}已经存在 Component ${cc_1.js.getClassName(data)}`);
                }
                return component;
            }
            else {
                return root.addComponent(data);
            }
        }
        return null;
    }
    removeComponent(component) {
        let root = this.componentRoot;
        if (root) {
            let comp = root.getComponent(component);
            if (comp) {
                comp.destroy();
            }
        }
    }
    debug(config) {
        if (!config) {
            config = {};
            config.showChildren = true;
            config.showComp = true;
            config.showViews = true;
        }
        if (config.showViews) {
            Log.d(`-----------当前所有视图------------`);
            this._viewDatas.forEach((value, key) => {
                Log.d(`[${key}] isLoaded : ${value.isLoaded} status : ${value.status} view : ${cc_1.js.getClassName(value.view)} active : ${value.view && value.view.node ? value.view.node.active : false}`);
            });
        }
        if (config.showChildren) {
            let root = this.viewRoot;
            if (root) {
                Log.d(`-----------当前所有节点信息------------`);
                let children = root.children;
                for (let i = 0; i < children.length; i++) {
                    let data = children[i];
                    Log.d(`${data.name} active : ${data.active}`);
                }
            }
        }
        if (config.showComp) {
            let root = this.componentRoot;
            if (root) {
                Log.d(`-----------当前所有组件信息------------`);
                let comps = root._components;
                for (let i = 0; i < comps.length; i++) {
                    Log.d(cc_1.js.getClassName(comps[i]));
                }
            }
        }
    }
}
exports.UIManager = UIManager;
UIManager.module = "【UI管理器】";
