"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDragonDisplay = exports._loadRes = exports._loadDirRes = exports.createNodeWithPrefab = exports.setSkeletonSkeletonData = exports.setLabelFont = exports.setParticleSystemFile = exports.setButtonSpriteFrame = exports.setSpriteSpriteFrame = exports.getBundle = exports.addRemoteLoadResource = exports.addExtraLoadResource = void 0;
const cc_1 = require("cc");
const Resource_1 = require("../core/asset/Resource");
const UIView_1 = __importDefault(require("../core/ui/UIView"));
const Enums_1 = require("../defines/Enums");
const Macros_1 = require("../defines/Macros");
/**@description 添加加载本地的资源 */
function addExtraLoadResource(view, info) {
    let uiManager = App.uiManager;
    if (view == (uiManager.retainMemory)) {
        uiManager.retainMemory.addLocal(info);
    }
    else if (view && view instanceof UIView_1.default) {
        uiManager.addLocal(info, view.className);
    }
    else {
        uiManager.garbage.addLocal(info);
    }
}
exports.addExtraLoadResource = addExtraLoadResource;
/**@description 添加加载远程的资源 */
function addRemoteLoadResource(view, info) {
    let uiManager = App.uiManager;
    if (view == (uiManager.retainMemory)) {
        uiManager.retainMemory.addRemote(info);
    }
    else if (view && view instanceof UIView_1.default) {
        uiManager.addRemote(info, view.className);
    }
    else {
        uiManager.garbage.addRemote(info);
    }
}
exports.addRemoteLoadResource = addRemoteLoadResource;
/**@description 获取Bundle,如果没有传入，会默认指定当前View打开时的bundle,否则批定resources */
function getBundle(config) {
    let bundle = config.bundle;
    if (config.bundle == undefined || config.bundle == null) {
        bundle = Macros_1.Macro.BUNDLE_RESOURCES;
        if (config.view) {
            bundle = config.view.bundle;
        }
    }
    return bundle;
}
exports.getBundle = getBundle;
function isValidComponent(component) {
    if ((0, cc_1.isValid)(component) && component.node && (0, cc_1.isValid)(component.node)) {
        return true;
    }
    return false;
}
/**
 * @description 设置cc.Sprite组件精灵帧
 * @param {*} view 持有视图
 * @param {*} url url
 * @param {*} sprite Sprite组件
 * @param {*} spriteFrame 新的精灵帧
 * @param {*} complete 完成回调(data: cc.SpriteFrame) => void
 * @param {*} resourceType 资源类型 默认为ResourceType.Local
 * @param {*} retain 是否常驻内存 默认为false
 * @param {*} isAtlas 是否是大纹理图集加载 默认为false
 */
