"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonEvent = void 0;
/**@description 公共事件定义 */
var CommonEvent;
(function (CommonEvent) {
    /**@description protobuf消息测试 */
    CommonEvent["TEST_PROTO_MSG"] = "TEST_PROTO_MSG";
    /**@description 二进制流消息测试 */
    CommonEvent["TEST_BINARY_MSG"] = "TEST_BINARY_MSG";
    /**@description json消息测试 */
    CommonEvent["TEST_JSON_MSG"] = "TEST_JSON_MSG";
    /**@description 大厅连接成功 */
    CommonEvent["LOBBY_SERVICE_CONNECTED"] = "LOBBY_SERVICE_CONNECTED";
    /**@description 大厅连接断开 */
    CommonEvent["LOBBY_SERVICE_CLOSE"] = "LOBBY_SERVICE_CLOSE";
    /**@description 游戏连接成功 */
    CommonEvent["GAME_SERVICE_CONNECTED"] = "GAME_SERVICE_CONNECTED";
    /**@description 游戏连接断开 */
    CommonEvent["GAME_SERVICE_CLOSE"] = "GAME_SERVICE_CLOSE";
    /**@description 聊天连接成功 */
    CommonEvent["CHAT_SERVICE_CONNECTED"] = "CHAT_SERVICE_CONNECTED";
    /**@description 聊天连接断开 */
    CommonEvent["CHAT_SERVICE_CLOSE"] = "CHAT_SERVICE_CLOSE";
})(CommonEvent || (exports.CommonEvent = CommonEvent = {}));
