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