function setSpriteSpriteFrame(view, url, sprite, spriteFrame, complete, bundle, resourceType = Resource_1.Resource.Type.Local, retain = false, isAtlas = false) {
    if (!isAtlas) {
        //纹理只需要把纹理单独添加引用，不需要把spirteFrame也添加引用
        let info = new Resource_1.Resource.Info;
        info.url = url;
        info.type = cc_1.SpriteFrame;
        info.data = spriteFrame;
        info.retain = retain;
        info.bundle = bundle;
        if (resourceType == Resource_1.Resource.Type.Remote) {
            addRemoteLoadResource(view, info);
        }
        else {
            addExtraLoadResource(view, info);
        }
    }
    if (spriteFrame && isValidComponent(sprite)) {
        let oldSpriteFrame = sprite.spriteFrame;
        let replaceData = (0, cc_1.isValid)(spriteFrame) ? spriteFrame : null;
        try {
            if (replaceData)
                sprite.spriteFrame = replaceData;
            if (complete)
                complete(replaceData);
        }
        catch (err) {
            let temp = (0, cc_1.isValid)(oldSpriteFrame) ? oldSpriteFrame : null;
            sprite.spriteFrame = temp;
            if (complete)
                complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${url} : ${err ? err : "replace spriteframe error"}`);
        }
    }
    else {
        //完成回调
        if (complete && isValidComponent(sprite))
            complete(spriteFrame);
    }
}
exports.setSpriteSpriteFrame = setSpriteSpriteFrame;
/**
 * @description 设置按钮精灵帧
 * @param view 持有视图
 * @param url url
 * @param button
 * @param spriteFrame 新的spriteFrame
 * @param memberName 替换成员变量名
 * @param complete 完成回调
 * @param isAtlas 是否是从大纹理图集中加载的
 */
function _setSpriteFrame(view, url, button, spriteFrame, memberName, complete, isAtlas, bundle) {
    if (!isAtlas) {
        let info = new Resource_1.Resource.Info;
        info.url = url;
        info.type = cc_1.SpriteFrame;
        info.data = spriteFrame;
        info.bundle = bundle;
        addExtraLoadResource(view, info);
    }
    if (spriteFrame && isValidComponent(button)) {
        let oldSpriteFrame = button[memberName];
        try {
            let replaceData = (0, cc_1.isValid)(spriteFrame) ? spriteFrame : null;
            if (replaceData)
                button[memberName] = replaceData;
            if (complete)
                complete(memberName, replaceData);
        }
        catch (err) {
            let temp = (0, cc_1.isValid)(oldSpriteFrame) ? oldSpriteFrame : null;
            button[memberName] = temp;
            if (complete)
                complete(memberName, null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${url} : ${err ? err : "replace spriteframe error"}`);
        }
    }
    else {
        if (complete && isValidComponent(button))
            complete(memberName, spriteFrame);
    }
}
;
/**
 * @description 设置按钮精灵帧
 * @param button 按钮组件
 * @param memberName 成员变量名
 * @param view 持有视图
 * @param url url
 * @param spriteFrame 待替换的精灵帧
 * @param complete 完成回调
 * @param isAtlas 是否是从大纹理图集中加载的 默认为false
 */
function _setButtonSpriteFrame(button, memberName, view, url, spriteFrame, complete, bundle, isAtlas = false) {
    if (spriteFrame && isValidComponent(button)) {
        _setSpriteFrame(view, url, button, spriteFrame, memberName, complete, isAtlas, bundle);
    }
    else {
        //完成回调
        if (complete && isValidComponent(button))
            complete(memberName, spriteFrame);
    }
}
/**
 * @description 根据类型设置按钮
 * @param button
 * @param memberName 成员变量名
 * @param view
 * @param url
 * @param complete
 */
function _setButtonWithType(button, memberName, view, url, complete, bundle) {
    if (url) {
        if (typeof url == "string") {
            url = url + "/spriteFrame";
            App.cache.getCacheByAsync(url, cc_1.SpriteFrame, bundle).then((spriteFrame) => {
                _setButtonSpriteFrame(button, memberName, view, url, spriteFrame, complete, bundle);
            });
        }
        else {
            //在纹理图集中查找
            App.cache.getSpriteFrameByAsync(url.urls, url.key, view, addExtraLoadResource, bundle).then((data) => {
                if (data && data.isTryReload) {
                    //来到这里面，程序已经崩溃，无意义在处理
                }
                else {
                    _setButtonSpriteFrame(button, memberName, view, data.url, data.spriteFrame, complete, bundle, true);
                }
            });
        }
    }
}
/**
 * @description 设置按钮精灵
 * @param button 按钮组件
 * @param config 配置信息
 */
