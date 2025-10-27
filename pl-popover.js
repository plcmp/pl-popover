import { PlElement } from 'polylib';
import { calcIntersect, calcPosRect } from './util.js';

const order = ['down', 'down-left', 'up', 'up-left', 'right', 'right-up', 'left', 'left-up'];

export class PlPopover extends PlElement {
    static properties = {
        visible: { type: Boolean, reflectToAttribute: true },
        allowDirections: { type: Array, value: order },
        topLayer: { type: Boolean },
        direction: { value: 'down' } // default direction
    };

    connectedCallback() {
        super.connectedCallback();

        if (this.topLayer) {
            this.popover = 'manual';
        }
    }

    show(target, container) {
        this.visible = true;
        if (this.popover) this.showPopover();
        this.reFit(target, container);
    }

    hide() {
        if (this.topLayer) this.hidePopover();
        this.visible = false;
    }

    /**
     * Adjust the popover box around the fitAround element so that it fits inside the fitInto element.
     * @param {Element | DOMPoint} fitAround
     * @param {Element} [fitInto]
     */
    reFit(fitAround, fitInto) {
        if (!fitAround) return;
        const fitRect = fitInto
            ? fitInto.getBoundingClientRect()
            : DOMRect.fromRect({
                x: 0, y: 0,
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            });
        const s = this.getBoundingClientRect();
        const dx = s.left - this.offsetLeft,
            dy = s.top - this.offsetTop;
        const style = this.style;

        let t;
        if (fitAround instanceof DOMPoint) {
            t = { top: fitAround.y, left: fitAround.x, bottom: fitAround.y, right: fitAround.x, width: 0, height: 0 };
        } else {
            t = fitAround.getBoundingClientRect();
        }
        // try suggested direction
        let selectedRect = calcPosRect(this.direction, t, s);
        let selectedRate = calcIntersect(selectedRect, fitRect);
        if (selectedRate < 1) {
            // search for best fit
            for (const direction of this.allowDirections) {
                const calculatedRect = calcPosRect(direction, t, s);
                const calculatedRate = calcIntersect(calculatedRect, fitRect);
                if (calculatedRate > selectedRate) {
                    selectedRect = calculatedRect;
                    selectedRate = calculatedRate;
                }
                if (calculatedRate === 1) break;
            }
        }
        style.left = roundedPixels(selectedRect.x - dx);
        style.top = roundedPixels(selectedRect.y - dy);
    }
}

function roundedPixels(x) {
    return Math.round(x) + 'px';
}

customElements.define('pl-popover', PlPopover);
