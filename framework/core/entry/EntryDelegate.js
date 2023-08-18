"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryDelegate = void 0;
const Macros_1 = require("../../defines/Macros");
/**@description entry入口代理 */
class EntryDelegate {
    /**@description 进入bundle完成 */
    onEnterGameView(entry, gameView) {
        //删除除自己之外的其它bundle
        let excludeBundles = this.getPersistBundle();
        if (entry) {
            excludeBundles.push(entry.bundle);
        }
        //进入下一场景，关闭掉当前的场景
        if (App.gameView) {
            App.gameView.close();
        }
        App.gameView = gameView;
        App.bundleManager.removeLoadedBundle(excludeBundles);
    }
    onShowGameView(entry, gameView) {
    }
    /**@description 主包检测更新 */
    onCheckUpdate() {
        Log.d(`主包检测更新`);
        let config = this.getEntryConfig(Macros_1.Macro.BUNDLE_RESOURCES);
        App.bundleManager.enterBundle(config);
    }
    /**@description 获取常驻于内存不释放的bundle */
    getPersistBundle() {
        return [Macros_1.Macro.BUNDLE_RESOURCES];
    }
    onEnterMain(mainEntry, userData) {
        if (mainEntry) {
            if (App.gameView) {
                App.gameView.close();
            }
            mainEntry.onEnter(userData);
        }
    }
    getEntryConfig(bundle) {
        return null;
    }
}
exports.EntryDelegate = EntryDelegate;
