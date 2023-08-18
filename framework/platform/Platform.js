"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const cc_1 = require("cc");
const Snapshot_1 = require("../componects/Snapshot");
/**
 * @description 平台相关代码处理
 */
class Platform {
    constructor() {
        this.module = null;
        /**
         * @description 截图文件保存路径
         */
        this._screenshotsPath = null;
    }
    /**
     * @en Try to open a url in browser, may not work in some platforms
     * @zh 尝试打开一个 web 页面，并非在所有平台都有效
     */
    openURL(url) {
        cc_1.sys.openURL(url);
    }
    /**
     * @en Copy text to clipboard
     * @zh 拷贝字符串到剪切板
     * @param text
     */
    copyText(text) {
        cc_1.native.copyTextToClipboard(text);
    }
    /**
     * @en Get the network type of current device, return `sys.NetworkType.LAN` if failure.
     * @zh 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 `sys.NetworkType.LAN`
     */
    getNetworkType() {
        return cc_1.sys.getNetworkType();
    }
    /**
     * @en Get the battery level of current device, return 1.0 if failure.
     * @zh 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
     * @return - 0.0 ~ 1.0
     */
    getBatteryLevel() {
        return cc_1.sys.getBatteryLevel();
    }
    /**
     * @description 截图
     * @param node 需要截图的节点
     * @param onCaptureComplete 截图完成回调
     */
    snapshot(node, onCaptureComplete) {
        if ((0, cc_1.isValid)(node)) {
            let snapshot = node.addComponent(Snapshot_1.Snapshot);
            snapshot.onCaptureComplete = onCaptureComplete;
        }
    }
    get screenshotsPath() {
        if (this._screenshotsPath) {
            return this._screenshotsPath;
        }
        if (cc_1.sys.isNative) {
            this._screenshotsPath = cc_1.native.fileUtils.getWritablePath() + "Screenshots";
            if (!cc_1.native.fileUtils.isDirectoryExist(this._screenshotsPath)) {
                cc_1.native.fileUtils.createDirectory(this._screenshotsPath);
            }
        }
        return this._screenshotsPath;
    }
}
exports.Platform = Platform;
Platform.module = "【平台管理器】";
