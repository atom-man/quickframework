"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = exports.HttpPackage = void 0;
const Http_1 = require("./Http");
/**
 * @description http网络请求
 */
const cc_1 = require("cc");
const env_1 = require("cc/env");
class HttpPackageData {
    constructor() {
        this.data = null;
        this.url = null;
        /**@description 超时设置 默认为10s*/
        this.timeout = 10000;
        /**@description 请求类型 默认为GET请求*/
        this.type = Http_1.Http.Type.GET;
        /**@description 是否同步 */
        this.async = true;
        this.requestHeader = null;
        /**@description 发送接口时，默认为false 仅浏览器端生效
         * 自动附加当前时间的参数字段
         * 但如果服务器做了接口参数效验，可能会导致接口无法通过服务器验证，返回错误数据
         * @example
         * 请求地址为http:www.baidu.com 当isAutoAttachCurrentTime 为 true为
         * 实际的请求接口为http:www.baidu.com?cur_loc_t=当前时间
         * 请求地址为http:www.baidu.com?uid=123 当isAutoAttachCurrentTime 为 true为
         * 实际的请求接口为http:www.baidu.com?uid=123&cur_loc_t=当前时间
         *  */
        this.isAutoAttachCurrentTime = false;
        this._responseType = "";
    }
    set responseType(type) {
        this._responseType = type;
    }
    get responseType() {
        if (env_1.JSB) {
            if (this._responseType == "") {
                this._responseType = "text";
            }
        }
        return this._responseType;
    }
}
/**
 * @description http 请求包
 */
class HttpPackage {
    constructor() {
        this._data = new HttpPackageData();
        this._params = null;
    }
    set data(data) {
        this._data = data;
    }
    get data() {
        return this._data;
    }
    /**
     * @description 传入的请求参数会拼在data.url
     * @example params = { a : 10 , b : 20 }
     * 最终的url 为data.url?&a=10&b=20
     */
    set params(value) {
        this._params = value;
    }
    get params() {
        return this._params;
    }
    /**
     * @description 发送请求包
     * @param cb
     * @param errorcb
     */
    send(cb, errorcb) {
        App.http.request(this, cb, errorcb);
    }
}
exports.HttpPackage = HttpPackage;
/**@description 跨域代理 */
HttpPackage.crossProxy = {};
/**@description 当前主机地址 */
HttpPackage.location = { host: "", pathname: "", protocol: "" };
class HttpClient {
    constructor() {
        this.module = null;
    }
    crossProxy(url) {
        //浏览器，非调试模式下
        if (cc_1.sys.isBrowser && !env_1.PREVIEW && HttpPackage.crossProxy) {
            let config = HttpPackage.crossProxy;
            let location = HttpPackage.location;
            let keys = Object.keys(config);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = config[key];
                if (url.indexOf(key) > -1) {
                    if (value.protocol && value.api) {
                        if (location.protocol != value.protocol) {
                            //所有跨域的都从当前服务器的代理转发，把https也得转化成http:
                            url = url.replace(value.protocol, location.protocol);
                        }
                        return url.replace(key, `${location.host}/${value.api}`);
                    }
                }
            }
            return url;
        }
        else {
            return url;
        }
    }
    convertParams(url, params) {
        if (params == null || params == undefined) {
            return url;
        }
        let result = "&";
        if (url.indexOf("?") < 0) {
            result = "?";
        }
        let keys = Object.keys(params);
        for (let i = 0; i < keys.length; i++) {
            if (i == 0) {
                result += `${keys[i]}=${params[keys[i]]}`;
            }
            else {
                result += `&${keys[i]}=${params[keys[i]]}`;
            }
        }
        result = url + result;
        return result;
    }
    convertData(data) {
        return data;
    }
    request(httpPackage, cb, errorcb) {
        let url = httpPackage.data.url;
        if (!url) {
            if (env_1.DEBUG) {
                Log.e(`reuqest url error`);
            }
            if (errorcb)
                errorcb({ type: Http_1.Http.ErrorType.UrlError, reason: "错误的Url地址" });
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300)) {
                    if (xhr.responseType == "arraybuffer" || xhr.responseType == "blob") {
                        if (cb)
                            cb(xhr.response);
                    }
                    else {
                        if (env_1.DEBUG)
                            Log.d(`htpp res(${xhr.responseText})`);
                        if (cb)
                            cb(xhr.responseText);
                    }
                }
                else {
                    let reason = `请求错误,错误状态:${xhr.status}`;
                    Log.e(`request error status : ${xhr.status} url : ${url} `);
                    if (errorcb)
                        errorcb({ type: Http_1.Http.ErrorType.RequestError, reason: reason });
                }
            }
            else {
                //cc.log(`readyState ${xhr.readyState}`);
            }
        };
        xhr.responseType = httpPackage.data.responseType;
        xhr.timeout = httpPackage.data.timeout;
        xhr.ontimeout = () => {
            xhr.abort(); //网络超时，断开连接
            if (env_1.DEBUG)
                Log.w(`request timeout : ${url}`);
            if (errorcb)
                errorcb({ type: Http_1.Http.ErrorType.TimeOut, reason: "连接超时" });
        };
        xhr.onerror = () => {
            Log.e(`request error : ${url} `);
            if (errorcb)
                errorcb({ type: Http_1.Http.ErrorType.RequestError, reason: "请求错误" });
        };
        if (env_1.DEBUG)
            Log.d(`[send http request] url : ${url} request type : ${httpPackage.data.type} , responseType : ${xhr.responseType}`);
        url = this.crossProxy(url);
        url = this.convertParams(url, httpPackage.params);
        if (httpPackage.data.isAutoAttachCurrentTime) {
            if (url.indexOf("?") >= 0) {
                url = `${url}&cur_loc_t=${Date.timeNow()}`;
            }
            else {
                url = `${url}?cur_loc_t=${Date.timeNow()}`;
            }
        }
        if (cc_1.sys.isBrowser && !env_1.PREVIEW) {
            if (env_1.DEBUG)
                Log.d(`[send http request] corss prox url : ${url} request type : ${httpPackage.data.type} , responseType : ${xhr.responseType}`);
        }
        if (httpPackage.data.type === Http_1.Http.Type.POST) {
            xhr.open(Http_1.Http.Type.POST, url, httpPackage.data.async);
            if (httpPackage.data.requestHeader) {
                if (httpPackage.data.requestHeader instanceof Array) {
                    httpPackage.data.requestHeader.forEach((header) => {
                        xhr.setRequestHeader(header.name, header.value);
                    });
                }
                else {
                    let header = httpPackage.data.requestHeader;
                    xhr.setRequestHeader(header.name, header.value);
                }
            }
            else {
                xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
            }
            xhr.send(this.convertData(httpPackage.data.data));
        }
        else {
            xhr.open(Http_1.Http.Type.GET, url, httpPackage.data.async);
            if (httpPackage.data.requestHeader) {
                if (httpPackage.data.requestHeader instanceof Array) {
                    httpPackage.data.requestHeader.forEach((header) => {
                        xhr.setRequestHeader(header.name, header.value);
                    });
                }
                else {
                    let header = httpPackage.data.requestHeader;
                    xhr.setRequestHeader(header.name, header.value);
                }
            }
            xhr.send();
        }
    }
}
exports.HttpClient = HttpClient;
HttpClient.module = "【Http管理器】";
