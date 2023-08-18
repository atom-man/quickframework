"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenderManager = void 0;
const SingletonT_1 = require("../../../utils/SingletonT");
class SenderManager extends SingletonT_1.SingletonT {
    constructor() {
        super(...arguments);
        this.module = null;
    }
}
exports.SenderManager = SenderManager;
SenderManager.module = "【Sender管理器】";
