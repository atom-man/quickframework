"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingletonT = void 0;
const Macros_1 = require("../defines/Macros");
/**
 * @description 单例模板
 */
class SingletonT {
    constructor() {
        this._datas = new Map();
        this.module = null;
    }
    /**
     * @description 获取数据
     * @param typeOrkey 具体数据的实现类型或key
     * @param isCreate
     */
    get(typeOrkey, isCreate = true, ...args) {
        let key = this.getKey(typeOrkey);
        if (key == Macros_1.Macro.UNKNOWN) {
            return null;
        }
        if (this._datas.has(key)) {
            return (this._datas.get(key));
        }
        if (typeof typeOrkey != "string" && isCreate) {
            let data = null;
            if (typeOrkey.instance) {
                data = typeOrkey.instance;
            }
            else {
                data = new typeOrkey();
            }
            data.module = typeOrkey.module;
            Log.d(`${data.module}初始化`);
            data.init && data.init(...args);
            this._datas.set(typeOrkey.module, data);
            return data;
        }
        return null;
    }
    /**
     * @description 销毁
     * @param typeOrkey 如果无参数时，则表示销毁所有不常驻的单例
     */
    destory(typeOrkey) {
        if (typeOrkey) {
            let key = this.getKey(typeOrkey);
            if (this._datas.has(key)) {
                Log.d(`${key}销毁`);
                let v = this._datas.get(key);
                if (v) {
                    v.destory && v.destory();
                }
                this._datas.delete(key);
                return true;
            }
            return false;
        }
        else {
            this._datas.forEach(v => {
                if (v.isResident) {
                    Log.d(`${v.module}为常驻单列，不做销毁处理`);
                }
                else {
                    Log.d(`${v.module}销毁`);
                    v.destory && v.destory();
                    this._datas.delete(v.module);
                }
            });
            return true;
        }
    }
    /**
     * @description 清空数据
     * @param exclude 排除项
     */
    clear(exclude) {
        if (exclude) {
            //需要排除指定数据类型
            this._datas.forEach((data, key) => {
                if (!this.isInExclude(data, exclude)) {
                    Log.d(`${data.module}清理`);
                    data.clear && data.clear();
                }
            });
        }
        else {
            this._datas.forEach((data, key) => {
                Log.d(`${data.module}清理`);
                data.clear && data.clear();
            });
        }
    }
    debug() {
        Log.d(`************************** ${this.module} 开始 **************************`);
        this._datas.forEach((data, key, source) => {
            if (data.debug) {
                data.debug();
            }
            else {
                Log.d(`${data.module} : 未实现debug接口`);
            }
        });
        Log.d(`************************** ${this.module} 结束 **************************`);
    }
    /**
     * @description 判断是滞在排除项中
     */
    isInExclude(data, exclude) {
        if (!exclude)
            return false;
        for (let i = 0; i < exclude.length; i++) {
            let key = this.getKey(exclude[i]);
            if (key == data.module) {
                return true;
            }
        }
        return false;
    }
    getKey(data) {
        let key = Macros_1.Macro.UNKNOWN;
        if (typeof data == "string") {
            key = data;
        }
        else {
            key = data.module;
        }
        return key;
    }
}
exports.SingletonT = SingletonT;
