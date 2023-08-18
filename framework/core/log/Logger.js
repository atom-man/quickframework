"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerImpl = void 0;
/**
 * @description 日志封装
 */
const cc_1 = require("cc");
const Enums_1 = require("../../defines/Enums");
class LoggerImpl {
    constructor() {
        this.logger = console;
        this._level = Enums_1.LogLevel.ALL;
        this.module = null;
        this.isResident = true;
        this.update();
    }
    /**@description 当前日志等级 */
    get level() {
        return this._level;
    }
    set level(level) {
        this._level = level;
        this.update();
    }
    /**
     * @description 附加日志输出类型
     * @param level
     */
    attach(level) {
        if (this.isValid(level)) {
            return;
        }
        this.level = this.level | level;
        this.update();
    }
    /**
     * @description 分离日志输出类型
     **/
    detach(level) {
        if (this.isValid(level)) {
            this.level = this.level ^ level;
            this.update();
        }
    }
    /**@description 当前日志等级是否生效 */
    isValid(level) {
        if (this.level & level) {
            return true;
        }
        return false;
    }
    /**@description 更新日志 */
    update() {
        if (this.isValid(Enums_1.LogLevel.DUMP)) {
            if (cc_1.sys.isBrowser) {
                this.logger.dump = console.debug;
            }
            else {
                this.logger.dump = this.dump.bind(this);
            }
        }
        else {
            this.logger.dump = () => { };
        }
        if (this.isValid(Enums_1.LogLevel.ERROR)) {
            this.logger.e = console.error;
        }
        else {
            this.logger.e = () => { };
        }
        if (this.isValid(Enums_1.LogLevel.DEBUG)) {
            this.logger.d = console.log;
        }
        else {
            this.logger.d = () => { };
        }
        if (this.isValid(Enums_1.LogLevel.WARN)) {
            this.logger.w = console.warn;
        }
        else {
            this.logger.w = () => { };
        }
    }
    dump() {
        if (this.isValid(Enums_1.LogLevel.DUMP)) {
            let deep = arguments[2];
            if (deep == undefined) {
                deep = 5;
            }
            if (Number.isNaN(deep)) {
                deep = 10;
            }
            if (deep > 10) {
                deep = 10;
            }
            if (deep <= 0) {
                deep = 1;
                return;
            }
            //protobuf 数据特殊处理
            let data = arguments[0];
            if (data.toJSON && typeof data.toJSON == "function") {
                data = data.toJSON();
            }
            let ret = this._dump(data, arguments[1], deep, 0);
            this.logger.d(ret);
        }
    }
    convertName(name, flag = "=") {
        let out = name.length > 0 ? `${name} ${flag} ` : ` `;
        return out;
    }
    toBoolean(name, v) {
        return `${this.convertName(name)}${v};`;
    }
    toNumber(name, v) {
        return `${this.convertName(name)}${v}`;
    }
    toStringForDump(name, v) {
        return `${this.convertName(name)}"${v}"`;
    }
    toOther(name, v) {
        return `${this.convertName(name)}${typeof v}`;
    }
    toUnknown(name) {
        let out = name.length > 0 ? `${name} ` : ` `;
        return `${out}is unknown type!`;
    }
    /**@description 缩进 */
    get indentFormat() {
        return "    ";
    }
    /**@description 一半缩进 */
    get halfIndentFormat() {
        return "   ";
    }
    toArray(name, v, deep, curDeep) {
        let out = "";
        let num_elem = 0;
        let indent = '';
        num_elem = v.length;
        let keyName = this.convertName(name, "");
        for (let d = 0; d < curDeep; ++d) {
            indent += ' ';
        }
        out = keyName + "[";
        for (let i = 0; i < num_elem; ++i) {
            out += "\n" + (indent.length === 0 ? '' : '' + indent) + `${this.indentFormat}[${i}]:` + this._dump(v[i], '', deep, curDeep + 1);
        }
        out += "\n" + (indent.length === 0 ? '' : '' + indent + this.halfIndentFormat) + "]";
        return out;
    }
    toObject(name, v, deep, curDeep) {
        let out = "";
        if (v === null) {
            out = "null";
            return out;
        }
        let indent = '';
        if (v instanceof Object) {
            for (let d = 0; d < curDeep; ++d) {
                indent += ' ';
            }
            out = "{";
            for (let p in v) {
                out += "\n" + (indent.length === 0 ? '' : '' + indent) + `${this.indentFormat}${p}:` + this._dump(v[p], '', deep, curDeep + 1);
            }
            out += "\n" + (indent.length === 0 ? '' : '' + indent + this.halfIndentFormat) + "}";
            return out;
        }
        else {
            out = "Unknown Object Type!";
            return out;
        }
    }
    _dump(data, name = "unkown", deep, curDeep) {
        if (curDeep > deep) {
            return "...";
        }
        name = typeof name === 'undefined' ? '' : name;
        let out = '';
        let v_name = '';
        switch (typeof data) {
            case "boolean":
                out += this.toBoolean(v_name, data);
                break;
            case "number":
                out += this.toNumber(v_name, data);
                break;
            case "string":
                out += this.toStringForDump(v_name, data);
                break;
            case "object":
                if (Array.isArray(data)) {
                    out += this.toArray(name, data, deep, curDeep);
                }
                else {
                    out += this.toObject(name, data, deep, curDeep);
                }
                break;
            case "function":
            case "undefined":
                out += this.toOther(name, data);
                break;
            default:
                out += this.toUnknown(name);
        }
        return out;
    }
}
exports.LoggerImpl = LoggerImpl;
LoggerImpl.module = "【日志管理器】";
