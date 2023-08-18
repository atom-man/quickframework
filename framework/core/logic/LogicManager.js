"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicManager = void 0;
const SingletonT_1 = require("../../utils/SingletonT");
class LogicManager extends SingletonT_1.SingletonT {
    constructor() {
        super(...arguments);
        this.module = null;
    }
    /**
     * @description 返回Logic
     * @param classOrBundle logic类型,如果传入bundle,isCreate 无效
     * @param isCreate 找不到数据时，是否创建，默认为不创建
     */
    get(classOrBundle, isCreate = false) {
        return super.get(classOrBundle, isCreate);
    }
}
exports.LogicManager = LogicManager;
LogicManager.module = "【逻辑管理器】";
