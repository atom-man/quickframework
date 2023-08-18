"use strict";
/**
 * @description 事件处理组件
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventProcessor = void 0;
const cc_1 = require("cc");
class EventProcessor {
    constructor() {
        /**@description Dispatcher 事件 */
        this._eventsD = new Map();
        /**@description game 事件 */
        this._eventsG = [];
        /**@description  输入事件*/
        this._eventsI = [];
    }
    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name
     * @param func
     */
    onD(name, func) {
        this.on({
            bind: "Dispatcher",
            type: name,
            cb: func
        });
    }
    onceD(eventName, func) {
        this.once({
            bind: "Dispatcher",
            type: eventName,
            cb: func,
        });
    }
    offD(eventName) {
        this.off({
            bind: "Dispatcher",
            type: eventName,
        });
    }
    onG(type, cb) {
        this.on({
            bind: "Game",
            type: type,
            cb: cb,
        });
    }
    onceG(type, cb) {
        this.once({
            bind: "Game",
            type: type,
            cb: cb,
        });
    }
    offG(type, cb) {
        this.off({
            bind: "Game",
            type: type,
            cb: cb
        });
    }
    onI(eventType, cb) {
        this.on({
            bind: "Input",
            type: eventType,
            cb: cb,
        });
    }
    onceI(eventType, cb) {
        this.once({
            bind: "Input",
            type: eventType,
            cb: cb,
        });
    }
    offI(eventType, cb) {
        this.off({
            bind: "Input",
            type: eventType,
            cb: cb
        });
    }
    onN(node, type, cb, target, useCapture) {
        this.on({
            bind: "Node",
            type: type,
            cb: cb,
            target: target,
            useCapture: useCapture,
            node: node,
        });
    }
    onceN(node, type, cb, target, useCapture) {
        this.once({
            bind: "Node",
            type: type,
            cb: cb,
            target: target,
            useCapture: useCapture,
            node: node
        });
    }
    offN(node, type, cb, target, useCapture) {
        this.off({
            bind: "Node",
            type: type,
            cb: cb,
            target: target,
            useCapture: useCapture,
            node: node
        });
    }
    addEvents() {
    }
    onLoad(...args) {
        this.addEvents();
    }
    onDestroy(...args) {
        this._cleanD();
        this._cleanG();
        this._cleanI();
        this._cleanN();
    }
    on(args) {
        switch (args.bind) {
            case "Dispatcher":
                this._onD(args);
                break;
            case "Game":
                this._onG(args);
                break;
            case "Input":
                this._onI(args);
                break;
            case "Node":
                this._onN(args);
                break;
            default: Log.e(`on ${args.bind} 未知事件类型`);
        }
    }
    once(args) {
        args.once = true;
        this.on(args);
    }
    off(args) {
        switch (args.bind) {
            case "Dispatcher":
                this._offD(args);
                break;
            case "Game":
                this._offG(args);
                break;
            case "Input":
                this._offI(args);
                break;
            case "Node":
                this._offN(args);
                break;
            default: Log.e(`off ${args.bind} 未知事件类型`);
        }
    }
    _onD(args) {
        if (!args.target) {
            args.target = this;
        }
        if (this._eventsD.has(args.type)) {
            Log.e(`${args.type} 重复注册`);
            return;
        }
        App.dispatcher.add(args.type, args.cb, args.target, args.once);
        this._eventsD.set(args.type, args);
    }
    _offD(args) {
        if (!args.target) {
            args.target = this;
        }
        if (this._eventsD.has(args.type)) {
            //事件移除
            App.dispatcher.remove(args.type, args.target);
            //删除本地事件
            this._eventsD.delete(args.type);
        }
    }
    _cleanD() {
        this._eventsD.forEach((args, name) => {
            App.dispatcher.remove(args.type, args.target);
        });
        this._eventsD.clear();
    }
    _onG(args) {
        if (!args.target) {
            args.target = this;
        }
        if (cc_1.game.hasEventListener(args.type, args.cb, args.target)) {
            return;
        }
        cc_1.game.on(args.type, args.cb, args.target, args.once);
        this._eventsG.push(args);
    }
    _offG(args) {
        if (!args.target) {
            args.target = this;
        }
        cc_1.game.off(args.type, args.cb, args.target);
        for (let i = 0; i < this._eventsG.length; i++) {
            const ele = this._eventsG[i];
            if (ele.type == args.type && ele.cb == args.cb && ele.target == ele.target) {
                this._eventsG.splice(i, 1);
                break;
            }
        }
    }
    _cleanG() {
        for (let i = 0; i < this._eventsG.length; i++) {
            const ele = this._eventsG[i];
            cc_1.game.off(ele.type, ele.cb, ele.target);
        }
        this._eventsG = [];
    }
    _onI(args) {
        if (!args.target) {
            args.target = this;
        }
        if (this._has(this._eventsI, args)) {
            return;
        }
        if (args.once) {
            cc_1.input.once(args.type, args.cb, args.target);
        }
        else {
            cc_1.input.on(args.type, args.cb, args.target);
        }
        this._eventsI.push(args);
    }
    _offI(args) {
        if (!args.target) {
            args.target = this;
        }
        cc_1.input.off(args.type, args.cb, args.target);
        for (let i = 0; i < this._eventsI.length; i++) {
            const ele = this._eventsI[i];
            if (ele.type == args.type && ele.cb == args.cb && ele.target == ele.target) {
                this._eventsI.splice(i, 1);
                break;
            }
        }
    }
    _cleanI() {
        for (let i = 0; i < this._eventsI.length; i++) {
            const ele = this._eventsI[i];
            cc_1.input.off(ele.type, ele.cb, ele.target);
        }
        this._eventsI = [];
    }
    _onN(args) {
        var _a, _b;
        if (!args.target) {
            args.target = this;
        }
        if (!(0, cc_1.isValid)(args.node)) {
            return;
        }
        if (args.once) {
            (_a = args.node) === null || _a === void 0 ? void 0 : _a.once(args.type, args.cb, args.target, args.useCapture);
        }
        else {
            (_b = args.node) === null || _b === void 0 ? void 0 : _b.on(args.type, args.cb, args.target, args.useCapture);
        }
    }
    _offN(args) {
        var _a;
        if (!args.target) {
            args.target = this;
        }
        if (!(0, cc_1.isValid)(args.node)) {
            return;
        }
        (_a = args.node) === null || _a === void 0 ? void 0 : _a.off(args.type, args.cb, args.target, args.useCapture);
    }
    _cleanN() {
    }
    _has(datas, args) {
        for (let i = 0; i < datas.length; i++) {
            const element = datas[i];
            if (element.type == args.type &&
                element.cb == args.cb &&
                element.target == args.target) {
                return true;
            }
        }
        return false;
    }
}
exports.EventProcessor = EventProcessor;
