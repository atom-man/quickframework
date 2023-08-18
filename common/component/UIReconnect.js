"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIReconnect = void 0;
const Loading_1 = __importDefault(require("./Loading"));
/**
 * @description 重连专用提示UI
 */
class UIReconnect extends Loading_1.default {
    constructor() {
        super(...arguments);
        this.module = null;
        this.isResident = true;
    }
    startTimeOutTimer(timeout) {
        //do nothing
    }
    stopTimeOutTimer() {
        //do nothing
    }
}
exports.UIReconnect = UIReconnect;
UIReconnect.module = "【重连提示】";
