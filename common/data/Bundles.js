"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bundles = void 0;
const cc_1 = require("cc");
const Macros_1 = require("../../framework/defines/Macros");
/**
 * @description 语言包用到，定义好之前，请不要随意修改顺序，以免读取语言包错误
 */
var Types;
(function (Types) {
    Types[Types["resources"] = 0] = "resources";
    Types[Types["aimLine"] = 1] = "aimLine";
    Types[Types["eliminate"] = 2] = "eliminate";
    Types[Types["hall"] = 3] = "hall";
    Types[Types["loadTest"] = 4] = "loadTest";
    Types[Types["netTest"] = 5] = "netTest";
    Types[Types["nodePoolTest"] = 6] = "nodePoolTest";
    Types[Types["tankBattle"] = 7] = "tankBattle";
    Types[Types["taxi"] = 8] = "taxi";
    Types[Types["slot"] = 9] = "slot";
    Types[Types["stateMachine"] = 10] = "stateMachine";
})(Types || (Types = {}));
const eTypes = (0, cc_1.Enum)(Types);
//排序
var Sort;
(function (Sort) {
    Sort[Sort["resources"] = 0] = "resources";
    Sort[Sort["hall"] = 1] = "hall";
    Sort[Sort["aimLine"] = 2] = "aimLine";
    Sort[Sort["eliminate"] = 3] = "eliminate";
    Sort[Sort["loadTest"] = 4] = "loadTest";
    Sort[Sort["taxi"] = 5] = "taxi";
    Sort[Sort["netTest"] = 6] = "netTest";
    Sort[Sort["nodePoolTest"] = 7] = "nodePoolTest";
    Sort[Sort["tankBattle"] = 8] = "tankBattle";
    Sort[Sort["stateMachine"] = 9] = "stateMachine";
    //私有项目
    Sort[Sort["private"] = 10] = "private";
    Sort[Sort["slot"] = 11] = "slot";
})(Sort || (Sort = {}));
const _datas = [
    { sort: Sort.aimLine, name: { CN: "瞄准线", EN: "Aim Line" }, bundle: eTypes[Types.aimLine] },
    { sort: Sort.eliminate, name: { CN: "爱消除", EN: "Eliminate" }, bundle: eTypes[Types.eliminate] },
    { sort: Sort.loadTest, name: { CN: "加载示例", EN: "Load Test" }, bundle: eTypes[Types.loadTest] },
    { sort: Sort.netTest, name: { CN: "网络示例", EN: "Net Test" }, bundle: eTypes[Types.netTest] },
    { sort: Sort.nodePoolTest, name: { CN: "对象池示例", EN: "Node Pool" }, bundle: eTypes[Types.nodePoolTest] },
    { sort: Sort.tankBattle, name: { CN: "坦克大战", EN: "BATTLE\nCITY" }, bundle: eTypes[Types.tankBattle] },
    { sort: Sort.taxi, name: { CN: "快上车", EN: "Taxi" }, bundle: eTypes[Types.taxi] },
    { sort: Sort.resources, name: { CN: "主包", EN: "Main" }, bundle: eTypes[Types.resources] },
    { sort: Sort.hall, name: { CN: "大厅", EN: "Hall" }, bundle: eTypes[Types.hall] },
    { sort: Sort.slot, name: { CN: "水果机", EN: "Slot" }, bundle: eTypes[Types.slot] },
    { sort: Sort.stateMachine, name: { CN: "状态机", EN: "State\nMachine" }, bundle: eTypes[Types.stateMachine] },
];
// console.log(_datas);
class Bundles {
    /**
     * @description 初始化
     */
    static init() {
        this._games = [];
        this.datas.sort((a, b) => {
            return a.sort - b.sort;
        });
        this.datas.forEach(v => {
            if (!(v.bundle == Macros_1.Macro.BUNDLE_HALL || v.bundle == Macros_1.Macro.BUNDLE_RESOURCES)) {
                let data = {
                    bundle: v.bundle,
                    isPrivate: v.sort >= Sort.private,
                    language: `bundles.${v.bundle}`
                };
                this._games.push(data);
            }
        });
    }
    /**
     * @description 通过bundle名获取语言包key
     * @param bundle
     * @returns
     */
    static getLanguage(bundle) {
        return `bundles.${bundle}`;
    }
    /**
     * @description bundles配置数据
     */
    static get datas() {
        return _datas;
    }
    /**@description 所有子游戏配置 */
    static get games() {
        return this._games;
    }
}
exports.Bundles = Bundles;
Bundles.bundles = Types;
Bundles._games = [];