function setButtonSpriteFrame(button, config) {
    let bundle = getBundle(config);
    _setButtonWithType(button, Enums_1.ButtonSpriteType.Norml, config.view, config.normalSprite, config.complete, bundle);
    _setButtonWithType(button, Enums_1.ButtonSpriteType.Pressed, config.view, config.pressedSprite, config.complete, bundle);
    _setButtonWithType(button, Enums_1.ButtonSpriteType.Hover, config.view, config.hoverSprite, config.complete, bundle);
    _setButtonWithType(button, Enums_1.ButtonSpriteType.Disable, config.view, config.disabledSprite, config.complete, bundle);
}
exports.setButtonSpriteFrame = setButtonSpriteFrame;
/**
 * @description 设置特效
 * @param component 特效组件
 * @param config 配置信息
 * @param data 特效数据
 */
function setParticleSystemFile(component, config, data) {
    let info = new Resource_1.Resource.Info;
    info.url = config.url;
    info.type = cc_1.ParticleAsset;
    info.data = data;
    info.bundle = getBundle(config);
    addExtraLoadResource(config.view, info);
    if (data && isValidComponent(component)) {
        let oldFile = component.file;
        try {
            let replaceData = (0, cc_1.isValid)(data) ? data : null;
            if (replaceData)
                component.file = replaceData;
            if (config.complete)
                config.complete(replaceData);
        }
        catch (err) {
            let temp = (0, cc_1.isValid)(oldFile) ? oldFile : null;
            component.file = temp;
            if (config.complete)
                config.complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${config.url} : ${err ? err : "replace file error"}`);
        }
    }
    else {
        //完成回调
        if (config.complete && isValidComponent(component))
            config.complete(data);
    }
}
exports.setParticleSystemFile = setParticleSystemFile;
/**
 * @description 设置字体
 * @param component 字体组件
 * @param config 配置信息
 * @param data 字体数据
 */
function setLabelFont(component, config, data) {
    let info = new Resource_1.Resource.Info;
    info.url = config.font;
    info.type = cc_1.Font;
    info.data = data;
    info.bundle = getBundle(config);
    addExtraLoadResource(config.view, info);
    if (data && isValidComponent(component)) {
        let oldFont = component.font;
        try {
            let replaceData = (0, cc_1.isValid)(data) ? data : null;
            if (replaceData)
                component.font = replaceData;
            if (config.complete)
                config.complete(replaceData);
        }
        catch (err) {
            let temp = (0, cc_1.isValid)(oldFont) ? oldFont : null;
            component.font = temp;
            if (config.complete)
                config.complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${config.font} : ${err ? err : "replace font error"}`);
        }
    }
    else {
        //完成回调
        if (config.complete && isValidComponent(component))
            config.complete(data);
    }
}
exports.setLabelFont = setLabelFont;
/**
 * @description 设置spine动画数据
 * @param component spine组件
 * @param config 配置信息
 * @param data 动画数据
 */
