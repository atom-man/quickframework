"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartbeatJson = void 0;
const JsonMessage_1 = require("../../framework/core/net/message/JsonMessage");
const CmdDefines_1 = require("./CmdDefines");
/**@description json心跳包 */
class HeartbeatJson extends JsonMessage_1.JsonMessageHeartbeat {
    constructor() {
        super(...arguments);
        this.buffer = null;
        this.mainCmd = CmdDefines_1.MainCmd.CMD_SYS;
        this.subCmd = CmdDefines_1.SUB_CMD_SYS.CMD_SYS_HEART;
    }
    get cmd() { return String(this.mainCmd) + String(this.subCmd); }
}
exports.HeartbeatJson = HeartbeatJson;
