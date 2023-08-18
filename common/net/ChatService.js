"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
/**
 * @description 子游戏连接服务
 */
const Config_1 = require("../config/Config");
const CommonEvent_1 = require("../event/CommonEvent");
const CommonService_1 = require("./CommonService");
class ChatService extends CommonService_1.CommonService {
    constructor() {
        super(...arguments);
        this.priority = Config_1.NetPriority.Chat;
    }
    /**@description 网络连接成功 */
    onOpen(ev) {
        super.onOpen(ev);
        dispatch(CommonEvent_1.CommonEvent.CHAT_SERVICE_CONNECTED, this);
    }
    /**@description 网络关闭 */
    onClose(ev) {
        super.onClose(ev);
        dispatch(CommonEvent_1.CommonEvent.CHAT_SERVICE_CLOSE, this);
    }
}
exports.ChatService = ChatService;
ChatService.module = "聊天";
