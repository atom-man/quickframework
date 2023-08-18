"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartbeatBinary = void 0;
const BinaryStreamMessage_1 = require("../../framework/core/net/message/BinaryStreamMessage");
const CmdDefines_1 = require("./CmdDefines");
/**@description 二进制心跳包 */
class HeartbeatBinary extends BinaryStreamMessage_1.BinaryStreamHeartbeat {
    constructor() {
        super(...arguments);
        this.mainCmd = CmdDefines_1.MainCmd.CMD_SYS;
        this.subCmd = CmdDefines_1.SUB_CMD_SYS.CMD_SYS_HEART;
    }
    get cmd() { return String(this.mainCmd) + String(this.subCmd); }
}
exports.HeartbeatBinary = HeartbeatBinary;
