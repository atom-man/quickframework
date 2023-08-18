"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerManager = void 0;
const SingletonT_1 = require("../../../utils/SingletonT");
class HandlerManager extends SingletonT_1.SingletonT {
    constructor() {
        super(...arguments);
        this.module = null;
    }
}
exports.HandlerManager = HandlerManager;
HandlerManager.module = "【Handler管理器】";
