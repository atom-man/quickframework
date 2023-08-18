"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
const SingletonT_1 = require("./SingletonT");
/**
 * @description 单列管理
 */
class Singleton extends SingletonT_1.SingletonT {
    constructor() {
        super(...arguments);
        this.module = "【单列管理器】";
    }
    static get instance() { return this._instance || (this._instance = new Singleton()); }
    /**
     * @description 获取数据
     * @param typeOrkey 具体数据的实现类型或key
     * @param isCreate
     */
    static get(typeOrkey, isCreate = true, ...args) {
        return this.instance.get(typeOrkey, isCreate, ...args);
    }
    /**
    * @description 销毁
    * @param typeOrkey 如果无参数时，则表示销毁所有不常驻的单例
    */
    static destory(typeOrkey) {
        return this.instance.destory(typeOrkey);
    }
    /**
     * @description 清空数据
     * @param exclude 排除项
     */
    static clear(exclude) {
        this.instance.clear();
    }
    static debug() {
        this.instance.debug();
    }
}
exports.Singleton = Singleton;
Singleton._instance = null;
