"use strict";
/**
 * @description 项目内所有常用枚举定义，请忽引入其它模块
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonSpriteType = exports.ViewStatus = exports.LogLevel = void 0;
/**@description 日志等级 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["DUMP"] = 16] = "DUMP";
    LogLevel[LogLevel["WARN"] = 256] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4096] = "ERROR";
    LogLevel[LogLevel["ALL"] = 4369] = "ALL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * @description 界面视图状态
 */
var ViewStatus;
(function (ViewStatus) {
    /**@description 等待关闭 */
    ViewStatus[ViewStatus["WAITTING_CLOSE"] = 0] = "WAITTING_CLOSE";
    /**@description 等待隐藏 */
    ViewStatus[ViewStatus["WATITING_HIDE"] = 1] = "WATITING_HIDE";
    /**@description 无状态 */
    ViewStatus[ViewStatus["WAITTING_NONE"] = 2] = "WAITTING_NONE";
})(ViewStatus || (exports.ViewStatus = ViewStatus = {}));
var ButtonSpriteType;
(function (ButtonSpriteType) {
    ButtonSpriteType["Norml"] = "normalSprite";
    ButtonSpriteType["Pressed"] = "pressedSprite";
    ButtonSpriteType["Hover"] = "hoverSprite";
    ButtonSpriteType["Disable"] = "disabledSprite";
})(ButtonSpriteType || (exports.ButtonSpriteType = ButtonSpriteType = {}));
