"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const AudioComponent_1 = __importStar(require("../../framework/componects/AudioComponent"));
const Macros_1 = require("../../framework/defines/Macros");
const Config_1 = require("../config/Config");
/**
 * @description 全局音频播放组棒
 */
const { ccclass, property, menu } = cc_1._decorator;
exports.default = (() => {
    let _classDecorators = [ccclass, menu("Quick公共组件/GlobalAudio")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GlobalAudio = _classThis = class extends AudioComponent_1.default {
        playDialogOpen() {
            this.playEffect(Config_1.Config.audioPath.dialog, Macros_1.Macro.BUNDLE_RESOURCES, false);
        }
        playButtonClick() {
            this.playEffect(Config_1.Config.audioPath.button, Macros_1.Macro.BUNDLE_RESOURCES, false);
        }
        playMusic(url, bundle, loop = true) {
            let me = this;
            return new Promise((resolve) => {
                if (bundle != Macros_1.Macro.BUNDLE_RESOURCES) {
                    Log.e(`${url} 不在 ${Macros_1.Macro.BUNDLE_RESOURCES} 全局播放的声音发现存放到${Macros_1.Macro.BUNDLE_RESOURCES}`);
                    resolve(false);
                    return;
                }
                let key = this.audioData.makeKey(url, bundle);
                let audioInfo = this.audioData.musicInfos.get(key);
                if (!audioInfo) {
                    audioInfo = new AudioComponent_1.AudioInfo();
                    audioInfo.url = url;
                    audioInfo.bundle = bundle;
                    audioInfo.source = this.node.addComponent(cc_1.AudioSource);
                    audioInfo.source.playOnAwake = true;
                    audioInfo.source.name = key;
                    this.audioData.musicInfos.set(key, audioInfo);
                }
                this.audioData.curMusic = audioInfo;
                App.cache.getCacheByAsync(url, cc_1.AudioClip, bundle).then((data) => {
                    if (data) {
                        App.asset.addPersistAsset(url, data, bundle);
                        me.stopMusic();
                        if (audioInfo && audioInfo.source) {
                            audioInfo.source.clip = data;
                            audioInfo.source.loop = loop;
                            this.play(audioInfo, true, resolve);
                        }
                    }
                    else {
                        resolve(false);
                    }
                });
            });
        }
        playEffect(url, bundle, loop = false) {
            return new Promise((resolve) => {
                if (bundle != Macros_1.Macro.BUNDLE_RESOURCES) {
                    Log.e(`${url} 不在 ${Macros_1.Macro.BUNDLE_RESOURCES} 全局播放的声音发现存放到${Macros_1.Macro.BUNDLE_RESOURCES}`);
                    resolve(false);
                    return;
                }
                let key = this.audioData.makeKey(url, bundle);
                let audioInfo = this.audioData.effectInfos.get(key);
                if (!audioInfo) {
                    audioInfo = new AudioComponent_1.AudioInfo;
                    audioInfo.url = url;
                    audioInfo.bundle = bundle;
                    audioInfo.source = this.node.addComponent(cc_1.AudioSource);
                    audioInfo.source.name = key;
                    this.audioData.effectInfos.set(key, audioInfo);
                }
                App.cache.getCacheByAsync(url, cc_1.AudioClip, bundle).then((data) => {
                    if (data) {
                        App.asset.addPersistAsset(url, data, bundle);
                        if (audioInfo && audioInfo.source) {
                            audioInfo.source.clip = data;
                            audioInfo.source.loop = loop;
                            this.play(audioInfo, false, resolve);
                        }
                    }
                    else {
                        resolve(false);
                    }
                });
            });
        }
    };
    __setFunctionName(_classThis, "GlobalAudio");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        GlobalAudio = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalAudio = _classThis;
})();
