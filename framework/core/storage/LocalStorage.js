"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
const env_1 = require("cc/env");
const BitEncrypt_1 = require("../../plugin/BitEncrypt");
class LocalStorage {
    constructor() {
        this.module = null;
        this.key = "VuxiAKihQ0VR9WRe";
    }
    encrypt(obj) {
        return BitEncrypt_1.BitEncrypt.encode(JSON.stringify(obj), this.key);
    }
    decryption(word) {
        return BitEncrypt_1.BitEncrypt.decode(word, this.key);
    }
    getItem(key, defaultValue = null) {
        if (env_1.EDITOR) {
            return defaultValue;
        }
        let value = this.storage.getItem(key);
        if (value) {
            //解析
            try {
                let data = this.decryption(value);
                let result = JSON.parse(data);
                if (result.type) {
                    return result.value;
                }
                else {
                    return value;
                }
            }
            catch (error) {
                return value;
            }
        }
        else {
            return defaultValue;
        }
    }
    setItem(key, value) {
        if (env_1.EDITOR) {
            return;
        }
        let type = typeof value;
        if (type == "number" || type == "string" || type == "boolean" || type == "object") {
            let saveObj = { type: type, value: value };
            //加密
            try {
                let data = this.encrypt(saveObj);
                this.storage.setItem(key, data);
            }
            catch (err) {
                if (env_1.DEBUG)
                    Log.e(err);
            }
        }
        else {
            if (env_1.DEBUG)
                Log.e(`存储数据类型不支持 当前的存储类型: ${type}`);
        }
    }
    removeItem(key) {
        if (env_1.EDITOR)
            return;
        this.storage.removeItem(key);
    }
    get storage() {
        return window.localStorage;
    }
}
exports.LocalStorage = LocalStorage;
LocalStorage.module = "【本地仓库】";
