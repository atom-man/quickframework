"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HallUpdateHandlerImpl = void 0;
const Macros_1 = require("../../framework/defines/Macros");
/**@description 大厅更新代理 */
class HallUpdateHandlerImpl {
    constructor() {
        this.module = null;
        this.isResident = true;
    }
    onNewVersionFund(item) {
        item.doUpdate();
    }
    onUpdateFailed(item) {
        let content = App.getLanguage("downloadFailed");
        App.alert.show({
            text: content,
            confirmCb: (isOK) => {
                item.checkUpdate();
            }
        });
        App.updateLoading.hide();
    }
    onPreVersionFailed(item) {
        let content = App.getLanguage("downloadFailed");
        App.alert.show({
            text: content,
            confirmCb: (isOK) => {
                item.checkUpdate();
            }
        });
        App.updateLoading.hide();
    }
    onShowUpdating(item) {
        App.updateLoading.show(App.getLanguage("loading"));
    }
    onNeedUpdateMain(item) {
        App.updateLoading.hide();
        let content = App.getLanguage("mainPackVersionIsTooLow");
        App.alert.show({
            text: content,
            confirmCb: (isOK) => {
                if (App.stageData.isLoginStage()) {
                    //如果是在登录界面，直接检测更新
                    App.entryManager.onCheckUpdate();
                }
                else {
                    App.entryManager.enterBundle(Macros_1.Macro.BUNDLE_RESOURCES);
                }
            }
        });
    }
    onOther(item) {
    }
    onDownloading(item, info) {
        App.updateLoading.updateProgress(info.progress);
    }
    onAreadyUpToData(item) {
        //大厅更新，直接进入
        App.bundleManager.loadBundle(item);
    }
    onStarCheckUpdate(item) {
        App.updateLoading.show(App.getLanguage("loading"));
    }
    onStartLoadBundle(item) {
    }
    onLoadBundleError(item, err) {
        App.updateLoading.hide();
        App.tips.show(App.getLanguage("loadFailed", [item.name]));
    }
    onLoadBundleComplete(item) {
        App.updateLoading.hide();
        App.entryManager.onLoadBundleComplete(item);
    }
    onLoadBundle(item) {
        App.bundleManager.loadBundle(item);
    }
    onDownloadComplete(item) {
        App.releaseManger.tryRemoveBundle(item.bundle);
        this.onLoadBundle(item);
    }
    onNeedRestartApp(item, onComplete) {
        let where = App.stageData.where;
        Log.d(`重启游戏,当前位置 :${where},之前位置 : ${App.stageData.prevWhere}`);
        if (where == Macros_1.Macro.BUNDLE_RESOURCES) {
            onComplete(true);
        }
        else {
            let content = App.getLanguage("restartApp", [item.name]);
            App.alert.show({
                text: content,
                confirmCb: (isOK) => {
                    onComplete(false);
                }
            });
        }
    }
}
exports.HallUpdateHandlerImpl = HallUpdateHandlerImpl;
HallUpdateHandlerImpl.module = "【大厅热更新】";
