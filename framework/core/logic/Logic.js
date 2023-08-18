"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logic = void 0;
const cc_1 = require("cc");
const EventProcessor_1 = require("../event/EventProcessor");
const Macros_1 = require("../../defines/Macros");
class Logic extends EventProcessor_1.EventProcessor {
    constructor() {
        super(...arguments);
        /**@description 所属模块,管理器设置，GameView中的bundle的值 */
        this.module = Macros_1.Macro.UNKNOWN;
        this.gameView = null;
    }
    /**@description 当前逻辑管理器bundle */
    get bundle() {
        return this.module;
    }
    /**@description 重置游戏逻辑 */
    reset(gameView) {
    }
    onLoad(gameView) {
        this.gameView = gameView;
        super.onLoad(gameView);
    }
    update(dt) { }
    destory(...args) {
        this.onDestroy();
    }
    debug() {
        Log.d(`${this.module} : ${cc_1.js.getClassName(this)}`);
    }
}
exports.Logic = Logic;
/**@description 所属模块,管理器设置，GameView中的bundle的值 */
Logic.module = Macros_1.Macro.UNKNOWN;
