"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cc_1 = require("cc");
const Config_1 = require("../config/Config");
/**
 * @description 提示
 */
class ToastItem extends cc_1.Component {
    constructor() {
        super(...arguments);
        this._content = null;
        this._curPositon = new cc_1.Vec3;
        this._curOpacity = null;
        this._transform = null;
    }
    stopAllActions() {
        cc_1.Tween.stopAllByTarget(this._content);
        cc_1.Tween.stopAllByTarget(this._curPositon);
        if (this.opacity) {
            cc_1.Tween.stopAllByTarget(this.opacity);
        }
    }
    onDestroy() {
        this.stopAllActions();
    }
    init(content, time) {
        this._content = (0, cc_1.find)("content", this.node);
        if (this._content) {
            this._content.getComponent(cc_1.Label).string = content;
        }
        this.runTimeOut(time);
    }
    get opacity() {
        if (this._curOpacity) {
            return this._curOpacity;
        }
        this._curOpacity = this.node.getComponent(cc_1.UIOpacity);
        return this._curOpacity;
    }
    get transform() {
        if (this._transform) {
            return this._transform;
        }
        this._transform = this.node.getComponent(cc_1.UITransform);
        return this._transform;
    }
    runTimeOut(time) {
        let self = this;
        (0, cc_1.tween)(this._content).delay(time).call(() => {
            App.tips.finishShowItem(self.node);
        }).start();
    }
    fadeOut() {
        if (!this.opacity)
            return;
        cc_1.Tween.stopAllByTarget(this.opacity);
        (0, cc_1.tween)(this.opacity)
            .to(.5, { opacity: 0 })
            .call(() => {
            var _a;
            this.stopAllActions();
            (_a = this.node) === null || _a === void 0 ? void 0 : _a.removeFromParent();
        })
            .start();
        this.moveTo(0, this.node.position.y + this.transform.height);
    }
    fadeIn() {
        if (!this.opacity)
            return;
        cc_1.Tween.stopAllByTarget(this.opacity);
        this.opacity.opacity = 0;
        (0, cc_1.tween)(this.opacity)
            .to(.5, { opacity: 255 })
            .start();
        this.moveTo(0, this.node.position.y + this.transform.height);
    }
    moveTo(x, y) {
        cc_1.Tween.stopAllByTarget(this._curPositon);
        this._curPositon.set(this.node.position);
        (0, cc_1.tween)(this._curPositon).to(0.5, { x: x, y: y }, {
            onUpdate: (target) => {
                var _a;
                (_a = this.node) === null || _a === void 0 ? void 0 : _a.setPosition(target);
            }, easing: "expoOut"
        }).start();
    }
}
class Tips {
    constructor() {
        this.module = null;
        this.isResident = true;
        this._queue = [];
        this.MAX_NUM = 3; // 最多可以同时显示多少个toast
        this.FADE_TIME = 2; // 停留显示2秒。2秒内有可能被顶掉
        /**@description id*/
        this._id = 0;
        /**@description 默认的显示开始位置 */
        this.startPosition = new cc_1.Vec3(0, 100);
    }
    _show(msg) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let node = (0, cc_1.instantiate)(App.uiManager.getScenePrefab("Tips"));
            if (node) {
                let itemComp = node.addComponent(ToastItem);
                itemComp.init(msg, this.FADE_TIME);
                node.setPosition(this.startPosition);
                itemComp.fadeIn();
                node.userData = this._id++;
                node.name = `Tips${node.userData}`;
                App.uiManager.addView(node, Config_1.ViewZOrder.Tips);
                //整体上移
                let length = this._queue.length;
                for (let i = 0; i < length && i < this.MAX_NUM; i++) {
                    let item = this._queue[i];
                    let itemComp = item.getComponent(ToastItem);
                    let transform = item.getComponent(cc_1.UITransform);
                    if (itemComp && transform) {
                        itemComp.moveTo(0, this.startPosition.y + transform.height + (length - i) * (transform.height + 3));
                    }
                }
                //压入
                this._queue.push(node);
                //删除超出的
                if (this._queue.length > this.MAX_NUM) {
                    let item = this._queue.shift();
                    (_a = item.getComponent(ToastItem)) === null || _a === void 0 ? void 0 : _a.fadeOut();
                }
            }
        });
    }
    show(msg) {
        if (msg == null || msg == undefined || msg == "") {
            return;
        }
        (0, cc_1.log)("Toast.show msg=%s", msg);
        this._show(msg);
    }
    finishShowItem(item) {
        var _a;
        for (let i = 0; i < this._queue.length; i++) {
            let tempItem = this._queue[i];
            if (tempItem.userData == item.userData) {
                this._queue.splice(i, 1);
                (_a = item.getComponent(ToastItem)) === null || _a === void 0 ? void 0 : _a.fadeOut();
                break;
            }
        }
    }
    clear() {
        let item = null;
        while (item = this._queue.pop()) {
            let comp = item.getComponent(ToastItem);
            if (comp) {
                comp.stopAllActions();
            }
            item.removeFromParent();
        }
    }
}
Tips.module = "【Tips】";
exports.default = Tips;
