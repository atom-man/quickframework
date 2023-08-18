"use strict";
/**
 * @description 位加密,不增加数据本身大小进行位置加密
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitEncrypt = void 0;
const env_1 = require("cc/env");
class _BitEncrypt {
    constructor() {
        this.logTag = `[BitEncrypt]:`;
        this._encryptKey = "EskKbMvzZBILhcTv";
    }
    set encryptKey(value) {
        this._encryptKey = value;
    }
    /**@description 加密解密 密钥 */
    get encryptKey() {
        return this._encryptKey;
    }
    /**
     * @description 解密
     * @param content 加密的内容
     * @param key 解密的key 加密/解密的key保持一致，如果不传可通过设置encryptKey
     */
    decode(content, key) {
        return this._code(content, key);
    }
    /**
     * @description 加密
     * @param content 未加密内容
     * @param key 加密的key 加密/解密的key保持一致 如果不传可通过设置encryptKey
     */
    encode(content, key) {
        return this._code(content, key);
    }
    _code(content, key) {
        let result = this._check(content, key);
        if (result.isOK) {
            let contentCharCode = [];
            for (let i = 0; i < content.length; i++) {
                contentCharCode.push(content.charCodeAt(i));
            }
            let index = 0;
            let ch = "";
            //对中文，及以下的其它字符串进行位加密
            let regex = /[\w\d_-`~#!$%^&*(){}=+;:'"<,>,/?|\\\u4e00-\u9fa5]/g;
            for (let i = 0; i < contentCharCode.length; i++) {
                //只有子母，数字，
                let matchs = content[i].match(regex);
                if (matchs && matchs.length > 0) {
                    //替换字符
                    contentCharCode[i] ^= result.key.charCodeAt(index);
                    ch = String.fromCharCode(contentCharCode[i]);
                    matchs = ch.match(regex);
                    if (matchs && matchs.length) {
                        //转换后仍然是可显示字符
                    }
                    else {
                        //转成了不能显示的字符，把它恢复原样
                        contentCharCode[i] ^= result.key.charCodeAt(index);
                    }
                    index++;
                    if (index >= result.key.length) {
                        index = 0;
                    }
                }
                else {
                    //不替换字符
                }
            }
            let newContent = "";
            for (let i = 0; i < contentCharCode.length; i++) {
                newContent += String.fromCharCode(contentCharCode[i]);
            }
            return newContent;
        }
        else {
            if (env_1.DEBUG)
                Log.e(exports.BitEncrypt.logTag, `encode/decode error content : ${content} key : ${key}`);
            return content;
        }
    }
    _check(content, key) {
        if (content && content.length > 0) {
            if (key && key.length > 0) {
                //使用传的key进行加解密
                return { isOK: true, key: key };
            }
            else {
                if (this.encryptKey && this.encryptKey.length > 0) {
                    return { isOK: true, key: this.encryptKey };
                }
                else {
                    return { isOK: false, key: "" };
                }
            }
        }
        else {
            return { isOK: false, key: "" };
        }
    }
}
exports.BitEncrypt = new _BitEncrypt();
//window[`BitEncrypt`] = BitEncrypt;
