"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioInfo = void 0;
const EventComponent_1 = __importDefault(require("./EventComponent"));
const cc_1 = require("cc");
const env_1 = require("cc/env");
const Resource_1 = require("../core/asset/Resource");
const Macros_1 = require("../defines/Macros");
const Singleton_1 = require("../utils/Singleton");
/**
 * @description 声音组件
 */
const { ccclass, property, menu } = cc_1._decorator;
class AudioInfo {
    constructor() {
        this.url = "";
        this.bundle = Macros_1.Macro.BUNDLE_RESOURCES;
        this.source = null;
        this.owner = null;
        this.isPause = false;
    }
    play() {
        this.isPause = false;
        if (this.source) {
            this.source.play();
        }
    }
    pause() {
        this.isPause = false;
        if (this.source) {
            if (this.source.playing) {
                Log.d(this.url, "isPlaying to pause");
                this.isPause = true;
                this.source.pause();
            }
        }
    }
    stop() {
        this.isPause = false;
        if (this.source) {
            this.source.stop();
        }
    }
    resume() {
        if (this.source && this.isPause) {
            Log.d(this.url, "resume play");
            this.source.play();
        }
        this.isPause = false;
    }
    set volume(val) {
        if (this.source) {
            this.source.volume = val;
        }
    }
    get volume() {
        if (this.source) {
            return this.source.volume;
        }
        return 0;
    }
}
exports.AudioInfo = AudioInfo;
/**@description 框架内部使用，外部请不要调用 */
class AudioData {
    constructor() {
        this.module = null;
        this.musicVolume = 1;
        this.effectVolume = 1;
        this.isEffectOn = true;
        this.isMusicOn = true;
        /**@description 保存所有播放的音乐 */
        this.musicInfos = new Map();
        /**@description 保存所有播放的音效 */
        this.effectInfos = new Map();
        /**@description 当前正在播放的音效 */
        this.curMusic = null;
        this._storeMusicKey = "default_save_music";
        this._storeEffectKey = "default_save_effect";
        this._storeMusicVolumeKey = "default_save_music_volume_key";
        this._storeEffectVolumeKey = "default_save_effect_volume_key";
    }
    init() {
        //音量开关读取
        this.isMusicOn = App.storage.getItem(this._storeMusicKey, this.isMusicOn);
        this.isEffectOn = App.storage.getItem(this._storeEffectKey, this.isEffectOn);
        //音量读取
        this.musicVolume = App.storage.getItem(this._storeMusicVolumeKey, this.musicVolume);
        this.effectVolume = App.storage.getItem(this._storeEffectVolumeKey, this.effectVolume);
    }
    /**@description 存储 */
    save() {
        try {
            App.storage.setItem(this._storeMusicKey, this.isMusicOn);
            App.storage.setItem(this._storeMusicVolumeKey, this.musicVolume);
            App.storage.setItem(this._storeEffectKey, this.isEffectOn);
            App.storage.setItem(this._storeEffectVolumeKey, this.effectVolume);
        }
        catch (error) {
        }
    }
    remove(owner) {
        this.musicInfos.forEach((info, key, source) => {
            if (info.owner && info.owner == owner) {
                source.delete(key);
            }
        });
        this.effectInfos.forEach((info, key, source) => {
            if (info.owner && info.owner == owner) {
                source.delete(key);
            }
        });
    }
    setMusicVolume(volume) {
        this.musicInfos.forEach((info, key, source) => {
            info.volume = volume;
        });
        this.musicVolume = volume;
        this.save();
    }
    setEffectVolume(volume) {
        this.effectInfos.forEach((info, key, source) => {
            info.volume = volume;
        });
        this.effectVolume = volume;
        this.save();
    }
    setMusicStatus(isOn) {
        if (this.isMusicOn == isOn) {
            return;
        }
        this.isMusicOn = isOn;
        this.save();
        if (isOn) {
            if (this.curMusic) {
                this.curMusic.play();
            }
        }
        else {
            this.stopMusic();
        }
    }
    setEffectStatus(isOn) {
        if (this.isEffectOn == isOn) {
            return;
        }
        this.isEffectOn = isOn;
        this.save();
        if (!isOn) {
            this.stopAllEffects();
        }
    }
    stopAllEffects() {
        this.effectInfos.forEach((info, key, source) => {
            info.stop();
        });
    }
    stopMusic() {
        this.musicInfos.forEach((info, key, source) => {
            info.stop();
        });
    }
    makeKey(url, bundle) {
        return `${App.bundleManager.getBundleName(bundle)}_${url}`;
    }
    stopEffect(url, bundle) {
        let key = this.makeKey(url, bundle);
        let info = this.effectInfos.get(key);
        if (info) {
            info.stop();
        }
    }
    resumeAll() {
        this.musicInfos.forEach((info, key, source) => {
            if (this.isMusicOn) {
                info.resume();
            }
        });
        this.effectInfos.forEach((info, key, source) => {
            if (this.isEffectOn) {
                info.resume();
            }
        });
    }
    pauseAll() {
        this.musicInfos.forEach((info, key, source) => {
            info.pause();
        });
        this.effectInfos.forEach((info, key, source) => {
            info.pause();
        });
    }
}
AudioData.module = "【音效数据】";
exports.default = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AudioComponent = _classThis = class extends EventComponent_1.default {
        constructor() {
            super(...arguments);
            /**@description 音频控件资源拥有者，该对象由UIManager打开的界面 */
            this.owner = null;
        }
        onDestroy() {
            this.audioData.remove(this.owner);
            super.onDestroy();
        }
        get audioData() {
            return Singleton_1.Singleton.get(AudioData);
        }
        /**@description 背景音乐音量 */
        get musicVolume() { return this.audioData.musicVolume; }
        set musicVolume(volume) { this.audioData.setMusicVolume(volume); }
        /**@description 音效音量 */
        get effectVolume() { return this.audioData.effectVolume; }
        set effectVolume(volume) { this.audioData.setEffectVolume(volume); }
        /**@description 音效开关 */
        get isEffectOn() { return this.audioData.isEffectOn; }
        set isEffectOn(value) { this.audioData.setEffectStatus(value); }
        /**@description 背景音乐开关 */
        get isMusicOn() { return this.audioData.isMusicOn; }
        /**@description 设置背景音乐开关 */
        set isMusicOn(isOn) { this.audioData.setMusicStatus(isOn); }
        save() { this.audioData.save(); }
        /**@description 停止 */
        stopEffect(url, bundle) { this.audioData.stopEffect(url, bundle); }
        stopAllEffects() { this.audioData.stopAllEffects(); }
        stopMusic() { this.audioData.stopMusic(); }
        playMusic(url, bundle, loop = true) {
            return new Promise((resolve) => {
                if (env_1.DEBUG) {
                    if (!this.owner) {
                        Log.e(`必须要指定资源的管理都才能播放`);
                        resolve(false);
                        return;
                    }
                }
                let key = this.audioData.makeKey(url, bundle);
                let audioInfo = this.audioData.musicInfos.get(key);
                if (!audioInfo) {
                    audioInfo = new AudioInfo;
                    audioInfo.url = url;
                    audioInfo.bundle = bundle;
                    audioInfo.source = this.node.addComponent(cc_1.AudioSource);
                    audioInfo.owner = this.owner;
                    audioInfo.source.name = key;
                    audioInfo.source.playOnAwake = true;
                    this.audioData.musicInfos.set(key, audioInfo);
                }
                this.audioData.curMusic = audioInfo;
                App.cache.getCacheByAsync(url, cc_1.AudioClip, bundle).then((data) => {
                    if (data) {
                        let info = new Resource_1.Resource.Info;
                        info.url = url;
                        info.type = cc_1.AudioClip;
                        info.data = data;
                        info.bundle = bundle;
                        if (this.owner) {
                            App.uiManager.addLocal(info, this.owner.className);
                        }
                        else {
                            App.uiManager.garbage.addLocal(info);
                        }
                        //停掉当前播放音乐
                        this.stopMusic();
                        //播放新的背景音乐
                        if (audioInfo && audioInfo.source) {
                            audioInfo.source.clip = data;
                            audioInfo.source.loop = loop;
                            audioInfo.volume = this.musicVolume;
                            //如果当前音乐是开的，才播放
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
                if (env_1.DEBUG) {
                    if (!this.owner) {
                        Log.e(`必须要指定资源的管理都才能播放`);
                        resolve(false);
                        return;
                    }
                }
                //检查是否已经加载过
                let key = this.audioData.makeKey(url, bundle);
                let audioInfo = this.audioData.effectInfos.get(key);
                if (!audioInfo) {
                    audioInfo = new AudioInfo();
                    audioInfo.url = url;
                    audioInfo.bundle = bundle;
                    audioInfo.source = this.node.addComponent(cc_1.AudioSource);
                    audioInfo.owner = this.owner;
                    audioInfo.source.name = key;
                    audioInfo.source.playOnAwake = true;
                    this.audioData.effectInfos.set(key, audioInfo);
                }
                App.cache.getCacheByAsync(url, cc_1.AudioClip, bundle).then((data) => {
                    if (data) {
                        let info = new Resource_1.Resource.Info;
                        info.url = url;
                        info.type = cc_1.AudioClip;
                        info.data = data;
                        info.bundle = bundle;
                        if (this.owner) {
                            App.uiManager.addLocal(info, this.owner.className);
                        }
                        else {
                            App.uiManager.garbage.addLocal(info);
                        }
                        if (audioInfo && audioInfo.source) {
                            audioInfo.source.clip = data;
                            audioInfo.source.loop = loop;
                            audioInfo.source.volume = this.effectVolume;
                            this.play(audioInfo, false, resolve);
                        }
                    }
                    else {
                        resolve(false);
                    }
                });
            });
        }
        play(info, isMusic, resolve) {
            if (info && info.source) {
                if (isMusic) {
                    if (this.isMusicOn) {
                        info.source.play();
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    if (this.isEffectOn) {
                        info.source.play();
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }
            }
            else {
                resolve(false);
            }
        }
        onEnterBackground() {
            this.audioData.pauseAll();
        }
        onEnterForgeground(inBackgroundTime) {
            this.audioData.resumeAll();
        }
    };
    __setFunctionName(_classThis, "AudioComponent");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AudioComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AudioComponent = _classThis;
})();
