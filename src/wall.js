// @ts-check
import { h, throttle } from './common.js';

const WALL_CIRCLE_CLASS = 'circle';
const WALL_RECT_CLASS = 'rect';
const PIXEL_CLASS = 'pixel';

const COLOR_KEY = 'data-color';

export const DEFAULT_SECONDARY_COLOR = '#CCCCCC';
export const DEFAULT_PRIMARY_COLOR = '#CC1144';

export const DEFAULT_WIDTH = 16;
export const DEFAULT_HEIGHT = 16;

let secondaryColor = DEFAULT_SECONDARY_COLOR;
let primaryColor = DEFAULT_PRIMARY_COLOR;

let currentColumns = 0;
let currentRows = 0;

let isPressing = false;
let lastTarget = null;

let x0 = 0;
let y0 = 0;
let w0 = 0;

/**
 * @param {HTMLElement} target
 */
const checkToggleTarget = target => {

    if (lastTarget === target) {
        return;
    }

    if (target.getAttribute('class') !== PIXEL_CLASS) {
        lastTarget = null;
        return;
    }

    lastTarget = target;

    const { style } = target;
    if (target.getAttribute(COLOR_KEY) === secondaryColor) {
        style.backgroundColor = primaryColor;
        target.setAttribute(COLOR_KEY, primaryColor);
    } else {
        style.backgroundColor = secondaryColor;
        target.setAttribute(COLOR_KEY, secondaryColor);
    }

};

const wall = (
    h('table', {
        id: 'wall',
        class: 'circle',
    })
);

/**
 * @param {string} color
 */
export const setBackgroundColor = color => {
    document.body.style.backgroundColor = color;
};

setBackgroundColor('#BBBBBB'); // init

export const wallContainer = (
    h('main', {
        id: 'wall-container',
        listeners: (
            navigator.maxTouchPoints // > 0
            ?
            {
                /**
                 * @param {TouchEvent} event
                 */
                touchstart(event) {
                    isPressing = true;
                    // @ts-ignore
                    checkToggleTarget(event.target);
                },
                /**
                 * @param {TouchEvent} event
                 */
                _touchmove(event) {
                    event.preventDefault();
                    if (!isPressing) {
                        return;
                    }
                    /**
                     * HACK: touch event targets are
                     * fixed, so a simple target
                     * detection is implemented here
                     */
                    const point = event.changedTouches[0];
                    const { clientX: x, clientY: y } = point;
                    if (x < x0 || y < y0) {
                        return;
                    }
                    const i = Math.floor((x - x0) / w0);
                    const j = Math.floor((y - y0) / w0);
                    if (
                        i >= currentColumns ||
                        j >= currentRows ||
                        (
                            ((x - x0 - (i + .5) * w0) ** 2 +
                                (y - y0 - (j + .5) * w0) ** 2) >
                            (w0 / 2) ** 2
                        )
                    ) {
                        return;
                    }
                    checkToggleTarget(
                        // @ts-ignore
                        wall.childNodes[j] // row
                        .childNodes[i] // cell
                        .childNodes[0] // pixel
                    );
                },
                touchend() {
                    isPressing = false;
                    lastTarget = null;
                },
            } :
            {
                /**
                 * @param {MouseEvent} event
                 */
                mousedown(event) {
                    isPressing = true;
                    // @ts-ignore
                    checkToggleTarget(event.target);
                },
                /**
                 * @param {MouseEvent} event
                 */
                mousemove(event) {
                    if (!isPressing) {
                        return;
                    }
                    // @ts-ignore
                    checkToggleTarget(event.target);
                },
                mouseup() {
                    isPressing = false;
                    lastTarget = null;
                },
            }
        ),
    }, [
        wall
    ])
);

export const togglePixelShape = () => {
    wall.setAttribute(
        'class',
        wall.getAttribute('class') === WALL_CIRCLE_CLASS
            ? WALL_RECT_CLASS
            : WALL_CIRCLE_CLASS
    );
};

/**
 * @param {string} color
 */
export const setSecondaryColor = color => {
    const rows = wall.childNodes;
    for (let i = 0; i < currentRows; i++) {
        const row = rows[i].childNodes;
        for (let j = 0; j < currentColumns; j++) {
            /**
             * @type {HTMLElement}
             */
            // @ts-ignore
            const pixel = row[j].childNodes[0];
            if (pixel.getAttribute(COLOR_KEY) === secondaryColor) {
                pixel.style.backgroundColor = color;
                pixel.setAttribute(COLOR_KEY, color);
            }
        }
    }
    secondaryColor = color;
};

