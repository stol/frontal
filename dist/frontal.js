(function(e, a) { for(var i in a) e[i] = a[i]; }(window, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Frontal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var delegate = __webpack_require__(2);

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
var Frontal = exports.Frontal = function () {
    function Frontal() {
        _classCallCheck(this, Frontal);
    }

    _createClass(Frontal, null, [{
        key: 'listen',


        /**
         * @param {Object} options
         *
         */
        value: function listen() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


            // check click for anything with data-f-hover, or submit button
            delegate(document, '[data-f-ajaxify]:not(form), [type="submit"]', 'click', Frontal.handleEvent.bind(this));

            // check submit and hover for data-f-ajaxify elems
            delegate(document, '[data-f-ajaxify]', 'submit', Frontal.handleEvent.bind(this));
        }

        /**
         * @description Click/submit handler
         *              Event target is :
         *                - if event is click : anything but a form
         *                - if event is submit : a form
         *
         * @param {Object} event
         *
         * @listens click|submit
         */

    }, {
        key: 'handleEvent',
        value: function handleEvent(event) {

            // It's a button, and not inside a form[data-f-ajaxify], do nothing
            if (event.target.matches('[type="submit"]') && !event.target.closest('form[data-f-ajaxify]')) {
                return;
            }

            // Get the instructions
            var ajaxify = event.target.dataset.fAjaxify || null,
                href = event.target.dataset.fHref || event.target.getAttribute('href') || event.target.getAttribute('action'),
                loading = event.target.dataset.fLoading || null,
                uniq = event.target.dataset.fUniq || null,
                confirm = event.target.dataset.fConfirm || null,
                stop = event.target.dataset.fStop || null,
                toggle = event.target.dataset.fToggle || null,
                method = event.target.dataset.fMethod || null,
                form = event.target.closest('form[data-f-ajaxify]');

            // A submit button/input has been clicked ? Let's find the relative form
            if (event.target.matches('[type=submit]')) {

                href = href || form.getAttribute("action");
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

                var input = document.createElement('input');
                input.type = 'hidden';
                input.classList.add('js-injected');
                input.name = node.name;
                input.value = node.value;

                form.appendChild(input);

                event.target.classList.add('js-loading');

                return;
            }

            // Forms actions should be posts. YES THEY SHOULD :p
            if (event.target.matches('form')) {
                method = 'post';
            } else {
                method = method || 'get';
            }

            event.target.classList.add('js-loading');

            // Set the state to 0, so the action won't be executed twice
            event.target.dataset.fAjaxify = 0;

            var data = {};

            // Retrieve data to be sent to the server
            if (event.target.matches('form')) {

                data = new FormData(event.target);
            }

            var callbackCommon = function callbackCommon(xhr) {

                if (event.target.matches('form') && toggle && xhr.success) {

                    event.target.querySelector('[type="submit"]').dataset.fStop = "";
                }
            };

            // Callback when the call was successful
            var callbackDone = function callbackDone(xhr) {
                Frontal.handleResponse(xhr.responseText, event.target);
                callbackCommon(xhr);
            };

            // Callback when the call has server error
            var callbackFail = function callbackFail(xhr) {

                Frontal.handleResponse(xhr.responseJSON, event.target);

                callbackCommon(xhr.responseJSON);
            };

            // Callback in any case, success or error
            var callbackAlways = function callbackAlways() {

                event.target.dataset.fAjaxify = uniq ? null : 1;

                event.target.matches('form') && event.target.querySelector('.js-injected') && event.target.querySelector('.js-injected').remove();

                event.target.classList.remove('js-loading');
            };

            // Finaly, cancel default form submit, so frontal can handle it
            event.preventDefault();

            return new Promise(function (resolve, reject) {

                var xhr = new XMLHttpRequest();
                xhr.open(method, href);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.withCredentials = true;

                xhr.onload = function () {
                    xhr.status === 200 ? resolve(xhr) : reject(xhr);
                };

                xhr.onerror = function () {
                    reject(xhr);
                };

                xhr.send(data);
            }).then(callbackDone).catch(callbackFail).then(callbackAlways);
        }

        /**
         * @description Server responses handler
         *
         * @param {Object} response
         * @param {Node}   node
         *
         */

    }, {
        key: 'handleResponse',
        value: function handleResponse(response) {
            var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


            if (typeof response === 'string') {
                response = JSON.parse(response);
            }

            if (typeof response.actions === 'undefined') {
                return;
            }

            var actions = Array.isArray(response.actions) ? response.actions : [response.actions];

            var query = null,
                action = null;

            // Loop on each action
            for (var i = 0; i < actions.length; i++) {

                action = actions[i];

                if (action.selector === 'this') {
                    query = node;
                } else if (action.selector) {
                    query = document.querySelector(action.selector);
                }

                if (typeof FrontalCallbacks[action.method] !== 'undefined') {

                    query = FrontalCallbacks[action.method].apply(query, action.args);
                }
            }

            (0, _event.triggerCustomEvent)(document, 'contentchange');

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

    }, {
        key: 'ajaxify',
        value: function ajaxify(url, node) {
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';


            return new Promise(function (resolve, reject) {

                var xhr = new XMLHttpRequest();
                xhr.open(method, url);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.withCredentials = true;

                xhr.onload = function () {
                    xhr.status === 200 ? resolve(xhr) : reject(xhr);
                };

                xhr.onerror = function () {
                    reject(xhr);
                };

                xhr.send();
            }).then(function (response) {

                Frontal.handleResponse(response.statusText, node);
            });
        }
    }]);

    return Frontal;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.triggerCustomEvent = triggerCustomEvent;
/**
 * @param {Node}   element
 * @param {String} eventName
 * @param {Object} data
 *
 */
function triggerCustomEvent(element, eventName, data) {

    var event = void 0;
    if (window.CustomEvent) {
        event = new CustomEvent(eventName, data);
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, data);
    }

    element.dispatchEvent(event);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var closest = __webpack_require__(3);

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;


/***/ })
/******/ ])));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmNhY2U2NmRhNjc5Zjg5ODYxNzAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Zyb250YWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2V2ZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kZWxlZ2F0ZS9zcmMvZGVsZWdhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2RlbGVnYXRlL3NyYy9jbG9zZXN0LmpzIl0sIm5hbWVzIjpbImRlbGVnYXRlIiwicmVxdWlyZSIsIkZyb250YWwiLCJvcHRpb25zIiwiZG9jdW1lbnQiLCJoYW5kbGVFdmVudCIsImJpbmQiLCJldmVudCIsInRhcmdldCIsIm1hdGNoZXMiLCJjbG9zZXN0IiwiYWpheGlmeSIsImRhdGFzZXQiLCJmQWpheGlmeSIsImhyZWYiLCJmSHJlZiIsImdldEF0dHJpYnV0ZSIsImxvYWRpbmciLCJmTG9hZGluZyIsInVuaXEiLCJmVW5pcSIsImNvbmZpcm0iLCJmQ29uZmlybSIsInN0b3AiLCJmU3RvcCIsInRvZ2dsZSIsImZUb2dnbGUiLCJtZXRob2QiLCJmTWV0aG9kIiwiZm9ybSIsInByZXZlbnREZWZhdWx0Iiwid2luZG93IiwiaW5wdXQiLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsImNsYXNzTGlzdCIsImFkZCIsIm5hbWUiLCJub2RlIiwidmFsdWUiLCJhcHBlbmRDaGlsZCIsImRhdGEiLCJGb3JtRGF0YSIsImNhbGxiYWNrQ29tbW9uIiwieGhyIiwic3VjY2VzcyIsInF1ZXJ5U2VsZWN0b3IiLCJjYWxsYmFja0RvbmUiLCJoYW5kbGVSZXNwb25zZSIsInJlc3BvbnNlVGV4dCIsImNhbGxiYWNrRmFpbCIsInJlc3BvbnNlSlNPTiIsImNhbGxiYWNrQWx3YXlzIiwicmVtb3ZlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwid2l0aENyZWRlbnRpYWxzIiwib25sb2FkIiwic3RhdHVzIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY2F0Y2giLCJyZXNwb25zZSIsIkpTT04iLCJwYXJzZSIsImFjdGlvbnMiLCJBcnJheSIsImlzQXJyYXkiLCJxdWVyeSIsImFjdGlvbiIsImkiLCJsZW5ndGgiLCJzZWxlY3RvciIsIkZyb250YWxDYWxsYmFja3MiLCJhcHBseSIsImFyZ3MiLCJ1cmwiLCJzdGF0dXNUZXh0IiwidHJpZ2dlckN1c3RvbUV2ZW50IiwiZWxlbWVudCIsImV2ZW50TmFtZSIsIkN1c3RvbUV2ZW50IiwiY3JlYXRlRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJkaXNwYXRjaEV2ZW50Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0RBOzs7O0FBRkEsSUFBTUEsV0FBVyxtQkFBQUMsQ0FBUSxDQUFSLENBQWpCOztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQzs7Ozs7SUFLWUMsTyxXQUFBQSxPOzs7Ozs7Ozs7QUFFVDs7OztpQ0FJNEI7QUFBQSxnQkFBZEMsT0FBYyx1RUFBSixFQUFJOzs7QUFFeEI7QUFDQUgscUJBQVNJLFFBQVQsRUFBbUIsNkNBQW5CLEVBQWtFLE9BQWxFLEVBQTJFRixRQUFRRyxXQUFSLENBQW9CQyxJQUFwQixDQUF5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QVcsUUFBUTtBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLHFCQUFxQjtBQUNoQyxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsU0FBUztBQUNwQixXQUFXLFFBQVE7QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsU0FBUztBQUNwQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzdFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJkaXN0L2Zyb250YWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiY2FjZTY2ZGE2NzlmODk4NjE3MCIsImNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnZGVsZWdhdGUnKTtcblxuaW1wb3J0IHsgdHJpZ2dlckN1c3RvbUV2ZW50IH0gZnJvbSAnLi91dGlscy9ldmVudCc7XG5cbi8qKlxuICogZnJvbnRhbC5qcyAxLjAuMFxuICpcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNCBnaXRodWIuY29tL1N0b2xcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbiAvKipcbiAgKlxuICAqIEBjbGFzcyBGcm9udGFsXG4gICogQHZlcnNpb24gMS4wLjBcbiAgKi9cbmV4cG9ydCBjbGFzcyBGcm9udGFsIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICpcbiAgICAgKi9cbiAgICBzdGF0aWMgbGlzdGVuKG9wdGlvbnMgPSB7fSkge1xuXG4gICAgICAgIC8vIGNoZWNrIGNsaWNrIGZvciBhbnl0aGluZyB3aXRoIGRhdGEtZi1ob3Zlciwgb3Igc3VibWl0IGJ1dHRvblxuICAgICAgICBkZWxlZ2F0ZShkb2N1bWVudCwgJ1tkYXRhLWYtYWpheGlmeV06bm90KGZvcm0pLCBbdHlwZT1cInN1Ym1pdFwiXScsICdjbGljaycsIEZyb250YWwuaGFuZGxlRXZlbnQuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgLy8gY2hlY2sgc3VibWl0IGFuZCBob3ZlciBmb3IgZGF0YS1mLWFqYXhpZnkgZWxlbXNcbiAgICAgICAgZGVsZWdhdGUoZG9jdW1lbnQsICdbZGF0YS1mLWFqYXhpZnldJywgJ3N1Ym1pdCcsIEZyb250YWwuaGFuZGxlRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIENsaWNrL3N1Ym1pdCBoYW5kbGVyXG4gICAgICogICAgICAgICAgICAgIEV2ZW50IHRhcmdldCBpcyA6XG4gICAgICogICAgICAgICAgICAgICAgLSBpZiBldmVudCBpcyBjbGljayA6IGFueXRoaW5nIGJ1dCBhIGZvcm1cbiAgICAgKiAgICAgICAgICAgICAgICAtIGlmIGV2ZW50IGlzIHN1Ym1pdCA6IGEgZm9ybVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gICAgICpcbiAgICAgKiBAbGlzdGVucyBjbGlja3xzdWJtaXRcbiAgICAgKi9cbiAgICBzdGF0aWMgaGFuZGxlRXZlbnQoZXZlbnQpIHtcblxuICAgICAgICAvLyBJdCdzIGEgYnV0dG9uLCBhbmQgbm90IGluc2lkZSBhIGZvcm1bZGF0YS1mLWFqYXhpZnldLCBkbyBub3RoaW5nXG4gICAgICAgIGlmIChldmVudC50YXJnZXQubWF0Y2hlcygnW3R5cGU9XCJzdWJtaXRcIl0nKVxuICAgICAgICAgICAgJiYgIWV2ZW50LnRhcmdldC5jbG9zZXN0KCdmb3JtW2RhdGEtZi1hamF4aWZ5XScpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHZXQgdGhlIGluc3RydWN0aW9uc1xuICAgICAgICBsZXQgYWpheGlmeSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LmZBamF4aWZ5IHx8IG51bGwsXG4gICAgICAgICAgICBocmVmICAgID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQuZkhyZWZcbiAgICAgICAgICAgICAgICAgICAgfHwgZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICAgICAgICAgICAgICAgIHx8IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2FjdGlvbicpLFxuICAgICAgICAgICAgbG9hZGluZyA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LmZMb2FkaW5nIHx8IG51bGwsXG4gICAgICAgICAgICB1bmlxICAgID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQuZlVuaXEgICAgfHwgbnVsbCxcbiAgICAgICAgICAgIGNvbmZpcm0gPSBldmVudC50YXJnZXQuZGF0YXNldC5mQ29uZmlybSB8fCBudWxsLFxuICAgICAgICAgICAgc3RvcCAgICA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LmZTdG9wICAgIHx8IG51bGwsXG4gICAgICAgICAgICB0b2dnbGUgID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQuZlRvZ2dsZSAgfHwgbnVsbCxcbiAgICAgICAgICAgIG1ldGhvZCAgPSBldmVudC50YXJnZXQuZGF0YXNldC5mTWV0aG9kICB8fCBudWxsLFxuICAgICAgICAgICAgZm9ybSAgICA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCdmb3JtW2RhdGEtZi1hamF4aWZ5XScpO1xuXG4gICAgICAgIC8vIEEgc3VibWl0IGJ1dHRvbi9pbnB1dCBoYXMgYmVlbiBjbGlja2VkID8gTGV0J3MgZmluZCB0aGUgcmVsYXRpdmUgZm9ybVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoJ1t0eXBlPXN1Ym1pdF0nKSkge1xuXG4gICAgICAgICAgICBocmVmICAgID0gaHJlZiB8fCBmb3JtLmdldEF0dHJpYnV0ZShcImFjdGlvblwiKTtcbiAgICAgICAgICAgIGFqYXhpZnkgPSBmb3JtLmRhdGFzZXQuZkFqYXhpZnk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBObyBhY3Rpb24gdXJsIHByb3ZpZGVkID8gRG8gbm90aGluZ1xuICAgICAgICBpZiAoIWhyZWYpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBtYWluIGNvbW1hbmQgaXMgMCA/IFN0b3AgZXZlbnQgcHJvcGFnYXRpb24gYW5kIHN0b3AgdGhlcmUsXG4gICAgICAgIC8vIHRvIGxldCB0aGUgdGltZSB0byB0aGUgcHJldmlvdXMgYWN0aW9uIHRvIGZpbmlzaFxuICAgICAgICAvLyAodG8gcHJldmVudCBtdWx0aXBsZSBjbGljcylcbiAgICAgICAgaWYgKGFqYXhpZnkgPT09ICcwJykge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgYnV0dG9uIHNob3VsZG4ndCBkbyBhbnl0aGluZyA/XG4gICAgICAgIGlmIChzdG9wKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXMgdGhlcmUgYSBjb25maXJtIG1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIGJlZm9yZSBzZW5kaW5nIHRoZSBhY3Rpb24gP1xuICAgICAgICBpZiAoY29uZmlybSAmJiAhd2luZG93LmNvbmZpcm0oY29uZmlybSkpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbG9uZSB0aGUgY2xpY2tlZCBidXR0b24gYXMgYSBoaWRkZW4gZmllbGQsIHNvIHRoZSBzZXJ2ZXIga25vd3NcbiAgICAgICAgLy8gd2hpY2ggb25lIHdhcyBjbGlja2VkXG4gICAgICAgIGlmIChldmVudC50YXJnZXQubWF0Y2hlcygnW3R5cGU9XCJzdWJtaXRcIl0nKSkge1xuXG4gICAgICAgICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgaW5wdXQudHlwZSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnanMtaW5qZWN0ZWQnKTtcbiAgICAgICAgICAgIGlucHV0Lm5hbWUgPSBub2RlLm5hbWU7XG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IG5vZGUudmFsdWU7XG5cbiAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXG4gICAgICAgICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LmFkZCgnanMtbG9hZGluZycpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb3JtcyBhY3Rpb25zIHNob3VsZCBiZSBwb3N0cy4gWUVTIFRIRVkgU0hPVUxEIDpwXG4gICAgICAgIGlmIChldmVudC50YXJnZXQubWF0Y2hlcygnZm9ybScpKXtcbiAgICAgICAgICAgIG1ldGhvZCA9ICdwb3N0JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1ldGhvZCA9IG1ldGhvZCB8fCAnZ2V0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdqcy1sb2FkaW5nJyk7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBzdGF0ZSB0byAwLCBzbyB0aGUgYWN0aW9uIHdvbid0IGJlIGV4ZWN1dGVkIHR3aWNlXG4gICAgICAgIGV2ZW50LnRhcmdldC5kYXRhc2V0LmZBamF4aWZ5ID0gMDtcblxuICAgICAgICBsZXQgZGF0YSA9IHt9O1xuXG4gICAgICAgIC8vIFJldHJpZXZlIGRhdGEgdG8gYmUgc2VudCB0byB0aGUgc2VydmVyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQubWF0Y2hlcygnZm9ybScpKSB7XG5cbiAgICAgICAgICAgIGRhdGEgPSBuZXcgRm9ybURhdGEoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrQ29tbW9uID0geGhyID0+IHtcblxuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5tYXRjaGVzKCdmb3JtJylcbiAgICAgICAgICAgICAgICAmJiB0b2dnbGVcbiAgICAgICAgICAgICAgICAmJiB4aHIuc3VjY2Vzcykge1xuXG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1t0eXBlPVwic3VibWl0XCJdJykuZGF0YXNldC5mU3RvcCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQ2FsbGJhY2sgd2hlbiB0aGUgY2FsbCB3YXMgc3VjY2Vzc2Z1bFxuICAgICAgICBjb25zdCBjYWxsYmFja0RvbmUgPSB4aHIgPT4ge1xuICAgICAgICAgICAgRnJvbnRhbC5oYW5kbGVSZXNwb25zZSh4aHIucmVzcG9uc2VUZXh0LCBldmVudC50YXJnZXQpO1xuICAgICAgICAgICAgY2FsbGJhY2tDb21tb24oeGhyKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDYWxsYmFjayB3aGVuIHRoZSBjYWxsIGhhcyBzZXJ2ZXIgZXJyb3JcbiAgICAgICAgY29uc3QgY2FsbGJhY2tGYWlsID0geGhyID0+IHtcblxuICAgICAgICAgICAgRnJvbnRhbC5oYW5kbGVSZXNwb25zZSh4aHIucmVzcG9uc2VKU09OLCBldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgICBjYWxsYmFja0NvbW1vbih4aHIucmVzcG9uc2VKU09OKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDYWxsYmFjayBpbiBhbnkgY2FzZSwgc3VjY2VzcyBvciBlcnJvclxuICAgICAgICBjb25zdCBjYWxsYmFja0Fsd2F5cyA9ICgpID0+IHtcblxuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmRhdGFzZXQuZkFqYXhpZnkgPSB1bmlxID8gbnVsbCA6IDE7XG5cbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5tYXRjaGVzKCdmb3JtJykgJiZcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuanMtaW5qZWN0ZWQnKSAmJlxuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5qcy1pbmplY3RlZCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnanMtbG9hZGluZycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEZpbmFseSwgY2FuY2VsIGRlZmF1bHQgZm9ybSBzdWJtaXQsIHNvIGZyb250YWwgY2FuIGhhbmRsZSBpdFxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4obWV0aG9kLCBocmVmKTtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xuICAgICAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gICAgICAgICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zdGF0dXMgPT09IDIwMCA/IHJlc29sdmUoeGhyKSA6IHJlamVjdCh4aHIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB4aHIub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoeGhyKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihjYWxsYmFja0RvbmUpXG4gICAgICAgIC5jYXRjaChjYWxsYmFja0ZhaWwpXG4gICAgICAgIC50aGVuKGNhbGxiYWNrQWx3YXlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2VydmVyIHJlc3BvbnNlcyBoYW5kbGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2VcbiAgICAgKiBAcGFyYW0ge05vZGV9ICAgbm9kZVxuICAgICAqXG4gICAgICovXG4gICAgc3RhdGljIGhhbmRsZVJlc3BvbnNlKHJlc3BvbnNlLCBub2RlID0gbnVsbCkge1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzcG9uc2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXNwb25zZS5hY3Rpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IEFycmF5LmlzQXJyYXkocmVzcG9uc2UuYWN0aW9ucykgPyByZXNwb25zZS5hY3Rpb25zIDogW3Jlc3BvbnNlLmFjdGlvbnNdO1xuXG4gICAgICAgIGxldCBxdWVyeSAgPSBudWxsLFxuICAgICAgICAgICAgYWN0aW9uID0gbnVsbDtcblxuICAgICAgICAvLyBMb29wIG9uIGVhY2ggYWN0aW9uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBhY3Rpb24gPSBhY3Rpb25zW2ldO1xuXG4gICAgICAgICAgICBpZiAoYWN0aW9uLnNlbGVjdG9yID09PSAndGhpcycpIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBGcm9udGFsQ2FsbGJhY2tzW2FjdGlvbi5tZXRob2RdICE9PSAndW5kZWZpbmVkJykge1xuXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBGcm9udGFsQ2FsbGJhY2tzW2FjdGlvbi5tZXRob2RdLmFwcGx5KHF1ZXJ5LCBhY3Rpb24uYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0cmlnZ2VyQ3VzdG9tRXZlbnQoZG9jdW1lbnQsICdjb250ZW50Y2hhbmdlJyk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBGaXJlIGFuIGFqYXggY2FsbCwgd2l0aCBmcm9udGFsIGhhbmRsaW5nIHRoZSBzZXJ2ZXIgcmVzcG9uc2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAgICAgKiBAcGFyYW0ge05vZGV9ICAgbm9kZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG4gICAgc3RhdGljIGFqYXhpZnkodXJsLCBub2RlLCBtZXRob2QgPSAnR0VUJykge1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgICAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgeGhyLnN0YXR1cyA9PT0gMjAwID8gcmVzb2x2ZSh4aHIpIDogcmVqZWN0KHhocilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdCh4aHIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuXG4gICAgICAgICAgICBGcm9udGFsLmhhbmRsZVJlc3BvbnNlKHJlc3BvbnNlLnN0YXR1c1RleHQsIG5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZnJvbnRhbC5qcyIsIi8qKlxuICogQHBhcmFtIHtOb2RlfSAgIGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJpZ2dlckN1c3RvbUV2ZW50KGVsZW1lbnQsIGV2ZW50TmFtZSwgZGF0YSkge1xuXG4gICAgbGV0IGV2ZW50O1xuICAgIGlmICh3aW5kb3cuQ3VzdG9tRXZlbnQpIHtcbiAgICAgICAgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCBkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgICBldmVudC5pbml0Q3VzdG9tRXZlbnQoZXZlbnROYW1lLCB0cnVlLCB0cnVlLCBkYXRhKTtcbiAgICB9XG5cbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlscy9ldmVudC5qcyIsInZhciBjbG9zZXN0ID0gcmVxdWlyZSgnLi9jbG9zZXN0Jyk7XG5cbi8qKlxuICogRGVsZWdhdGVzIGV2ZW50IHRvIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIF9kZWxlZ2F0ZShlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICB2YXIgbGlzdGVuZXJGbiA9IGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBEZWxlZ2F0ZXMgZXZlbnQgdG8gYSBzZWxlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8U3RyaW5nfEFycmF5fSBbZWxlbWVudHNdXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGRlbGVnYXRlKGVsZW1lbnRzLCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICAvLyBIYW5kbGUgdGhlIHJlZ3VsYXIgRWxlbWVudCB1c2FnZVxuICAgIGlmICh0eXBlb2YgZWxlbWVudHMuYWRkRXZlbnRMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gX2RlbGVnYXRlLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIEVsZW1lbnQtbGVzcyB1c2FnZSwgaXQgZGVmYXVsdHMgdG8gZ2xvYmFsIGRlbGVnYXRpb25cbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gVXNlIGBkb2N1bWVudGAgYXMgdGhlIGZpcnN0IHBhcmFtZXRlciwgdGhlbiBhcHBseSBhcmd1bWVudHNcbiAgICAgICAgLy8gVGhpcyBpcyBhIHNob3J0IHdheSB0byAudW5zaGlmdCBgYXJndW1lbnRzYCB3aXRob3V0IHJ1bm5pbmcgaW50byBkZW9wdGltaXphdGlvbnNcbiAgICAgICAgcmV0dXJuIF9kZWxlZ2F0ZS5iaW5kKG51bGwsIGRvY3VtZW50KS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBTZWxlY3Rvci1iYXNlZCB1c2FnZVxuICAgIGlmICh0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIEFycmF5LWxpa2UgYmFzZWQgdXNhZ2VcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGVsZW1lbnRzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gX2RlbGVnYXRlKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogRmluZHMgY2xvc2VzdCBtYXRjaCBhbmQgaW52b2tlcyBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuZXIoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5kZWxlZ2F0ZVRhcmdldCA9IGNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yKTtcblxuICAgICAgICBpZiAoZS5kZWxlZ2F0ZVRhcmdldCkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlbGVtZW50LCBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWxlZ2F0ZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2RlbGVnYXRlL3NyYy9kZWxlZ2F0ZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgRE9DVU1FTlRfTk9ERV9UWVBFID0gOTtcblxuLyoqXG4gKiBBIHBvbHlmaWxsIGZvciBFbGVtZW50Lm1hdGNoZXMoKVxuICovXG5pZiAodHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmICFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gICAgdmFyIHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XG5cbiAgICBwcm90by5tYXRjaGVzID0gcHJvdG8ubWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5vTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICAgICAgICAgIHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgY2xvc2VzdCBwYXJlbnQgdGhhdCBtYXRjaGVzIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBjbG9zZXN0IChlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgIT09IERPQ1VNRU5UX05PREVfVFlQRSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQubWF0Y2hlcyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgICAgZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb3Nlc3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9kZWxlZ2F0ZS9zcmMvY2xvc2VzdC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9