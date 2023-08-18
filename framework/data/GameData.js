"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameData = void 0;
const Macros_1 = require("../defines/Macros");
/**@description 游戏内数据的公共基类 */
class GameData {
    constructor() {
        /**@description 数据所有模块，由数据中心设置 */
        this.module = "";
    }
    /**@description 初始化 */
    init(...args) {
    }
    /**@description 销毁(单列销毁时调用) */
    destory(...args) {
    }
    /**@description 清理数据 */
    clear(...args) {
    }
    debug() {
        Log.d(`${this.module}`);
    }
}
exports.GameData = GameData;
GameData.module = Macros_1.Macro.UNKNOWN;
