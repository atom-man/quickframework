"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const Macros_1 = require("../../defines/Macros");
const cc_1 = require("cc");
const LANG_KEY = "using_language";
class Language {
    constructor() {
        this.isResident = true;
        this.module = null;
        /**@description 支持多语言切换组件 */
        this._components = [];
        /**@description 总语言包数据 */
        this._data = { language: Macros_1.Macro.UNKNOWN };
        /**@description 语言包数据代理 */
        this.delegates = new Map();
    }
    addDelegate(delegate) {
        if (!delegate)
            return;
        this.delegates.set(delegate.bundle, delegate);
        this.updateData(this.getLanguage());
    }
    updateData(language) {
        this._data.language = language;
        this.delegates.forEach((delegate, index, source) => {
            this._data = delegate.merge(language, this._data);
        });
    }
    removeDelegate(delegate) {
        if (!delegate)
            return;
        let result = this.delegates.delete(delegate.bundle);
        if (result) {
            if (delegate.bundle != Macros_1.Macro.BUNDLE_RESOURCES) {
                //主包的语言不释放
                delete this._data[delegate.bundle];
            }
        }
    }
    /**
     * @description 改变语言包
     * @param language 语言包类型
     */
    change(language) {
        if (this.delegates.size <= 0) {
            //请先设置代理
            return;
        }
        if (this._data && this._data.language == language) {
            //当前有语言包数据 相同语言包，不再进行设置
            return;
        }
        this._data.language = language;
        if (Macros_1.Macro.ENABLE_CHANGE_LANGUAGE) {
            //先更新所有数据
            this.delegates.forEach((delegate, index, source) => {
                this._data = delegate.merge(language, this._data);
            });
            //更新带有语言包类型的所有Label
            this.onChangeLanguage();
        }
        else {
            this.delegates.forEach((delegate, index, source) => {
                this._data = delegate.merge(this.getLanguage(), this._data);
            });
        }
        Log.d(this.module, `当前语言:${this._data.language}`);
        App.storage.setItem(LANG_KEY, this._data.language);
    }
    get(args) {
        let result = "";
        do {
            if (!!!args)
                break;
            if (args.length < 1)
                break;
            let keyString = args[0];
            if (typeof keyString != "string") {
                Log.e("key error");
                break;
            }
            if (keyString.indexOf(Macros_1.Macro.USING_LAN_KEY) > -1) {
                let keys = keyString.split(".");
                if (keys.length < 2) {
                    Log.e("key error");
                    break;
                }
                keys.shift(); //删除掉i18n.的头部
                args.shift();
                let data = null;
                while (keys.length > 0) {
                    let key = keys.shift();
                    if (key) {
                        if (!data) {
                            data = this._data[key];
                        }
                        else {
                            data = data[key];
                        }
                    }
                    else {
                        Log.e(`语言包不存在 : ${keyString}`);
                        result = "";
                        break;
                    }
                }
                if (typeof (data) == "string") {
                    result = String.format(data, args);
                }
                else {
                    result = data;
                }
            }
            else {
                //已经是取出的正确语言包，直接格式化
                let data = args.shift();
                if (typeof (data) == "string") {
                    return String.format(data, args);
                }
                else {
                    result = data;
                }
            }
        } while (0);
        return result;
    }
    /**@description 获取语言包名 */
    getLanguage() {
        return App.storage.getItem(LANG_KEY, cc_1.sys.Language.CHINESE);
    }
    /**
     * @description 添加支持多语言的组件
     * @param component
     */
    add(component) {
        if (this._components.indexOf(component) == -1) {
            this._components.push(component);
        }
    }
    /**
     * @description 移除支持多语言的组件
     * @param component
     */
    remove(component) {
        let index = this._components.indexOf(component);
        if (index >= 0) {
            this._components.splice(index, 1);
        }
    }
    /**
     * @description 语言包发生更新，变更语言包Label
     */
    onChangeLanguage() {
        this._components.forEach(v => {
            if ((0, cc_1.isValid)(v)) {
                v.forceDoLayout();
            }
        });
    }
}
exports.Language = Language;
Language.module = "【语言包】";