/**
 * @param {string} color
 */
export const setPrimaryColor = color => {
    const rows = wall.childNodes;
    for (let i = 0; i < currentRows; i++) {
        const row = rows[i].childNodes;
        for (let j = 0; j < currentColumns; j++) {
            /**
             * @type {HTMLElement}
             */
            // @ts-ignore
            const pixel = row[j].childNodes[0];
            if (pixel.getAttribute(COLOR_KEY) === primaryColor) {
                pixel.style.backgroundColor = color;
                pixel.setAttribute(COLOR_KEY, color);
            }
        }
    }
    primaryColor = color;
};

export const resetPixels = () => {
    const rows = wall.childNodes;
    for (let i = 0; i < currentRows; i++) {
        const row = rows[i].childNodes;
        for (let j = 0; j < currentColumns; j++) {
            /**
             * @type {HTMLElement}
             */
            // @ts-ignore
            const pixel = row[j].childNodes[0];
            if (pixel.getAttribute(COLOR_KEY) !== secondaryColor) {
                pixel.style.backgroundColor = secondaryColor;
                pixel.setAttribute(COLOR_KEY, secondaryColor);
            }
        }
    }
};

const WallCell = () => (
    h('td', {
        class: 'wall-cell',
    }, [
        h('button', {
            class: PIXEL_CLASS,
            style: `background-color: ${secondaryColor}`,
            [COLOR_KEY]: secondaryColor,
        })
    ])
);

const adjustWallStyle = throttle(() => {
    const targetRatio = currentColumns / currentRows;
    const containerBox = wallContainer.getBoundingClientRect();
    const { width: containerWidth, height: containerHeight } = containerBox;
    const containerRatio = containerWidth / containerHeight;
    const { style: wallStyle } = wall;
    if (containerRatio > targetRatio) {
        const wallWidth = containerHeight * targetRatio;
        const marginLeft = (containerWidth - wallWidth) / 2;
        wallStyle.marginLeft = `${marginLeft}px`;
        wallStyle.marginTop = '0';
        wallStyle.width = `${wallWidth}px`;
        wallStyle.height = `${containerHeight}px`;
        x0 = containerBox.left + marginLeft;
        y0 = containerBox.top;
        w0 = containerHeight / currentRows;
    } else {
        const wallHeight = containerWidth / targetRatio;
        const marginTop = (containerHeight - wallHeight) / 2;
        wallStyle.marginLeft = '0';
        wallStyle.marginTop = `${marginTop}px`;
        wallStyle.width = `${containerWidth}px`;
        wallStyle.height = `${wallHeight}px`;
        x0 = containerBox.left;
        y0 = containerBox.top + marginTop;
        w0 = containerWidth / currentColumns;
    }
}, 500);

window.addEventListener('resize', () => {
    adjustWallStyle(currentRows, currentColumns);
});

/**
 * @param {number} columns
 */
export const setWallWidth = throttle(columns => {

    if (currentColumns < columns) {
        for (let i = 0; i < currentRows; i++) {
            const row = wall.childNodes[i];
            for (let j = currentColumns; j < columns; j++) {
                row.appendChild(WallCell());
            }
        }
    } else if (currentColumns > columns) {
        for (let i = 0; i < currentRows; i++) {
            const row = wall.childNodes[i];
            for (let j = currentColumns; j > columns; j--) {
                row.removeChild(
                    row.childNodes[j - 1]
                );
            }
        }
    }
    
    currentColumns = columns;
    adjustWallStyle();

}, 500);

/**
 * @param {number} rows
 */
export const setWallHeight = throttle(rows => {
    
    if (currentRows < rows) {
        const rowTemplate = { length: currentColumns };
        for (let i = currentRows; i < rows; i++) {
            wall.appendChild(
                h('tr', {
                        class: 'wall-row',
                    },
                    Array.from(rowTemplate, WallCell)
                )
            );
        }
    } else if (currentRows > rows) {
        for (let i = currentRows; i > rows; i--) {
            wall.removeChild(
                wall.childNodes[i - 1]
            );
        }
    }

    currentRows = rows;
    adjustWallStyle();

}, 500);

setTimeout(() => { // wait until DOM is ready
    setWallHeight(DEFAULT_HEIGHT); // init height
    setWallWidth(DEFAULT_WIDTH); // init width
});