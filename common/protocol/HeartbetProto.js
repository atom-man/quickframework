"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartbeatProto = void 0;
const CmdDefines_1 = require("./CmdDefines");
const ProtoMessage_1 = require("../../framework/core/net/message/ProtoMessage");
/**@description protobuf心跳包 */
class HeartbeatProto extends ProtoMessage_1.ProtoMessageHeartbeat {
    constructor() {
        super(...arguments);
        this.buffer = null;
        this.mainCmd = CmdDefines_1.MainCmd.CMD_SYS;
        this.subCmd = CmdDefines_1.SUB_CMD_SYS.CMD_SYS_HEART;
    }
    encode() { return true; }
    decode(data) { return true; }
    get cmd() { return String(this.mainCmd) + String(this.subCmd); }
}
exports.HeartbeatProto = HeartbeatProto;
