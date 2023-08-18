"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Loading_1 = __importDefault(require("./Loading"));
/**
 * @description 加载动画
 */
class UpdateLoading extends Loading_1.default {
    constructor() {
        super(...arguments);
        this.module = null;
    }
    /**
     * @description 显示Loading
     * @param content 提示内容
     * @param timeOutCb 超时回调
     * @param timeout 显示超时时间
     */
    show(content, timeOutCb, timeout) {
        this.timeOutCb = undefined;
        this._show(999);
        this._content = [];
        if (typeof content == "string") {
            this._content.push(content);
        }
        return this;
    }
    startShowContent() {
        this.text.string = this._content[0];
    }
    updateProgress(progress) {
        if (this.text) {
            if (progress == undefined || progress == null || Number.isNaN(progress) || progress < 0) {
                this.hide();
                return;
            }
            if (progress >= 0 && progress <= 100) {
                this.text.string = App.getLanguage("loadingProgress", [progress]);
            }
        }
    }
}
UpdateLoading.module = "【UpdateLoading】";
exports.default = UpdateLoading;
