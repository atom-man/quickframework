"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmmEntry = void 0;
const EntryDelegate_1 = require("../../framework/core/entry/EntryDelegate");
const Macros_1 = require("../../framework/defines/Macros");
const Singleton_1 = require("../../framework/utils/Singleton");
const BundleUpdateHandlerImpl_1 = require("./BundleUpdateHandlerImpl");
const HallUpdateHandlerImpl_1 = require("./HallUpdateHandlerImpl");
const MainUpdateHandlerImpl_1 = require("./MainUpdateHandlerImpl");
class CmmEntry extends EntryDelegate_1.EntryDelegate {
    /**@description 进入bundle完成 */
    onEnterGameView(entry, gameView) {
        let data = App.stageData;
        data.where = entry.bundle;
        super.onEnterGameView(entry, gameView);
        App.loading.hide();
    }
    onShowGameView(entry, gameView) {
        App.stageData.where = gameView.bundle;
    }
    getEntryConfig(bundle) {
        let config = App.stageData.getEntry(bundle);
        if (config) {
            let item = App.updateManager.getItem(config);
            if (bundle == Macros_1.Macro.BUNDLE_RESOURCES) {
                item.handler = Singleton_1.Singleton.get(MainUpdateHandlerImpl_1.MainUpdateHandlerImpl);
            }
            else if (bundle == Macros_1.Macro.BUNDLE_HALL) {
                item.handler = Singleton_1.Singleton.get(HallUpdateHandlerImpl_1.HallUpdateHandlerImpl);
            }
            else {
                item.handler = Singleton_1.Singleton.get(BundleUpdateHandlerImpl_1.BundleUpdateHandlerImpl);
            }
            return item;
        }
        Log.e(`未找到入口配置信息`);
        return null;
    }
    /**@description 获取常驻于内存不释放的bundle */
    getPersistBundle() {
        return [Macros_1.Macro.BUNDLE_RESOURCES, Macros_1.Macro.BUNDLE_HALL];
    }
}
exports.CmmEntry = CmmEntry;
