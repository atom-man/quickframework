"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCodec = void 0;
const Macros_1 = require("../../../defines/Macros");
const ByteArray_1 = require("../../../plugin/ByteArray");
const Message_1 = require("./Message");
class DefaultCodec extends Message_1.Codec {
    constructor() {
        super(...arguments);
        /**@description 消息主cmd码 */
        this.mainCmd = 0;
        /**@description 消息子cmd码 */
        this.subCmd = 0;
        /**@description 数据buffer */
        this.buffer = null;
        this.headerSize = 3 * Uint32Array.BYTES_PER_ELEMENT;
    }
    pack(data) {
        this.mainCmd = data.mainCmd;
        this.subCmd = data.subCmd;
        let dataSize = 0;
        /**第一种写法 */
        if (data.buffer) {
            //如果有包体，先放入包体
            dataSize = data.buffer.length;
        }
        let buffer = new ByteArray_1.ByteArray();
        buffer.endian = Macros_1.Macro.USING_LITTLE_ENDIAN;
        buffer.writeUnsignedInt(this.mainCmd);
        buffer.writeUnsignedInt(this.subCmd);
        buffer.writeUnsignedInt(dataSize);
        if (data.buffer) {
            let dataBuffer = new ByteArray_1.ByteArray(data.buffer);
            buffer.writeBytes(dataBuffer);
        }
        this.buffer = buffer.bytes;
        return true;
    }
    unPack(event) {
        let dataView = new ByteArray_1.ByteArray(event.data);
        dataView.endian = Macros_1.Macro.USING_LITTLE_ENDIAN;
        //取包头
        this.mainCmd = dataView.readUnsignedInt();
        this.subCmd = dataView.readUnsignedInt();
        let dataSize = dataView.readUnsignedInt();
        let buffer = dataView.buffer.slice(dataView.position);
        this.buffer = new Uint8Array(buffer);
        return dataSize == this.buffer.length;
    }
    get cmd() { return String(this.mainCmd) + String(this.subCmd); }
}
exports.DefaultCodec = DefaultCodec;
