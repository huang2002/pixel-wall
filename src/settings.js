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

const MIN_WIDTH = 1;
const MIN_HEIGHT = 1;
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
 * @param {object} props
 * @param {(event: InputEvent) => void} onInput
 */
const SettingsInput = (props, onInput) => (
    h('input', {
        ...props,
        class: 'settings-input',
        listeners: {
            input: onInput,
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
                min: '' + MIN_WIDTH,
                max: '' + MAX_WIDTH,
                step: '1',
                value: '' + DEFAULT_WIDTH,
            },
                event => {
                    /**
                     * @type {HTMLInputElement}
                     */
                    // @ts-ignore
                    const { target } = event;
                    const width = +target.value;
                    if (width > MAX_WIDTH) {
                        target.value = '' + MAX_WIDTH;
                        setWallHeight(MAX_WIDTH);
                    } else if (width < MIN_WIDTH) {
                        target.value = '' + MIN_WIDTH;
                        setWallHeight(MIN_WIDTH);
                    } else {
                        setWallHeight(width);
                    }
                }
            ),
            h('br'),
            SettingsLabel('Wall Height:', 'height'),
            SettingsInput({
                name: 'height',
                type: 'number',
                min: '' + MIN_HEIGHT,
                max: '' + MAX_HEIGHT,
                step: '1',
                value: '' + DEFAULT_HEIGHT,
            },
                event => {
                    /**
                     * @type {HTMLInputElement}
                     */
                    // @ts-ignore
                    const { target } = event;
                    const height = +target.value;
                    if (height > MAX_HEIGHT) {
                        target.value = '' + MAX_HEIGHT;
                        setWallHeight(MAX_HEIGHT);
                    } else if (height < MIN_HEIGHT) {
                        target.value = '' + MIN_HEIGHT;
                        setWallHeight(MIN_HEIGHT);
                    } else {
                        setWallHeight(height);
                    }
                }
            ),
            h('br'),
            SettingsLabel('Primary Color:', 'primary-color'),
            SettingsInput({
                name: 'primary-color',
                type: 'color',
                value: DEFAULT_PRIMARY_COLOR,
            },
                event => {
                    // @ts-ignore
                    setPrimaryColor(event.target.value);
                },
            ),
            h('br'),
            SettingsLabel('Secondary Color:', 'secondary-color'),
            SettingsInput({
                name: 'secondary-color',
                type: 'color',
                value: DEFAULT_SECONDARY_COLOR,
            },
                event => {
                    // @ts-ignore
                    setSecondaryColor(event.target.value);
                },
            ),
            h('br'),
            SettingsButton('Toggle Shape', togglePixelShape),
            h('br'),
            SettingsButton('Back', () => {
                settingsContainer.style.display = 'none';
            }),
        ]),
    ])
);
