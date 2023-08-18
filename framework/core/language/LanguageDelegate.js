"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectLanguageData = exports.LanguageDelegate = void 0;
const env_1 = require("cc/env");
/**
 * @description 语言包数据代理
 */
class LanguageDelegate {
    constructor() {
        this.datas = new Map();
        this.init();
    }
    add(data) {
        this.datas.set(data.language, data);
    }
    /**
     * @description 数据合并,由管理器Language调用
     * @param language 语言
     * @param source 总语言包数据
     */
    merge(language, source) {
        let realData = this.datas.get(language);
        if (realData) {
            source[this.bundle] = realData.data;
        }
        return source;
    }
}
exports.LanguageDelegate = LanguageDelegate;
/**
 * @description 编辑器模式下注入Bundle语言包数据
 * @param type Language.DataSourceDelegate
 */
function injectLanguageData(type) {
    if (env_1.EDITOR) {
        let data = new type;
        App.language.addDelegate(data);
    }
}
exports.injectLanguageData = injectLanguageData;
