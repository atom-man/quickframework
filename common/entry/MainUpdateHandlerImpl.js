"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainUpdateHandlerImpl = void 0;
/**@description 主包更新代理 */
class MainUpdateHandlerImpl {
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
    }
    onOther(item) {
    }
    onDownloading(item, info) {
        App.updateLoading.updateProgress(info.progress);
    }
    onAreadyUpToData(item) {
        App.updateLoading.hide();
    }
    onStarCheckUpdate(item) {
        App.updateLoading.show(App.getLanguage("loading"));
    }
    onStartLoadBundle(item) {
    }
    onLoadBundleError(item, err) {
        //主包原则上说是不可能加载错误的
        App.updateLoading.hide();
        App.tips.show(App.getLanguage("loadFailed", [item.name]));
        Log.dump(err, "onLoadBundleError");
    }
    onLoadBundleComplete(item) {
        App.updateLoading.hide();
        App.entryManager.onLoadBundleComplete(item);
    }
    onLoadBundle(item) {
        //主包不会释放，直接隐藏loading
        App.updateLoading.hide();
    }
    onDownloadComplete(item) {
    }
    onNeedRestartApp(item, onComplete) {
        onComplete(true);
    }
}
exports.MainUpdateHandlerImpl = MainUpdateHandlerImpl;
MainUpdateHandlerImpl.module = "【主包热更新】";
