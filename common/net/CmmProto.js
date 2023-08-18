"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmmProto = void 0;
const ProtoMessage_1 = require("../../framework/core/net/message/ProtoMessage");
/**@description 根据自己项目扩展 */
class CmmProto extends ProtoMessage_1.ProtoMessage {
    constructor() {
        super(...arguments);
        this.cmd = "";
        this.mainCmd = 0;
        this.subCmd = 0;
    }
}
exports.CmmProto = CmmProto;
