"use strict";
/**
 * @description 事件派发器，原生的，当前节点没有在运行时，无法收到消息
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatcher = void 0;
class Dispatcher {
    static get instance() { return this._instance || (this._instance = new Dispatcher()); }
    constructor() {
        this._eventCaches = null;
        this.isResident = true;
        this.module = null;
        this._eventCaches = {};
    }
    destory() {
        Dispatcher._instance = null;
    }
    /**
     * @description 添加事件
     * @param type 事件类型
     * @param callback 事件回调
     * @param target target
     */
    add(type, callback, target, once) {
        if (!type || !callback || !target)
            return;
        let eventCaches = this._eventCaches[type] || [];
        let hasSame = false;
        for (let i = 0; i < eventCaches.length; i++) {
            if (eventCaches[i].target === target) {
                hasSame = true;
                break;
            }
        }
        if (hasSame) {
            return;
        }
        let newEvent = { type: type, callback: callback, target: target, once: once };
        eventCaches.push(newEvent);
        this._eventCaches[type] = eventCaches;
    }
    /**
     * @description 移除事件
     * @param type 事件类型
     * @param target
     */
    remove(type, target) {
        if (!type || !target) {
            return;
        }
        let eventCaches = this._eventCaches[type];
        if (!eventCaches) {
            return;
        }
        for (let i = 0; i < eventCaches.length; i++) {
            if (eventCaches[i].target === target) {
                eventCaches.splice(i, 1);
                break;
            }
        }
        if (eventCaches.length == 0) {
            delete this._eventCaches[type];
        }
    }
    /**
     * @description 派发事件
     * @param type 事件类型
     * @param data 事件数据
     */
    dispatch() {
        if (arguments.length < 1) {
            return;
        }
        let type = arguments[0];
        if (!type)
            return;
        Array.prototype.shift.apply(arguments);
        let eventCaches = this._eventCaches[type];
        if (!eventCaches)
            return;
        let onceEvent = [];
        for (let i = 0; i < eventCaches.length; i++) {
            let event = eventCaches[i];
            try {
                if (typeof Reflect == "object") {
                    Reflect.apply(event.callback, event.target, arguments);
                }
                else {
                    event.callback.apply(event.target, arguments);
                }
                if (event.once) {
                    onceEvent.push(event);
                }
            }
            catch (err) {
                Log.e(err);
            }
        }
        for (let i = 0; i < onceEvent.length; i++) {
            const ele = onceEvent[i];
            this.remove(ele.type, ele.target);
        }
    }
}
exports.Dispatcher = Dispatcher;
Dispatcher._instance = null;
Dispatcher.module = "【事件管理器】";
window.dispatch = function () {
    //向自己封闭的管理器中也分发
    if (App) {
        Reflect.apply(App.dispatcher.dispatch, App.dispatcher, arguments);
    }
    else {
        Reflect.apply(Dispatcher.instance.dispatch, Dispatcher.instance, arguments);
    }
};
