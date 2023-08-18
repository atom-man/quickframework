"use strict";
/**
 * @description 装饰器定义
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.inject = exports.registerEntry = void 0;
const cc_1 = require("cc");
const env_1 = require("cc/env");
const _FIND_OPTIONS_ = "_FIND_OPTIONS_";
/**
 * @description bundle入口程序注册
 * @param className 入口类名
 * @param bundle bundle名
 * @param type GameView 类型
 * @returns
 */
function registerEntry(className, bundle, type) {
    return function (target) {
        target["__classname__"] = className;
        target.bundle = bundle;
        App.entryManager.register(target, type);
    };
}
exports.registerEntry = registerEntry;
function __find(path, node, type) {
    let temp = (0, cc_1.find)(path, node);
    if (cc_1.js.isChildClassOf(type, cc_1.Component)) {
        let comp = temp === null || temp === void 0 ? void 0 : temp.getComponent(type);
        return comp;
    }
    return temp;
}
/**
 * @description 当onLoad时，自动对所有注入的成员变量设置set&get方法,当成员变量首次调用时对成员变量赋值
 * @param path 相对于当前脚本this.node的搜索路径,当rootPath非空，则以rootPath为根节点查找
 * @param type 查找组件类型
 * @param rootPath 相对于this.node 的搜索路径，不传入时，以当的this.node为根节点进行查找
 * @returns
 */
function inject(path, type, rootPath) {
    return function (target, member) {
        if (!(target instanceof cc_1.Component)) {
            Log.e("无法注入,仅支持 Component 组件");
            return;
        }
        let obj = target;
        if (!Reflect.has(target, _FIND_OPTIONS_)) {
            let __onLoad = obj.onLoad;
            obj.onLoad = function () {
                let self = this;
                let fOption = Reflect.get(self, _FIND_OPTIONS_);
                for (let key in fOption) {
                    let ele = Reflect.get(fOption, key);
                    if (!Reflect.get(self, ele.member)) {
                        Reflect.defineProperty(self, ele.member, {
                            enumerable: true,
                            configurable: true,
                            get() {
                                let node = self.node;
                                if (ele.root) {
                                    let rootMemberName = `__${ele.root.replace(/\//g, "_")}`;
                                    if (!(0, cc_1.isValid)(self[rootMemberName])) {
                                        self[rootMemberName] = __find(ele.root, node, cc_1.Node);
                                    }
                                    node = self[rootMemberName];
                                    if (env_1.DEBUG && !(0, cc_1.isValid)(node)) {
                                        Log.e(`${cc_1.js.getClassName(self)}.${ele.root}节点不存在!!!`);
                                    }
                                }
                                if (!(0, cc_1.isValid)(self[key])) {
                                    self[key] = __find(ele.path, node, ele.type);
                                }
                                return self[key];
                            },
                            set(v) {
                                self[key] = v;
                            }
                        });
                    }
                }
                __onLoad && Reflect.apply(__onLoad, this, arguments);
            };
            Reflect.defineProperty(target, _FIND_OPTIONS_, { value: {} });
        }
        let option = { path: path, type: type, member: member, root: rootPath };
        let attribute = `__${member}`;
        let fOption = Reflect.get(target, _FIND_OPTIONS_);
        Reflect.defineProperty(fOption, attribute, { value: option, enumerable: true });
    };
}
exports.inject = inject;
