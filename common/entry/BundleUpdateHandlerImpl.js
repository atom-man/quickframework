"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleUpdateHandlerImpl = void 0;
const Macros_1 = require("../../framework/defines/Macros");
/**@description bundle更新下载代理 */
class BundleUpdateHandlerImpl {
    constructor() {
        this.module = null;
        this.isResident = true;
    }
    onNewVersionFund(item) {
        item.doUpdate();
    }
    onUpdateFailed(item) {
        App.tips.show(App.getLanguage("updateFaild", [item.name]));
        //更新大厅图片状态到可更新,让用户再二次点击
        App.uiManager.getView("HallView").then((view) => {
            if (view) {
                view.toUpdateStatus(item);
            }
        });
    }
    onPreVersionFailed(item) {
        this.onUpdateFailed(item);
    }
    onShowUpdating(item) {
        App.tips.show(App.getLanguage("checkingUpdate"));
    }
    onNeedUpdateMain(item) {
        let content = App.getLanguage("mainPackVersionIsTooLow");
        App.alert.show({
            text: content,
            confirmCb: (isOK) => {
                App.entryManager.enterBundle(Macros_1.Macro.BUNDLE_RESOURCES);
            }
        });
    }
    onOther(item) {
    }
    onDownloading(item, info) {
        App.uiManager.getView("HallView").then((view) => {
            if (view) {
                view.onDownloadProgess(info);
            }
        });
    }
    onAreadyUpToData(item) {
        App.tips.show(App.getLanguage("alreadyRemoteVersion", [item.name]));
    }
    onStarCheckUpdate(item) {
        //子游戏更新，不做处理
    }
    onStartLoadBundle(item) {
        //子游戏加载，不做处理
    }
    onLoadBundleError(item, err) {
        App.tips.show(App.getLanguage("loadFailed", [item.name]));
    }
    onLoadBundleComplete(item) {
        App.entryManager.onLoadBundleComplete(item);
    }
    onLoadBundle(item) {
        App.bundleManager.loadBundle(item);
    }
    onDownloadComplete(item) {
        //子游戏下载完成，不进入游戏，需要玩家二次点击进入
        //尝试先释放掉当前的bundle的资源，重新加载
        App.releaseManger.tryRemoveBundle(item.bundle);
    }
    onNeedRestartApp(item, onComplete) {
        let content = App.getLanguage("restartApp", [item.name]);
        App.alert.show({
            text: content,
            confirmCb: (isOK) => {
                onComplete(false);
            }
        });
    }
}
exports.BundleUpdateHandlerImpl = BundleUpdateHandlerImpl;
BundleUpdateHandlerImpl.module = "【Bundle热更新】";
