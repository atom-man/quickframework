"use strict";
/**
 * @description 子游戏连接服务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyService = void 0;
const Config_1 = require("../config/Config");
const CommonEvent_1 = require("../event/CommonEvent");
const CommonService_1 = require("./CommonService");
class LobbyService extends CommonService_1.CommonService {
    constructor() {
        super(...arguments);
        this.priority = Config_1.NetPriority.Lobby;
    }
    /**@description 网络连接成功 */
    onOpen(ev) {
        super.onOpen(ev);
        dispatch(CommonEvent_1.CommonEvent.LOBBY_SERVICE_CONNECTED, this);
    }
    /**@description 网络关闭 */
    onClose(ev) {
        super.onClose(ev);
        dispatch(CommonEvent_1.CommonEvent.LOBBY_SERVICE_CLOSE, this);
    }
}
exports.LobbyService = LobbyService;
LobbyService.module = "大厅";
