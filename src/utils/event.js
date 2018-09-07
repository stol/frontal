/**
 * @param {Node}   element
 * @param {String} eventName
 *
 */
export function trigger(element, eventName) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, false);
    element.dispatchEvent(event);
};


/**
 * @param {Node}   element
 * @param {String} eventName
 * @param {Object} data
 *
 */
export function triggerCustomEvent(element, eventName, data) {

    let event;
    if (window.CustomEvent) {
        event = new CustomEvent(eventName, data);
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, data);
    }

    element.dispatchEvent(event);
};
