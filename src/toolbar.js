// @ts-check
import { h } from './common.js';
import { resetPixels } from './wall.js';
import { settingsContainer } from './settings.js';

/**
 * @param {string} text
 * @param {() => void} onClick
 */
const ToolbarButton = (text, onClick) => (
    h('button', {
        class: 'toolbar-button',
        listeners: {
            click: onClick,
        },
    }, [
        text
    ])
);

export const toolbar = (
    h('nav', {
        id: 'toolbar',
    }, [
        ToolbarButton('Reset', () => {
            if (confirm('Reset all pixels?')) {
                resetPixels();
            }
        }),
        ToolbarButton('Settings', () => {
            const { style: settingsContainerStyle } = settingsContainer;
            settingsContainerStyle.display = (
                settingsContainerStyle.display === 'none'
                    ? 'block'
                    : 'none'
            );
        }),
    ])
);