function setSkeletonSkeletonData(component, config, data, resourceType = Resource_1.Resource.Type.Local) {
    let url = "";
    let retain = false;
    if (resourceType == Resource_1.Resource.Type.Remote) {
        let realConfig = config;
        url = `${realConfig.path}/${realConfig.name}`;
        retain = realConfig.retain ? true : false;
    }
    else {
        let realConfig = config;
        url = realConfig.url;
    }
    let info = new Resource_1.Resource.Info;
    info.url = url;
    info.type = cc_1.sp.SkeletonData;
    info.data = data;
    info.retain = retain;
    info.bundle = getBundle(config);
    if (resourceType == Resource_1.Resource.Type.Remote) {
        info.bundle = Macros_1.Macro.BUNDLE_REMOTE;
        addRemoteLoadResource(config.view, info);
    }
    else {
        addExtraLoadResource(config.view, info);
    }
    if (data && isValidComponent(component)) {
        let oldSkeletonData = component.skeletonData;
        try {
            let replaceData = (0, cc_1.isValid)(data) ? data : null;
            if (replaceData)
                component.skeletonData = replaceData;
            if (config.complete)
                config.complete(replaceData);
        }
        catch (err) {
            let temp = (0, cc_1.isValid)(oldSkeletonData) ? oldSkeletonData : null;
            component.skeletonData = temp;
            if (config.complete)
                config.complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${url} : ${err ? err : "replace skeletonData error"}`);
        }
    }
    else {
        //完成回调
        if (config.complete && isValidComponent(component))
            config.complete(data);
    }
}
exports.setSkeletonSkeletonData = setSkeletonSkeletonData;
/**
 * @description 通过预置体创建Node
 * @param config 配置信息
 */
function createNodeWithPrefab(config) {
    let url = config.url;
    let bundle = getBundle(config);
    let cache = App.cache.get(bundle, url);
    App.cache.getCacheByAsync(url, cc_1.Prefab, bundle).then((data) => {
        if (!cache) {
            let info = new Resource_1.Resource.Info;
            info.url = config.url;
            info.type = cc_1.Prefab;
            info.data = data;
            info.bundle = getBundle(config);
            addExtraLoadResource(config.view, info);
        }
        if (data && isValidComponent(config.view) && config.complete) {
            let node = (0, cc_1.instantiate)(data);
            config.complete(node);
        }
        else if (isValidComponent(config.view) && config.complete) {
            config.complete(null);
        }
    });
}
exports.createNodeWithPrefab = createNodeWithPrefab;
function _loadDirRes(config) {
    let bundle = getBundle(config);
    let cache = App.cache.get(bundle, config.url);
    //这里要做一个防止重复加载操作，以免对加载完成后的引用计数多加次数
    App.asset.loadDir(bundle, config.url, config.type, config.onProgress, (data) => {
        if (!cache) {
            //如果已经有了，可能是从logic中加载过来的，不在进行引用计数操作
            let info = new Resource_1.Resource.Info;
            info.url = config.url;
            info.type = config.type;
            info.data = data.data;
            info.bundle = bundle;
            addExtraLoadResource(config.view, info);
        }
        if (config.onComplete) {
            config.onComplete(data);
        }
    });
}
exports._loadDirRes = _loadDirRes;
function _loadRes(config) {
    let bundle = getBundle(config);
    let cache = App.cache.get(bundle, config.url);
    App.asset.load(bundle, config.url, config.type, config.onProgress, (data) => {
        if (!cache) {
            let info = new Resource_1.Resource.Info;
            info.url = config.url;
            info.type = config.type;
            info.data = data.data;
            info.bundle = bundle;
            addExtraLoadResource(config.view, info);
        }
        if (config.onComplete) {
            config.onComplete(data);
        }
    });
}
exports._loadRes = _loadRes;
function loadDragonDisplay(comp, config) {
    let bundle = getBundle(config);
    App.cache.getCacheByAsync(config.assetUrl, cc_1.dragonBones.DragonBonesAsset, bundle).then((asset) => {
        if (asset) {
            let info = new Resource_1.Resource.Info;
            info.url = config.assetUrl;
            info.type = cc_1.dragonBones.DragonBonesAsset;
            info.data = asset;
            info.bundle = getBundle(config);
            addExtraLoadResource(config.view, info);
            App.cache.getCacheByAsync(config.atlasUrl, cc_1.dragonBones.DragonBonesAtlasAsset, bundle).then((atlas) => {
                if (atlas) {
                    if (cc_1.sys.isBrowser) {
                        let info = new Resource_1.Resource.Info;
                        info.url = config.atlasUrl;
                        info.type = cc_1.dragonBones.DragonBonesAtlasAsset;
                        info.data = atlas;
                        info.bundle = getBundle(config);
                        addExtraLoadResource(config.view, info);
                    }
                    comp.dragonAsset = asset;
                    comp.dragonAtlasAsset = atlas;
                    if (config.complete) {
                        config.complete(asset, atlas);
                    }
                }
                else {
                    if (config.complete) {
                        config.complete(asset, null);
                    }
                }
            });
        }
        else {
            if (config.complete) {
                config.complete(null, null);
            }
        }
    });
}
exports.loadDragonDisplay = loadDragonDisplay;
