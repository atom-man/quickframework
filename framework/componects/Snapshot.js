"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snapshot = void 0;
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
/**
 * @description 快照节点
 * 注意，只会截图快照摄像头下的可见节点
 * 如果需要拍照全部分，请设置screenShotCamera的Visibility
 *
 * 目前有个bug未解决，当屏幕大小比例比设计分辨率窄时，截图底部会被截断一部分,暂时未找到原因
 * @example
 * ```ts
 *  let snapshot = girl.addComponent(Snapshot)
 *  snapshot.onCaptureComplete = (sp,size)=>{
 *      let sprite = girlshow.getComponent(Sprite);
 *      if ( sprite ){
 *          sprite.spriteFrame = sp;
 *      }
 *      girlshow.getComponent(UITransform)?.setContentSize(size);
 *  }
 * ```
 */
let Snapshot = exports.Snapshot = (() => {
    let _classDecorators = [ccclass('Snapshot')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Snapshot = _classThis = class extends cc_1.Component {
        constructor() {
            super(...arguments);
            this._camera = null;
            /**@description 截图完成,调试时用来检查截图是否正确 */
            this.onCaptureComplete = undefined;
            this._texture = null;
            this._canvas = null;
            this._buffer = null;
        }
        start() {
            this._camera = App.uiManager.screenShotCamera;
            super.start && super.start();
            this._texture = new cc_1.RenderTexture();
            this._texture.reset({
                width: cc_1.view.getVisibleSize().width,
                height: cc_1.view.getVisibleSize().height,
            });
            this._camera.targetTexture = this._texture;
            this._camera.node.active = true;
            this.scheduleOnce(() => {
                this.capture();
            }, 0.2);
        }
        onDestroy() {
            this._camera.node.active = false;
            super.onDestroy && super.onDestroy();
        }
        capture() {
            let trans = this.node.getComponent(cc_1.UITransform);
            if (!trans) {
                return;
            }
            let width = trans.width;
            let height = trans.height;
            let worldPos = trans.getBoundingBoxToWorld();
            let x = worldPos.x;
            let y = worldPos.y;
            this._buffer = this._texture.readPixels(Math.round(x), Math.round(y), width, height);
            this.saveImage();
        }
        /**@description 生成SpriteFrame */
        genSpriteFrame(width, height) {
            let img = new cc_1.ImageAsset();
            img.reset({
                _data: this._buffer,
                width: width,
                height: height,
                format: cc_1.Texture2D.PixelFormat.RGBA8888,
                _compressed: false
            });
            let texture = new cc_1.Texture2D();
            texture.image = img;
            let sf = new cc_1.SpriteFrame();
            sf.texture = texture;
            sf.packable = false;
            sf.flipUVY = true;
            return sf;
        }
        createImageData(width, height, arrayBuffer) {
            if (cc_1.sys.isBrowser || cc_1.sys.platform === cc_1.sys.Platform.WECHAT_GAME) {
                if (!this._canvas) {
                    this._canvas = document.createElement('canvas');
                    this._canvas.width = width;
                    this._canvas.height = height;
                }
                else {
                    this.clearCanvas();
                }
                let ctx = this._canvas.getContext('2d');
                let rowBytes = width * 4;
                for (let row = 0; row < height; row++) {
                    let sRow = height - 1 - row;
                    let imageData = ctx.createImageData(width, 1);
                    let start = sRow * width * 4;
                    for (let i = 0; i < rowBytes; i++) {
                        imageData.data[i] = arrayBuffer[start + i];
                    }
                    ctx.putImageData(imageData, 0, row);
                }
            }
        }
        onCaptureFinish(width, height, spriteFrame) {
            if (this.onCaptureComplete) {
                if (spriteFrame == undefined) {
                    spriteFrame = this.genSpriteFrame(width, height);
                }
                this.onCaptureComplete(spriteFrame, new cc_1.Size(width, height));
            }
            this.destroy();
        }
        flipImageY(data, width, height) {
            let pixels = new Uint8Array(width * height * 4);
            let rowBytes = width * 4;
            let maxRow = height - 1;
            for (let row = 0; row < height; row++) {
                let srow = maxRow - row;
                let start = srow * rowBytes;
                let reStart = row * rowBytes;
                for (let i = 0; i < rowBytes; i++) {
                    pixels[i + reStart] = data[start + i];
                }
            }
            return pixels;
        }
        /**
         * @description 保存图片到本地
         * @param width
         * @param height
         * @param arrayBuffer
         */
        savaAsImage(width, height, arrayBuffer) {
            if (cc_1.sys.isBrowser) {
                this.createImageData(width, height, arrayBuffer);
                //@ts-ignore
                App.canvasHelper.saveAsPNG(this._canvas, width, height);
                App.tips.show(App.getLanguage("capture_success"));
                this.onCaptureFinish(width, height);
            }
            else if (cc_1.sys.isNative) {
                //原生win32平台调度运行会造成崩溃，请直接用release模式打开，可正常工作
                let date = new Date();
                let fileName = date.format("yyyy_MM_dd_hh_mm_ss_SS") + ".png";
                let filePath = `${App.platform.screenshotsPath}/${fileName}`;
                //@ts-ignore
                let buffer = this.flipImageY(this._buffer, width, height);
                cc_1.native.saveImageData(buffer, width, height, filePath).then(() => {
                    if (this.onCaptureComplete) {
                        // 用于测试图片是否正确保存到本地设备路径下
                        cc_1.assetManager.loadRemote(filePath, (err, imageAsset) => {
                            if (err) {
                                Log.d("show image error");
                            }
                            else {
                                const spriteFrame = new cc_1.SpriteFrame();
                                const texture = new cc_1.Texture2D();
                                texture.image = imageAsset;
                                spriteFrame.texture = texture;
                                spriteFrame.packable = false;
                                App.tips.show(App.getLanguage("capture_save_local_success1", [filePath]));
                                this.onCaptureFinish(width, height, spriteFrame);
                            }
                        });
                    }
                    Log.d("save image data success, file: " + filePath);
                    App.tips.show(App.getLanguage("capture_save_local_success2", [filePath]));
                }).catch(() => {
                    Log.e("save image data failed!");
                    App.tips.show(App.getLanguage("capture_save_failed"));
                });
            }
            else if (cc_1.sys.platform === cc_1.sys.Platform.WECHAT_GAME) {
                this.createImageData(width, height, arrayBuffer);
                //@ts-ignore
                this._canvas.toTempFilePath({
                    x: 0,
                    y: 0,
                    width: this._canvas.width,
                    height: this._canvas.height,
                    destWidth: this._canvas.width,
                    destHeight: this._canvas.height,
                    fileType: "png",
                    success: (res) => {
                        //@ts-ignore
                        wx.showToast({
                            title: App.getLanguage("capture_success")
                        });
                        App.tips.show(App.getLanguage("capture_success"));
                        //@ts-ignore
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: (res) => {
                                //@ts-ignore              
                                wx.showToast({
                                    title: App.getLanguage("capture_save_photo_album"),
                                });
                                App.tips.show(App.getLanguage("capture_save_local_success2", [res.tempFilePath]));
                            },
                            fail: () => {
                                App.tips.show(App.getLanguage("capture_save_failed"));
                            }
                        });
                    },
                    fail: () => {
                        //@ts-ignore
                        wx.showToast({
                            title: App.getLanguage("capture_failed")
                        });
                        App.tips.show(App.getLanguage("capture_failed"));
                    }
                });
                this.onCaptureFinish(width, height);
            }
        }
        /**
         * @description 清除Canvas
         */
        clearCanvas() {
            let ctx = this._canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            }
        }
        saveImage() {
            let trans = this.node.getComponent(cc_1.UITransform);
            if (trans) {
                this.savaAsImage(trans.width, trans.height, this._buffer);
            }
        }
    };
    __setFunctionName(_classThis, "Snapshot");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        Snapshot = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Snapshot = _classThis;
})();
