// @ts-check
import { h } from './common.js';

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
        h('div', {
            id: 'settings-window',
        }, [
            SettingsButton('Back', () => {
                settingsContainer.style.display = 'none';
            }),
        ]),
    ])
);
