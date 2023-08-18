"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCenter = void 0;
const SingletonT_1 = require("../utils/SingletonT");
class DataCenter extends SingletonT_1.SingletonT {
    constructor() {
        super(...arguments);
        this.module = null;
    }
}
exports.DataCenter = DataCenter;
DataCenter.module = "【数据中心】";
