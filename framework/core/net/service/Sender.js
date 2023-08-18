"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sender = void 0;
const env_1 = require("cc/env");
const EventProcessor_1 = require("../../event/EventProcessor");
const Macros_1 = require("../../../defines/Macros");
/**
 * @description 该对象只用于对网络数据的发送
 */
class Sender extends EventProcessor_1.EventProcessor {
    constructor() {
        super(...arguments);
        /**@description 该字段由NetHelper指定 */
        this.module = "";
    }
    send(msg) {
        if (this.service && this.service.send) {
            this.service.send(msg);
            return;
        }
        if (env_1.DEBUG) {
            Log.e(`必须绑定Service`);
        }
    }
    debug() {
        Log.d(this.module);
    }
    destory() {
        this.onDestroy();
    }
    init() {
        this.onLoad();
    }
}
exports.Sender = Sender;
/**@description Sender所属模块，如聊天,vip, */
Sender.module = Macros_1.Macro.UNKNOWN;
