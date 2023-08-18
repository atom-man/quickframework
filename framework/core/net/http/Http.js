"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http = void 0;
/**@description Http相关枚举定义 */
var Http;
(function (Http) {
    /**@description http错误类型 */
    let ErrorType;
    (function (ErrorType) {
        /**@description 错误的Url地地址*/
        ErrorType[ErrorType["UrlError"] = 0] = "UrlError";
        /**@description 请求超时 */
        ErrorType[ErrorType["TimeOut"] = 1] = "TimeOut";
        /**@description 请求错误 */
        ErrorType[ErrorType["RequestError"] = 2] = "RequestError";
    })(ErrorType = Http.ErrorType || (Http.ErrorType = {}));
    /**@description http 请求类型 */
    let Type;
    (function (Type) {
        Type["POST"] = "POST";
        Type["GET"] = "GET";
    })(Type = Http.Type || (Http.Type = {}));
})(Http || (exports.Http = Http = {}));
