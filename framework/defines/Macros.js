"use strict";
/**
 * 框架常量宏定义
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Macro = void 0;
const ByteArray_1 = require("../plugin/ByteArray");
var Macro;
(function (Macro) {
    /**@description 网络数据全以大端方式进行处理 */
    Macro.USING_LITTLE_ENDIAN = ByteArray_1.Endian.BIG_ENDIAN;
    /**@description 主包bundle名 */
    Macro.BUNDLE_RESOURCES = 'resources';
    /**@description 远程资源包bundle名 */
    Macro.BUNDLE_REMOTE = "__Remote__Caches__";
    /**@description 是否允许游戏启动后切换语言 */
    Macro.ENABLE_CHANGE_LANGUAGE = true;
    /**@description 语言包路径使用前缀 */
    Macro.USING_LAN_KEY = "i18n.";
    /**@description 屏幕适配 */
    Macro.ADAPT_SCREEN = "Event_ADAPT_SCREEN";
    /**@description 未知 */
    Macro.UNKNOWN = "UNKNOWN";
    /**@description 应该层主动关闭Socket */
    Macro.ON_CUSTOM_CLOSE = "ON_CUSTOM_CLOSE";
    /**@description 主包热更新模拟bundle名 */
    Macro.MAIN_PACK_BUNDLE_NAME = "main";
    /**@description 大厅bunlde名 */
    Macro.BUNDLE_HALL = "hall";
})(Macro || (exports.Macro = Macro = {}));
