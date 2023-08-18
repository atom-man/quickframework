"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const UIView_1 = __importDefault(require("../../framework/core/ui/UIView"));
const Decorators_1 = require("../../framework/defines/Decorators");
const Macros_1 = require("../../framework/defines/Macros");
const { ccclass } = cc_1._decorator;
exports.default = (() => {
    let _classDecorators = [ccclass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    var SettingView = _classThis = class extends UIView_1.default {
        constructor() {
            super(...arguments);
            this.musicStatus = (__runInitializers(this, _instanceExtraInitializers), null);
            this.effectStatus = null;
            this.musicVolume = null;
            this.effectVolume = null;
            this.content = __runInitializers(this, _content_initializers, null);
        }
        static getPrefabUrl() {
            return "common/prefabs/SettingView";
        }
        onLoad() {
            super.onLoad();
            this.onN((0, cc_1.find)("close", this.content), cc_1.Input.EventType.TOUCH_END, this.onClose);
            this.onN((0, cc_1.find)("background/quit", this.content), cc_1.Input.EventType.TOUCH_END, this.onQuit);
            let music = (0, cc_1.find)("background/musicVolume", this.content);
            this.onN(music, "slide", this.onMusicVolumeChange);
            let effect = (0, cc_1.find)("background/effectVolume", this.content);
            this.onN(effect, "slide", this.onEffectVolumeChange);
            this.musicVolume = music.getComponent(cc_1.Slider);
            this.effectVolume = effect.getComponent(cc_1.Slider);
            this.musicVolume.progress = App.globalAudio.musicVolume;
            this.effectVolume.progress = App.globalAudio.effectVolume;
            this.onMusicVolumeChange(this.musicVolume);
            this.onEffectVolumeChange(this.effectVolume);
            let musicStatusNode = (0, cc_1.find)("background/musicStatus", this.content);
            this.musicStatus = musicStatusNode.getComponent(cc_1.Toggle);
            let effectStatusNode = (0, cc_1.find)("background/effectStatus", this.content);
            this.effectStatus = effectStatusNode.getComponent(cc_1.Toggle);
            this.onN(musicStatusNode, "toggle", this.onMusicStatusChange);
            this.onN(effectStatusNode, "toggle", this.onEffectStatusChange);
            this.musicStatus.isChecked = App.globalAudio.isMusicOn;
            this.effectStatus.isChecked = App.globalAudio.isEffectOn;
            this.onMusicStatusChange(this.musicStatus, false);
            this.onEffectStatusChange(this.effectStatus, false);
            this.show(this.args);
        }
        get showAction() {
            return (complete) => {
                App.utils.showView(this.content, complete);
            };
        }
        get closeAction() {
            return (complete) => {
                App.utils.hideView(this.content, complete);
            };
        }
        onClose() {
            this.close();
        }
        onQuit() {
            this.close();
            App.alert.show({
                immediatelyCallback: true,
                text: App.getLanguage("quitGame"),
                confirmCb: (isOk) => {
                    if (isOk) {
                        App.entryManager.enterBundle(Macros_1.Macro.BUNDLE_RESOURCES);
                    }
                },
            });
        }
        onMusicVolumeChange(target) {
            // Log.d("onMusicVolumeChange",target.progress);
            App.globalAudio.musicVolume = target.progress;
            target.node.getComponent(cc_1.ProgressBar).progress = target.progress;
        }
        onEffectVolumeChange(target) {
            // Log.d("onEffectVolumeChange",target.progress);
            App.globalAudio.effectVolume = target.progress;
            target.node.getComponent(cc_1.ProgressBar).progress = target.progress;
        }
        onMusicStatusChange(target, isPlay) {
            if (isPlay == undefined)
                App.globalAudio.playButtonClick();
            target.node.getChildByName("off").active = !target.isChecked;
            App.globalAudio.isMusicOn = target.isChecked;
        }
        onEffectStatusChange(target, isPlay) {
            if (isPlay == undefined)
                App.globalAudio.playButtonClick();
            target.node.getChildByName("off").active = !target.isChecked;
            App.globalAudio.isEffectOn = target.isChecked;
        }
    };
    __setFunctionName(_classThis, "SettingView");
    (() => {
        _content_decorators = [(0, Decorators_1.inject)("content", cc_1.Node)];
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } } }, _content_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SettingView = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SettingView = _classThis;
})();
