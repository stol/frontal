const delegate = require('delegate');

import { trigger, triggerCustomEvent } from './utils/event';

/**
 * frontal.js 1.0.0
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 github.com/Stol
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

 /**
  *
  * @class Frontal
  * @version 1.0.0
  */
export class Frontal {

    /**
     * @param {Object} options
     *
     */
    static listen(options = {}) {

        // check click for anything with data-f-hover, or submit button
        delegate(document, '[data-f-ajaxify]:not(form), [type="submit"]', 'click', Frontal.handleEvent.bind(this));

        // check submit and hover for data-f-ajaxify elems
        delegate(document, '[data-f-ajaxify]', 'submit', Frontal.handleEvent.bind(this));
        delegate(document, '[data-f-ajaxify]', 'mouseenter', Frontal.handleEvent.bind(this));

        Frontal.catchUp();
    }

    /**
     * @description Get elements with data-f-register="URL"
     *              and "ajaxifies" the URL
     */
    static catchUp() {
        document.querySelectorAll('[data-f-register]').forEach(node => {
            Frontal.ajaxify(node.dataset.fRegister, node, node.dataset.fMethod);
        });
    }

    /**
     * @description Click/submit handler
     *              Event target is :
     *                - if event is click : anything but a form
     *                - if event is submit : a form
     *                - if event is mouseenter : anything
     *
     * @param {Object} event
     *
     * @listens click|mousenter|submit
     */
    static handleEvent(event) {

        // It's a button, and not inside a form[data-f-ajaxify], do nothing
        if (event.target.matches('[type="submit"]')
            && !event.target.closest('form[data-f-ajaxify]')) {
            return;
        }

        // If event is a mouseenter, but there is not hover directive, do nothing
        if (event.type === "mouseenter" && !event.target.dataset.fHover){
            return;
        }

        // Get the instructions
        let ajaxify = event.target.dataset.fAjaxify || null,
            href    = event.target.dataset.fHref
                    || event.target.getAttribute('href')
                    || event.target.getAttribute('action'),
            loading = event.target.dataset.fLoading || null,
            uniq    = event.target.dataset.fUniq    || null,
            confirm = event.target.dataset.fConfirm || null,
            stop    = event.target.dataset.fStop    || null,
            toggle  = event.target.dataset.fToggle  || null,
            method  = event.target.dataset.fMethod  || null,
            form    = event.target.closest('form[data-f-ajaxify]');

        // A submit button/input has been clicked ? Let's find the relative form
        if (event.target.matches('[type=submit]')) {

            href    = href || form.getAttribute("action");
            ajaxify = form.dataset.fAjaxify;
        }

        // No action url provided ? Do nothing
        if (!href) {
            return;
        }

        // The main command is 0 ? Stop event propagation and stop there,
        // to let the time to the previous action to finish
        // (to prevent multiple clics)
        if (ajaxify === '0') {
            event.preventDefault();
            return;
        }

        // This button shouldn't do anything ?
        if (stop) {
            event.preventDefault();
            return;
        }

        // Is there a confirm message to be displayed before sending the action ?
        if (confirm && !window.confirm(confirm)) {
            event.preventDefault();
            return;
        }

        // Clone the clicked button as a hidden field, so the server knows
        // which one was clicked
        if (event.target.matches('[type="submit"]')) {

            let input = document.createElement('input');
            input.type = 'hidden';
            input.classList.add('js-injected');
            input.name = node.name;
            input.value = node.value;

            form.appendChild(input);

            event.target.classList.add('js-loading');

            return;
        }

        // Forms actions should be posts. YES THEY SHOULD :p
        if (event.target.matches('form')){
            method = 'post';
        }
        else {
            method = method || 'get';
        }

        event.target.classList.add('js-loading');

        // Set the state to 0, so the action won't be executed twice
        event.target.dataset.fAjaxify = 0;

        let data = {};

        // Retrieve data to be sent to the server
        if (event.target.matches('form')) {

            data = new FormData(event.target);
        }

        const callbackCommon = xhr => {

            if (event.target.matches('form')
                && toggle
                && xhr.success) {

                event.target.querySelector('[type="submit"]').dataset.fStop = "";
            }
        };

        // Callback when the call was successful
        const callbackDone = xhr => {
            Frontal.handleResponse(xhr.responseText, event.target);
            callbackCommon(xhr);
        };

        // Callback when the call has server error
        const callbackFail = xhr => {

            Frontal.handleResponse(xhr.responseJSON, event.target);

            callbackCommon(xhr.responseJSON);
        };

        // Callback in any case, success or error
        const callbackAlways = () => {

            event.target.dataset.fAjaxify = uniq ? null : 1;

            event.target.matches('form') &&
            event.target.querySelector('.js-injected') &&
            event.target.querySelector('.js-injected').remove();

            event.target.classList.remove('js-loading');

             event.type === "mouseenter" && trigger(event.target, 'mouseenter');
        };

        // Finaly, cancel default form submit, so frontal can handle it
        event.preventDefault();

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest;
                xhr.open(method, href);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.withCredentials = true;

            xhr.onload = () => {
                xhr.status === 200 ? resolve(xhr) : reject(xhr)
            };

            xhr.onerror = () => {
                reject(xhr);
            };

            xhr.send(data);
        })
        .then(callbackDone)
        .catch(callbackFail)
        .then(callbackAlways);
    }

    /**
     * @description Server responses handler
     *
     * @param {Object} response
     * @param {Node}   node
     *
     */
    static handleResponse(response, node = null) {

        if (typeof response === 'string') {
            response = JSON.parse(response);
        }

        if (typeof response.actions === 'undefined') {
            return;
        }

        const actions = Array.isArray(response.actions) ? response.actions : [response.actions];

        let query  = null,
            action = null;

        // Loop on each action
        for (let i = 0; i < actions.length; i++) {

            action = actions[i];

            if (action.selector === 'this') {
                query = node;
            }
            else if (action.selector) {
                query = document.querySelector(action.selector);
            }

            if (typeof FrontalCallbacks[action.method] !== 'undefined') {

                query = FrontalCallbacks[action.method].apply(query, action.args);
            }
        }

        triggerCustomEvent(document, 'contentchange');

        return;
    }

    /**
     * @description Fire an ajax call, with frontal handling the server response
     *
     * @param {String} url
     * @param {Node}   node
     * @param {String} method
     *
     * @return {Promise}
     */
    static ajaxify(url, node, method = 'GET') {

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest;
                xhr.open(method, url);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.withCredentials = true;

            xhr.onload = () => {
                xhr.status === 200 ? resolve(xhr) : reject(xhr)
            };

            xhr.onerror = () => {
                reject(xhr);
            };

            xhr.send();
        })
        .then(response => {

            Frontal.handleResponse(response.statusText, node);
        });
    }
}
