"use strict";
/**@description 语言包具体的代码实现 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonLanguage = void 0;
const LanguageZH_1 = require("./LanguageZH");
const LanguageEN_1 = require("./LanguageEN");
const Macros_1 = require("../../framework/defines/Macros");
const LanguageDelegate_1 = require("../../framework/core/language/LanguageDelegate");
const Bundles_1 = require("../data/Bundles");
class CommonLanguage extends LanguageDelegate_1.LanguageDelegate {
    constructor() {
        super(...arguments);
        this.bundle = Macros_1.Macro.BUNDLE_RESOURCES;
    }
    init() {
        Bundles_1.Bundles.datas.forEach(v => {
            LanguageEN_1.LanguageEN.data.bundles[v.bundle] = v.name.EN;
            LanguageZH_1.LanguageZH.data.bundles[v.bundle] = v.name.CN;
        });
        this.add(LanguageEN_1.LanguageEN);
        this.add(LanguageZH_1.LanguageZH);
    }
}
exports.CommonLanguage = CommonLanguage;
