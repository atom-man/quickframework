"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
const DefaultCodec_1 = require("../message/DefaultCodec");
const Net_1 = require("../Net");
class Process {
    constructor() {
        this.Codec = DefaultCodec_1.DefaultCodec;
        /** 监听集合*/
        this._listeners = {};
        /** 消息处理队列 */
        this._masseageQueue = new Array();
        /** 是否正在处理消息 ，消息队列处理消息有时间，如执行一个消息需要多少秒后才执行一下个*/
        this._isDoingMessage = false;
        /** @description 可能后面有其它特殊需要，特定情况下暂停消息队列的处理, true为停止消息队列处理 */
        this.isPause = false;
        this.serviceType = null;
    }
    /**
     * @description 暂停消息队列消息处理
     */
    pauseMessageQueue() { this.isPause = true; }
    /**
     * @description 恢复消息队列消息处理
     */
    resumeMessageQueue() { this.isPause = false; }
    handMessage() {
        var _a;
        //如果当前暂停了消息队列处理，不再处理消息队列
        if (this.isPause)
            return;
        //如果当前有函数正在处理
        if (this._isDoingMessage)
            return;
        //如果当前执行队列为空
        if (this._masseageQueue.length == 0)
            return;
        let datas = this._masseageQueue.shift();
        if (datas == undefined)
            return;
        if (datas.length == 0)
            return;
        this._isDoingMessage = true;
        let handleTime = 0;
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            if (data.func instanceof Function) {
                try {
                    let tempTime = data.func.call(data.target, data.data);
                    if (typeof tempTime == "number") {
                        handleTime = Math.max(handleTime, tempTime);
                    }
                }
                catch (err) {
                    Log.e(err);
                }
            }
        }
        if (handleTime == 0) {
            //立即进行处理
            this._isDoingMessage = false;
        }
        else {
            (_a = App.uiManager.mainController) === null || _a === void 0 ? void 0 : _a.scheduleOnce(() => {
                this._isDoingMessage = false;
            }, handleTime);
        }
    }
    onMessage(code) {
        Log.d(`recv data main cmd : ${code.cmd}`);
        let key = String(code.cmd);
        if (!this._listeners[key]) {
            Log.w(`no find listener data main cmd : ${code.cmd}`);
            return;
        }
        if (this._listeners[key].length <= 0) {
            return;
        }
        this.addMessageQueue(key, code, true);
    }
    /**
     * @description 重置
     */
    reset() {
        this._isDoingMessage = false;
        this._listeners = {};
        this._masseageQueue = [];
        this.resumeMessageQueue();
    }
    close() {
        this._masseageQueue = [];
        this._isDoingMessage = false;
    }
    addListener(cmd, handleType, handleFunc, isQueue, target) {
        let key = cmd;
        if (this._listeners[key]) {
            let hasSame = false;
            for (let i = 0; i < this._listeners[key].length; i++) {
                if (this._listeners[key][i].target === target) {
                    hasSame = true;
                    break;
                }
            }
            if (hasSame) {
                return;
            }
            this._listeners[key].push({
                cmd: cmd,
                func: handleFunc,
                type: handleType,
                isQueue: isQueue,
                target: target
            });
        }
        else {
            this._listeners[key] = [];
            this._listeners[key].push({
                cmd: cmd,
                func: handleFunc,
                type: handleType,
                isQueue: isQueue,
                target: target
            });
        }
    }
    removeListeners(target, eventName) {
        if (eventName) {
            let self = this;
            Object.keys(this._listeners).forEach((value) => {
                let datas = self._listeners[value];
                let i = datas.length;
                while (i--) {
                    if (datas[i].target == target && datas[i].cmd == eventName) {
                        datas.splice(i, 1);
                    }
                }
                if (datas.length == 0) {
                    delete self._listeners[value];
                }
            });
            //移除网络队列中已经存在的消息
            let i = this._masseageQueue.length;
            while (i--) {
                let datas = this._masseageQueue[i];
                let j = datas.length;
                while (j--) {
                    if (datas[j].target == target && datas[i].cmd == eventName) {
                        datas.splice(j, 1);
                    }
                }
                if (datas.length == 0) {
                    this._masseageQueue.splice(i, 1);
                }
            }
        }
        else {
            let self = this;
            Object.keys(this._listeners).forEach((value, index, arr) => {
                let datas = self._listeners[value];
                let i = datas.length;
                while (i--) {
                    if (datas[i].target == target) {
                        datas.splice(i, 1);
                    }
                }
                if (datas.length == 0) {
                    delete self._listeners[value];
                }
            });
            //移除网络队列中已经存在的消息
            let i = this._masseageQueue.length;
            while (i--) {
                let datas = this._masseageQueue[i];
                let j = datas.length;
                while (j--) {
                    if (datas[j].target == target) {
                        datas.splice(j, 1);
                    }
                }
                if (datas.length == 0) {
                    this._masseageQueue.splice(i, 1);
                }
            }
        }
    }
    decode(o, header) {
        let obj = null;
        if (this.serviceType == Net_1.Net.ServiceType.Proto) {
            if (o.type && typeof o.type == "string") {
                let type = App.protoManager.lookup(o.type);
                if (type) {
                    obj = App.protoManager.decode({
                        className: o.type,
                        buffer: header.buffer,
                    });
                }
                else {
                    obj = header.buffer;
                }
            }
            else {
                obj = header.buffer;
            }
            return obj;
        }
        else {
            if (o.type && typeof o.type != "string") {
                obj = new o.type();
                //解包
                obj.decode(header.buffer);
            }
            else {
                //把数据放到里面，让后面使用都自己解析,数据未解析，此消息推后解析
                obj = header.buffer;
            }
            return obj;
        }
    }
    addMessageQueue(key, data, encode) {
        if (this._listeners[key].length <= 0) {
            return;
        }
        let listenerDatas = this._listeners[key];
        let queueDatas = [];
        for (let i = 0; i < listenerDatas.length; i++) {
            let obj = data;
            if (encode) {
                obj = this.decode(listenerDatas[i], data);
            }
            if (listenerDatas[i].isQueue) {
                //需要加入队列处理
                queueDatas.push(this.copyListenerData(listenerDatas[i], obj));
            }
            else {
                //不需要进入队列处理
                try {
                    listenerDatas[i].func && listenerDatas[i].func.call(listenerDatas[i].target, obj);
                }
                catch (err) {
                    Log.e(err);
                }
            }
        }
        if (queueDatas.length > 0) {
            this._masseageQueue.push(queueDatas);
        }
    }
    /**
     * @description 复制proto协议监听数据
     * @param input
     * @param data
     */
    copyListenerData(input, data) {
        return {
            type: input.type,
            func: input.func,
            isQueue: input.isQueue,
            data: data,
            target: input.target,
            cmd: input.cmd
        };
    }
}
exports.Process = Process;
