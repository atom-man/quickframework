"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Net = void 0;
/**@description 网络相关 */
var Net;
(function (Net) {
    let ServiceType;
    (function (ServiceType) {
        ServiceType[ServiceType["Unknown"] = 0] = "Unknown";
        ServiceType[ServiceType["Json"] = 1] = "Json";
        ServiceType[ServiceType["Proto"] = 2] = "Proto";
        ServiceType[ServiceType["BinaryStream"] = 3] = "BinaryStream";
    })(ServiceType = Net.ServiceType || (Net.ServiceType = {}));
})(Net || (exports.Net = Net = {}));
