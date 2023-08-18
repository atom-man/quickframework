"use strict";
/**
 * @description 二进制数据流解析
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryStreamHeartbeat = exports.BinaryStream = exports.UINT = exports.USHORT = exports.UBYTE = exports.INT = exports.SHORT = exports.BYTE = exports.DOUBLE = exports.FLOAT = exports.STRING = exports.BOOL = exports.serialize = void 0;
const Macros_1 = require("../../../defines/Macros");
const ByteArray_1 = require("../../../plugin/ByteArray");
const Net_1 = require("../Net");
const Message_1 = require("./Message");
function serialize(key, type, arrTypeOrByteSize, byteSize, dimension) {
    return function (target, memberName) {
        if (Reflect.getOwnPropertyDescriptor(target, '__serialize__') === undefined) {
            let selfSerializeInfo = {};
            if (Reflect.getPrototypeOf(target)['__serialize__']) {
                // 父类拥有序列化信息,并且自己没有序列化信息,则拷贝父类到当前类中来
                if (Reflect.getOwnPropertyDescriptor(target, '__serialize__') === undefined) {
                    let parentSerializeInfo = Reflect.getPrototypeOf(target)['__serialize__'];
                    let serializeKeyList = Object.keys(parentSerializeInfo);
                    for (let len = serializeKeyList.length, i = 0; i < len; i++) {
                        selfSerializeInfo[serializeKeyList[i]] = parentSerializeInfo[serializeKeyList[i]].slice(0);
                    }
                }
            }
            Reflect.defineProperty(target, '__serialize__', {
                value: selfSerializeInfo,
            });
        }
        if (target['__serialize__'][key]) {
            throw `SerializeKey has already been declared:${key}`;
        }
        target['__serialize__'][key] = [memberName, type, arrTypeOrByteSize, byteSize, dimension];
    };
}
exports.serialize = serialize;
/**@description 数据流基类 */
class StreamValue {
    constructor() {
        this.data = null;
    }
    read(byteArray) { }
    write(byteArray) { }
    /**@description 网络数据全以大端方式进行处理 */
    get littleEndian() {
        return Macros_1.Macro.USING_LITTLE_ENDIAN;
    }
}
/**@description 数值类型 */
class NumberValue extends StreamValue {
    constructor() {
        super(...arguments);
        this.data = 0;
    }
}
/**@description 字符串类型 */
class BOOL extends StreamValue {
    constructor() {
        super(...arguments);
        this.data = false;
    }
    read(byteArray) {
        //先读取字符串长度
        this.data = byteArray.readBoolean();
    }
    write(byteArray) {
        byteArray.writeBoolean(this.data);
    }
}
exports.BOOL = BOOL;
/**@description 字符串类型 */
class STRING extends StreamValue {
    constructor() {
        super(...arguments);
        this.data = "";
        /**@description 定长字节数大小,注意不是字符串的个数 */
        this.byteSize = undefined;
    }
    read(byteArray) {
        //先读取字符串长度
        let size = this.byteSize;
        if (this.byteSize == undefined) {
            //不定长处理
            size = byteArray.readUnsignedInt();
        }
        this.data = byteArray.readUTFBytes(size);
    }
    write(byteArray) {
        let buffer = new ByteArray_1.ByteArray();
        buffer.writeUTFBytes(this.data, this.byteSize);
        if (this.byteSize == undefined) {
            //不定长处理
            byteArray.writeUnsignedInt(buffer.length);
        }
        byteArray.writeBytes(buffer);
    }
}
exports.STRING = STRING;
class FLOAT extends NumberValue {
    read(byteArray) {
        this.data = byteArray.readFloat();
    }
    write(byteArray) {
        byteArray.writeFloat(this.data);
    }
}
exports.FLOAT = FLOAT;
class DOUBLE extends NumberValue {
    read(byteArray) {
        this.data = byteArray.readDouble();
    }
    write(byteArray) {
        byteArray.writeDouble(this.data);
    }
}
exports.DOUBLE = DOUBLE;
class BYTE extends NumberValue {
    read(byteArray) {
        this.data = byteArray.readByte();
    }
    write(byteArray) {
        byteArray.writeByte(this.data);
    }
}
exports.BYTE = BYTE;
class SHORT extends NumberValue {
    read(byteArray) {
        this.data = byteArray.readShort();
    }
    write(byteArray) {
        byteArray.writeShort(this.data);
    }
}
exports.SHORT = SHORT;
class INT extends NumberValue {
    read(byteArray) {
        this.data = byteArray.readInt();
    }
    write(byteArray) {
        byteArray.writeInt(this.data);
    }
}
exports.INT = INT;
class UBYTE extends NumberValue {
    read(byteArray) {
        this.data = byteArray.readUnsignedByte();
    }
    write(byteArray) {
        byteArray.writeByte(this.data);
    }
}
exports.UBYTE = UBYTE;
class USHORT extends NumberValue {
    read(byteArray) {
        this.data = byteArray.readUnsignedShort();
    }
    write(byteArray) {
        byteArray.writeUnsignedShort(this.data);
    }
}
exports.USHORT = USHORT;
class UINT extends NumberValue {
    read(byteArray) {
        this.data = byteArray.readUnsignedInt();
    }
    write(byteArray) {
        byteArray.writeUnsignedInt(this.data);
    }
}
exports.UINT = UINT;
class BinaryStream extends Message_1.Message {
    constructor() {
        super(...arguments);
        this.byteArray = null;
        this.buffer = null;
    }
    /**@description 将当前数据转成buffer */
    encode() {
        this.byteArray = new ByteArray_1.ByteArray(this.buffer);
        this.byteArray.endian = Macros_1.Macro.USING_LITTLE_ENDIAN;
        this.serialize();
        this.buffer = this.byteArray.bytes;
        return true;
    }
    /**@description 是否是数值类型 */
    isNumberValue(valueType) {
        return valueType == FLOAT || valueType == DOUBLE ||
            valueType == BYTE || valueType == SHORT || valueType == INT ||
            valueType == UBYTE || valueType == USHORT || valueType == UINT;
    }
    isBoolValue(valueType) {
        return valueType == BOOL;
    }
    /**@description 是否是字符串类型 */
    isStringValue(valueType) {
        return valueType == STRING;
    }
    /**@description 序列化 */
    serialize() {
        let __serialize__ = Reflect.getPrototypeOf(this)['__serialize__'];
        if (!__serialize__)
            return null;
        let serializeKeyList = Object.keys(__serialize__);
        for (let len = serializeKeyList.length, i = 0; i < len; i++) {
            let serializeKey = serializeKeyList[i];
            let [memberName, valueType, arrTypeOrByteSize, byteSize, dimension] = __serialize__[serializeKey];
            this.serializeMember(this[memberName], memberName, valueType, arrTypeOrByteSize, byteSize, dimension);
        }
    }
    /**
     * @description 序列化成员变量
     * @param value 该成员变量的值
     * */
    serializeMember(value, memberName, valueType, arrTypeOrByteSize, byteSize, dimension) {
        if (this.isNumberValue(valueType)) {
            this.serializeNumberStreamValue(value, valueType);
        }
        else if (this.isBoolValue(valueType)) {
            this.serializeBoolValue(value, valueType);
        }
        else if (this.isStringValue(valueType)) {
            this.serializeStringStreamValue(value, valueType, arrTypeOrByteSize);
        }
        else if (value instanceof Array) {
            this.serializeArray(value, memberName, valueType, arrTypeOrByteSize, byteSize, dimension);
        }
        else if (value instanceof BinaryStream) {
            value.byteArray = this.byteArray;
            value.serialize();
        }
        else {
            Log.e(`序列化成员 : ${memberName} 出错!!`);
        }
    }
    serializeNumberStreamValue(value, valueType) {
        let type = new valueType();
        type.data = (value === undefined || value === null || value == Number.NaN) ? 0 : value;
        type.write(this.byteArray);
    }
    serializeBoolValue(value, valueType) {
        let type = new valueType();
        type.data = (value === undefined || value === null) ? false : value;
        type.write(this.byteArray);
    }
    serializeStringStreamValue(value, valueType, byteSize) {
        let type = new valueType();
        type.byteSize = byteSize;
        type.data = (value === undefined || value === null) ? "" : value;
        type.write(this.byteArray);
    }
    /**@description 检测当前数组的维度是否有效 */
    checkArrayDimension(value, dimension) {
        let count = 0;
        let temp = value;
        do {
            count++;
            temp = temp[0];
        } while (temp && Array.isArray(temp) && temp.length > 0);
        return count == dimension;
    }
    serializeArray(value, memberName, valueType, arrType, byteSize, dimension) {
        //先写入数组的大小
        if (dimension == undefined) {
            dimension = 1;
        }
        if (!this.checkArrayDimension(value, dimension)) {
            Log.e(`${memberName} 定义数组跟序列化的数组维度不一致`);
            return;
        }
        this.byteArray.writeUnsignedInt(value.length);
        for (let i = 0; i < value.length; i++) {
            if (value[i] instanceof Array) {
                //多维的数组
                this.serializeArray(value[i], `${memberName}[${i}]`, valueType, arrType, byteSize, dimension - 1);
            }
            else {
                this.serializeMember(value[i], `${memberName}[${i}]`, arrType, byteSize, undefined);
            }
        }
    }
    /**@description 从二进制数据中取数据 */
    decode(data) {
        this.buffer = data;
        this.byteArray = new ByteArray_1.ByteArray(data);
        this.byteArray.endian = Macros_1.Macro.USING_LITTLE_ENDIAN;
        this.deserialize();
        return true;
    }
    /**
     * @description 从json压缩对象信息 反序列化为实体类字段信息
     * @param data json压缩对象
     * */
    deserialize() {
        let __serializeInfo = Reflect.getPrototypeOf(this)['__serialize__'];
        if (!__serializeInfo)
            return true;
        let serializeKeyList = Object.keys(__serializeInfo);
        for (let len = serializeKeyList.length, i = 0; i < len; i++) {
            let serializeKey = serializeKeyList[i];
            let [memberName, valueType, arrTypeOrByteSize, byteSize, dimension] = __serializeInfo[serializeKey];
            this.deserializeMember(memberName, valueType, arrTypeOrByteSize, byteSize, dimension);
        }
    }
    /**
     * @description 反序列化成
     * @param memberName 成员变量名
     * @param memberType 成员变量类型
     * @param arrTypeOrByteSize 数组值类型/Map的key类型
     * @param byteSize Map的值类型
     * @param value json压缩对象
     */
    deserializeMember(memberName, memberType, arrTypeOrByteSize, byteSize, dimension) {
        try {
            let originValue = this[memberName];
            if (this.isNumberValue(memberType)) {
                this[memberName] = this.deserializeNumberStreamValue(memberName, memberType);
            }
            else if (this.isBoolValue(memberType)) {
                this[memberName] = this.deserializeBoolValue(memberName, memberType);
            }
            else if (this.isStringValue(memberType)) {
                this[memberName] = this.deserializeStringStreamValue(memberName, memberType, arrTypeOrByteSize);
            }
            else if (originValue instanceof Array) {
                this.deserializeArray(memberName, memberType, arrTypeOrByteSize, byteSize, dimension);
            }
            else if (originValue instanceof BinaryStream) {
                originValue.byteArray = this.byteArray;
                originValue.deserialize();
            }
            else {
                Log.e(`deserializeMember ${memberName} error!!!`);
            }
        }
        catch (err) {
            Log.w(err.message);
            Log.e(`deserializeMember ${memberName} error!!!`);
        }
    }
    deserializeNumberStreamValue(memberName, memberType) {
        let value = new memberType();
        value.read(this.byteArray);
        return value.data;
    }
    deserializeBoolValue(memberName, memberType) {
        let value = new memberType();
        value.read(this.byteArray);
        return value.data;
    }
    deserializeStringStreamValue(memberName, memberType, arrTypeOrMapKeyType) {
        let value = new memberType();
        value.byteSize = arrTypeOrMapKeyType;
        value.read(this.byteArray);
        return value.data;
    }
    _deserializeArray(originValue, memberName, memberType, arrTypeOrByteSize, byteSize, dimension = 1) {
        if (dimension <= 0) {
            return;
        }
        //先读数组大小
        let size = this.byteArray.readUnsignedInt();
        let index = 0;
        for (let i = 0; i < size; i++) {
            if (dimension > 1) {
                originValue.push([]);
                this._deserializeArray(originValue[index], `${memberName}[${index}]`, memberType, arrTypeOrByteSize, byteSize, dimension - 1);
                index++;
            }
            else {
                let type = new arrTypeOrByteSize();
                if (type instanceof BinaryStream) {
                    type.byteArray = this.byteArray;
                    originValue[i] = type.deserialize();
                }
                else if (type instanceof STRING) {
                    type.byteSize = byteSize;
                    type.read(this.byteArray);
                    originValue[i] = type.data;
                }
                else {
                    type.read(this.byteArray);
                    originValue[i] = type.data;
                }
            }
        }
    }
    deserializeArray(memberName, memberType, arrTypeOrByteSize, byteSize, dimension) {
        //重新解析，初始化时可能已经赋值，需要先清空对象
        this[memberName] = [];
        //用初始化类型数据来判断是否是多维数组
        //先取取数组大小
        if (dimension == undefined) {
            //未指定维度，按一维处理
            dimension = 1;
        }
        this._deserializeArray(this[memberName], memberName, memberType, arrTypeOrByteSize, byteSize, dimension);
    }
}
exports.BinaryStream = BinaryStream;
class BinaryStreamHeartbeat extends BinaryStream {
}
exports.BinaryStreamHeartbeat = BinaryStreamHeartbeat;
BinaryStreamHeartbeat.type = Net_1.Net.ServiceType.BinaryStream;
