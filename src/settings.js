// @ts-check
import { h } from './common.js';
import {
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    setWallWidth,
    setWallHeight,
    DEFAULT_PRIMARY_COLOR,
    DEFAULT_SECONDARY_COLOR,
    setPrimaryColor,
    setSecondaryColor,
    togglePixelShape,
} from './wall.js';

const MAX_WIDTH = 50;
const MAX_HEIGHT = 50;

/**
 * @param {string} text
 * @param {string} target
 */
export const SettingsLabel = (text, target) => (
    h('label', {
        class: 'settings-label',
        for: target,
    }, [
        text
    ])
);

/**
 * @typedef SettingsInputOptions
 * @property {string} name
 * @property {string} type
 * @property {string} init
 * @property {(event: InputEvent) => void} onInput
 */

/**
 * @param {SettingsInputOptions} options
 */
const SettingsInput = options => (
    h('input', {
        class: 'settings-input',
        name: options.name,
        type: options.type,
        value: options.init,
        listeners: {
            input: options.onInput,
        },
    })
);

/**
 * @param {string} text
 * @param {() => void} onClick
 */
const SettingsButton = (text, onClick) => (
    h('button', {
        class: 'settings-button',
        listeners: {
            click: onClick,
        },
    }, [
        text
    ])
);

export const settingsContainer = (
    h('div', {
        id: 'settings-container',
        style: 'display: none',
    }, [
        h('form', {
            id: 'settings-window',
            action: 'javascript:;',
        }, [
            SettingsLabel('Wall Width:', 'width'),
            SettingsInput({
                name: 'width',
                type: 'number',
                init: '' + DEFAULT_WIDTH,
                onInput(event) {
                    /**
                     * @type {HTMLInputElement}
                     */
                    // @ts-ignore
                    const { target } = event;
                    const width = +target.value;
                    if (width > MAX_WIDTH) {
                        target.value = '' + MAX_WIDTH;
                    } else {
                        setWallWidth(width);
                    }
                },
            }),
            h('br'),
            SettingsLabel('Wall Height:', 'height'),
            SettingsInput({
                name: 'height',
                type: 'number',
                init: '' + DEFAULT_HEIGHT,
                onInput(event) {
                    /**
                     * @type {HTMLInputElement}
                     */
                    // @ts-ignore
                    const { target } = event;
                    const height = +target.value;
                    if (height > MAX_HEIGHT) {
                        target.value = '' + MAX_HEIGHT;
                    } else {
                        setWallHeight(height);
                    }
                },
            }),
            h('br'),
            SettingsLabel('Primary Color:', 'primary-color'),
            SettingsInput({
                name: 'primary-color',
                type: 'color',
                init: DEFAULT_PRIMARY_COLOR,
                onInput(event) {
                    // @ts-ignore
                    setPrimaryColor(event.target.value);
                },
            }),
            h('br'),
            SettingsLabel('Secondary Color:', 'secondary-color'),
            SettingsInput({
                name: 'secondary-color',
                type: 'color',
                init: DEFAULT_SECONDARY_COLOR,
                onInput(event) {
                    // @ts-ignore
                    setSecondaryColor(event.target.value);
                },
            }),
            h('br'),
            SettingsButton('Toggle Shape', togglePixelShape),
            h('br'),
            SettingsButton('Back', () => {
                settingsContainer.style.display = 'none';
            }),
        ]),
    ])
);
