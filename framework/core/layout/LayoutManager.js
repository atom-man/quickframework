"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutManager = void 0;
const cc_1 = require("cc");
const LayoutDefines_1 = require("./LayoutDefines");
const _tempPos = new cc_1.Vec3();
const _defaultAnchor = new cc_1.Vec2();
const _tempScale = new cc_1.Vec2();
/**
 * @description 布局管理器
 */
class LayoutManager {
    constructor() {
        this.module = null;
    }
    get visibleRect() {
        return window["cc"].visibleRect;
    }
    align(layoutParam) {
        let node = layoutParam.node;
        const hasTarget = layoutParam.target;
        let widget = layoutParam;
        let target;
        let inverseTranslate = new cc_1.Vec2();
        let inverseScale = new cc_1.Vec2();
        if (hasTarget) {
            target = hasTarget;
            this.computeInverseTransForTarget(node, target, inverseTranslate, inverseScale);
        }
        else {
            target = node.parent;
        }
        const targetSize = this.getReadonlyNodeSize(target);
        const useGlobal = target instanceof cc_1.Scene || !target.getComponent(cc_1.UITransform);
        const targetAnchor = useGlobal ? _defaultAnchor : target.getComponent(cc_1.UITransform).anchorPoint;
        const isRoot = useGlobal;
        node.getPosition(_tempPos);
        const uiTrans = node._uiProps.uiTransformComp;
        let x = _tempPos.x;
        let y = _tempPos.y;
        const anchor = uiTrans.anchorPoint;
        const scale = node.getScale();
        if (layoutParam.alignFlags & LayoutDefines_1.LayoutType.HORIZONTAL) {
            let localLeft = 0;
            let localRight = 0;
            const targetWidth = targetSize.width;
            if (isRoot) {
                localLeft = this.visibleRect.left.x;
                localRight = this.visibleRect.right.x;
            }
            else {
                localLeft = -targetAnchor.x * targetWidth;
                localRight = localLeft + targetWidth;
            }
            // adjust borders according to offsets
            localLeft += widget.isAbsoluteLeft ? widget.left : widget.left * targetWidth;
            localRight -= widget.isAbsoluteRight ? widget.right : widget.right * targetWidth;
            if (hasTarget) {
                localLeft += inverseTranslate.x;
                localLeft *= inverseScale.x;
                localRight += inverseTranslate.x;
                localRight *= inverseScale.x;
            }
            let width = 0;
            let anchorX = anchor.x;
            let scaleX = scale.x;
            if (scaleX < 0) {
                anchorX = 1.0 - anchorX;
                scaleX = -scaleX;
            }
            if (widget.isStretchWidth) {
                width = localRight - localLeft;
                if (scaleX !== 0) {
                    uiTrans.width = width / scaleX;
                }
                x = localLeft + anchorX * width;
            }
            else {
                width = uiTrans.width * scaleX;
                if (widget.isAlignHorizontalCenter) {
                    let localHorizontalCenter = widget.isAbsoluteHorizontalCenter ? widget.horizontalCenter : widget.horizontalCenter * targetWidth;
                    let targetCenter = (0.5 - targetAnchor.x) * targetSize.width;
                    if (hasTarget) {
                        localHorizontalCenter *= inverseScale.x;
                        targetCenter += inverseTranslate.x;
                        targetCenter *= inverseScale.x;
                    }
                    x = targetCenter + (anchorX - 0.5) * width + localHorizontalCenter;
                }
                else if (widget.isAlignLeft) {
                    x = localLeft + anchorX * width;
                }
                else {
                    x = localRight + (anchorX - 1) * width;
                }
            }
        }
        if (widget.alignFlags & LayoutDefines_1.LayoutType.VERTICAL) {
            let localTop = 0;
            let localBottom = 0;
            const targetHeight = targetSize.height;
            if (isRoot) {
                localBottom = this.visibleRect.bottom.y;
                localTop = this.visibleRect.top.y;
            }
            else {
                localBottom = -targetAnchor.y * targetHeight;
                localTop = localBottom + targetHeight;
            }
            // adjust borders according to offsets
            localBottom += widget.isAbsoluteBottom ? widget.bottom : widget.bottom * targetHeight;
            localTop -= widget.isAbsoluteTop ? widget.top : widget.top * targetHeight;
            if (hasTarget) {
                // transform
                localBottom += inverseTranslate.y;
                localBottom *= inverseScale.y;
                localTop += inverseTranslate.y;
                localTop *= inverseScale.y;
            }
            let height = 0;
            let anchorY = anchor.y;
            let scaleY = scale.y;
            if (scaleY < 0) {
                anchorY = 1.0 - anchorY;
                scaleY = -scaleY;
            }
            if (widget.isStretchHeight) {
                height = localTop - localBottom;
                if (scaleY !== 0) {
                    uiTrans.height = height / scaleY;
                }
                y = localBottom + anchorY * height;
            }
            else {
                height = uiTrans.height * scaleY;
                if (widget.isAlignVerticalCenter) {
                    let localVerticalCenter = widget.isAbsoluteVerticalCenter ? widget.verticalCenter : widget.verticalCenter * targetHeight;
                    let targetMiddle = (0.5 - targetAnchor.y) * targetSize.height;
                    if (hasTarget) {
                        localVerticalCenter *= inverseScale.y;
                        targetMiddle += inverseTranslate.y;
                        targetMiddle *= inverseScale.y;
                    }
                    y = targetMiddle + (anchorY - 0.5) * height + localVerticalCenter;
                }
                else if (widget.isAlignBottom) {
                    y = localBottom + anchorY * height;
                }
                else {
                    y = localTop + (anchorY - 1) * height;
                }
            }
        }
        layoutParam.result.position.x = x;
        layoutParam.result.position.y = y;
    }
    computeInverseTransForTarget(widgetNode, target, out_inverseTranslate, out_inverseScale) {
        if (widgetNode.parent) {
            _tempScale.set(widgetNode.parent.getScale().x, widgetNode.parent.getScale().y);
        }
        else {
            _tempScale.set(0, 0);
        }
        let scaleX = _tempScale.x;
        let scaleY = _tempScale.y;
        let translateX = 0;
        let translateY = 0;
        for (let node = widgetNode.parent;;) {
            if (!node) {
                // ERROR: widgetNode should be child of target
                out_inverseTranslate.x = out_inverseTranslate.y = 0;
                out_inverseScale.x = out_inverseScale.y = 1;
                return;
            }
            const pos = node.getPosition();
            translateX += pos.x;
            translateY += pos.y;
            node = node.parent; // loop increment
            if (node !== target) {
                if (node) {
                    _tempScale.set(node.getScale().x, node.getScale().y);
                }
                else {
                    _tempScale.set(0, 0);
                }
                const sx = _tempScale.x;
                const sy = _tempScale.y;
                translateX *= sx;
                translateY *= sy;
                scaleX *= sx;
                scaleY *= sy;
            }
            else {
                break;
            }
        }
        out_inverseScale.x = scaleX !== 0 ? (1 / scaleX) : 1;
        out_inverseScale.y = scaleY !== 0 ? (1 / scaleY) : 1;
        out_inverseTranslate.x = -translateX;
        out_inverseTranslate.y = -translateY;
    }
    getReadonlyNodeSize(parent) {
        const trans = parent.getComponent(cc_1.UITransform);
        if (parent instanceof cc_1.Scene) {
            return this.visibleRect;
        }
        else if (trans) {
            return trans.contentSize;
        }
        else {
            return cc_1.Size.ZERO;
        }
    }
}
exports.LayoutManager = LayoutManager;
LayoutManager.module = "【布局管理器】";
