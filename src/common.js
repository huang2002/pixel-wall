// @ts-check

/**
 * @param {string} tag
 * @param {object} [attributes]
 * @param {(Node | string)[]} [children]
 */
export const h = (tag, attributes, children) => {

    const element = document.createElement(tag);

    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            if (key !== 'listeners') {
                element.setAttribute(key, value);
            } else {
                Object.entries(value).forEach(([eventName, listener]) => {
                    if (eventName[0] === '_') {
                        element.addEventListener(
                            eventName.slice(1),
                            listener,
                            { passive: false }
                        );
                    } else {
                        element.addEventListener(eventName, listener);
                    }
                });
            }
        });
    }

    if (children) {
        children.forEach(child => {
            element.appendChild(
                typeof child === 'string'
                    ? document.createTextNode(child)
                    : child
            );
        });
    }

    return element;

};

/**
 * @type {<T extends (...args: any[]) => void>(callback: T, delay: number) => T}
 */
export const throttle = (callback, delay) => {
    /**
     * @type {any}
     */
    let timer = null;
    // @ts-ignore
    return (...args) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(callback, delay, ...args);
    };
};
