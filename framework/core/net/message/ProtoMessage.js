"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtoMessageHeartbeat = exports.ProtoCodec = exports.ProtoMessage = void 0;
const Net_1 = require("../Net");
const Message_1 = require("./Message");
/**
 * @description protobuf解析基类
 */
class ProtoMessage extends Message_1.Message {
    constructor(protoType) {
        super();
        /**@description 发送或接收的消息流 */
        this.buffer = null;
        /**@description 直接把真正的Proto类型给赋值 */
        this.type = null;
        /**@description 真空的Proto数据 */
        this.data = null;
        this.type = protoType;
    }
    /**@description 打包数据 */
    encode() {
        this.buffer = this.type.encode(this.data).finish();
        if (this.buffer) {
            return true;
        }
        return false;
    }
    /**@description 解析数据 */
    decode(data) {
        if (data) {
            this.buffer = data;
            this.data = this.type.decode(this.buffer);
            return true;
        }
        return false;
    }
}
exports.ProtoMessage = ProtoMessage;
class ProtoCodec extends Message_1.Codec {
}
exports.ProtoCodec = ProtoCodec;
class ProtoMessageHeartbeat extends Message_1.Message {
}
exports.ProtoMessageHeartbeat = ProtoMessageHeartbeat;
ProtoMessageHeartbeat.type = Net_1.Net.ServiceType.Proto;
