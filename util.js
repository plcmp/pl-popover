/**
 * Calc position rect for given parameters.
 * @param direction
 * @param around
 * @param target
 * @return {DOMRect}
 */
export function calcPosRect(direction, around, target) {
    const a = { x: null, y: null, height: target.height, width: target.width };
    switch (direction) {
        case 'left':
            a.y = around.top;
            a.x = around.left - target.width;
            break;
        case 'right':
            a.y = around.top;
            a.x = around.right;
            break;
        case 'right-up':
            a.y = around.bottom - target.height;
            a.x = around.right;
            break;
        case 'left-up':
            a.y = around.bottom - target.height;
            a.x = around.left - target.width;
            break;
        case 'up':
            a.y = around.top - target.height;
            a.x = around.left;
            break;
        case 'up-left':
            a.y = around.top - target.height;
            a.x = around.right - target.width;
            break;
        case 'down-left':
            a.y = around.bottom;
            a.x = around.right - target.width;
            break;
        case 'down':
        default:
            a.y = around.bottom;
            a.x = around.left;
    }
    return DOMRect.fromRect(a);
}

/**
 * Calc overlay coefficient for 2 rects. Result 0-1.
 * @param a
 * @param b
 * @return {number}
 */
export function calcIntersect(a, b) {
    const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (height <= 0 || width <= 0) return 0;
    else return (height * width) / (a.height * a.width);
}
