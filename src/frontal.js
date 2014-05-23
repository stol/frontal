/**
 * frontal.js 0.6.2
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
; (function (define) {
    define(['jquery'], function ($) {

        var $loading = null,
            loadingTimer,
            loadingFrame = 1,
            settings = {};

        function listen(options){ 
            $(document)
                // check click for anything with data-f-hover, or submit button
                .on("click", "[data-f-ajaxify]:not(form), [type=submit]", handleEvent)
                // check submit and hover for data-f-ajaxify elems
                .on("submit mouseenter", "[data-f-ajaxify]", handleEvent);

            $.extend(settings, options);

            catchUp();
        }

        /**
         * Get elements with data-f-register="URL"
         * and "ajaxifies" the URL
         */
        function catchUp(){
            $("[data-f-register]").each(function(i, elem){
                ajaxify($(elem).attr('data-f-register'), $(elem), $(elem).attr("data-f-method"));
            });
        }

        /**
         * Click/hover/submit handler
         * Event target is : 
         *     - if event is click : anything but a form
         *     - if event is submit : a form
         *     - if event is mouseenter : anything
         */ 
        function handleEvent(e)
        {
            var elem  = e.currentTarget,
                $elem = $(elem);

            // It's a button, and not inside a form[data-f-ajaxify], do nothing
            if ($elem.is("[type=submit]") && !$elem.closest("form[data-f-ajaxify]")[0]){
                return;
            }

            // If event is a mouseenter, but there is not hover directive, do nothing 
            if (e.type == "mouseenter" && !$elem.attr("data-f-hover")){
                return;
            }

            // Get the instructions
            var ajaxify = $elem.attr("data-f-ajaxify") || null,
                href    = $elem.attr("data-f-href") || $elem.attr("href") || $elem.attr("action"),
                loading = $elem.attr("data-f-loading") || null,
                uniq    = $elem.attr("data-f-uniq") || null,
                confirm = $elem.attr("data-f-confirm") || null,
                stop    = $elem.attr("data-f-stop") || null,
                toggle  = $elem.attr("data-f-toggle") || null,
                $form   = null,
                method  = $elem.attr("data-f-method") || null,
                e_type  = e.type;
            
            // A submit button/input has been clicked ? Let's find the relative form
            if ($elem.is("[type=submit]")) {
                $form   = $elem.closest("form[data-f-ajaxify]");
                href    = href || $form.attr("action");
                ajaxify = $form.attr("data-f-ajaxify");
                confirm = confirm || $elem.attr("data-f-confirm");
            }

            // No action url provided ? Do nothing
            if (!href) {
                return;
            }

            // The main command is 0 ? Stop event propagation and stop there,
            // to let the time to the previous action to finish
            // (to prevent multiple clics)
            if (ajaxify === "0") {
                e.preventDefault();
                return;
            }

            // This button shouldn't do anything ?
            if (stop) {
                e.preventDefault();
                return;
            }

            // Is there a confirm message to be displayed before sending the action ?
            if (confirm && !window.confirm(confirm)) {
                e.preventDefault();
                return;
            }

            // Clone the clicked button as a hidden field, so the server knows
            // which one was clicked
            if ($elem.is("[type=submit]")) {
                $form.append(
                    $('<input type="hidden" class="js-injected"/>').attr({
                        name: $elem.attr("name") || '',
                        value: $elem.val() || ''
                    })
                );

                showActivity($elem[0]);
                return;
            }

            // Forms actions should be posts. YES THEY SHOULD :p
            if ($elem.is("form")){
                method = "post";
            }
            else{
                method = method || "get";
            }

            // Show activity (loading state...) (to be configured by user)
            showActivity(elem, loading);

            // Set the state to 0, so the action won't be executed twice
            $elem.attr("data-f-ajaxify", "0");

            var data;
            // Retrieve data to be sent to the server
            if ($elem.is("form")){
                data = $elem.serializeArray();
                data.push({name:"__ajax__", value: 1});
            }
            else {
                data = {__ajax__: 1};
            }
            
            // Ajax call settings
            var ajax_settings = {
                url: href,
                type: method,   
                data: data,
                xhrFields: {
                    withCredentials: true
                }
            };


            var callback_common = function(response){
                if ($elem.is("form") && toggle && response.success) {
                    var $ori = $elem.find(".js-loading");
                    $elem.find("[type=submit]").attr("data-f-stop", "")
                        .filter(".js-loading").attr("data-f-stop", "1");
                }
            };

            // Callback when the call was successful
            var callback_done = function(response) {
                handleResponse(response, $elem);
                callback_common(response);
            };

            // Callback when the call has server error 
            var callback_fail = function(jqXHR) {
                var response = jqXHR.responseJSON;
                handleResponse(response, $elem);
                callback_common(response);
            };

            // Callback in any case, success or error
            var callback_always = function(){
                $elem.attr("data-f-ajaxify", uniq ? null : "1");
                $elem.is("form") && $elem.find(".js-injected").remove();
                hideActivity(elem);
                e_type == "mouseenter" && $elem.trigger("mouseenter");
            };

            // Do we have a user custom function to call before ajax ?
            settings.onBeforeAjax
                ? settings.onBeforeAjax(ajax_settings, callback_done, callback_always)
                : $.ajax(ajax_settings).done(callback_done).fail(callback_fail).always(callback_always)
            ;

            // Finaly, cancel default form submit, so frontal can handle it
            e.preventDefault();
        }

        /**
         * Server responses handler 
         */
        function handleResponse(response, $elem) {
            $elem = $elem || null;

            if (typeof response == "string")
                response = JSON.parse(response);
            
            if (typeof response.actions == "undefined") 
                return;

            var actions = $.isArray(response.actions) ? response.actions : [response.actions];

            var $query = null,
                action = null;

            // Loop on each action
            for (var i=0; i<actions.length; i++) {
                action = actions[i];

                // Is it a jQuery method bases on a selector ?
                if ($.fn[action.method]){
                    // We can retrieve original event target
                    if ($elem && action.selector === "this" ){
                        $query = $elem;
                    }
                    else if (action.selector){
                        $query = $(action.selector);
                    }

                    // Pour le cas où le 1er call ne contient pas de selecteur;
                    $query = $query
                        ? $query[action.method].apply($query, action.args)
                        : $()[action.method].apply($, action.args)
                    ;
                }
                // Or a method without selector ?
                else if ($[action.method]){
                    $[action.method].apply($, [action.args]);
                }
                // Or a custom action ?
                // TODO : should be a plugin. Juste a sample of what can be done
                else{
                    switch(action.method) {
                        case 'redirect':
                            document.location.href = action.args; // Args = url
                            break;
                    }
                }
            }

            $(document).trigger("contentchange");
            return;

        }

        /**
         * Public method to fire an ajax call, with frontal handling the server response
         * Ex : frontal.ajaxify("une/url/avec/index.php");
         */
        function ajaxify(url, $elem, method){
            method = method || 'get';
            $.ajax({
                url: url,
                type: method,   
                xhrFields: {
                    withCredentials: true
                }
            }).done(function(response){
                handleResponse(response, $elem);
            });
        }

        /**
         * Adds a spinner
         * FIXME : user should be able to customize it
         */
        function showActivity(node, loading){

            if (loading && loading=="spinner"){
                if (!$loading) {
                    $loading = $('<div class="spinner"><div class="spinner-inner"><div class="spinner-icn"></div></div></div>').appendTo("body");
                }
                clearInterval(loadingTimer);
                $loading.show();
                loadingTimer = setInterval(function() {
                
                if (!$loading.is(':visible')){
                    clearInterval(loadingTimer);
                    return;
                }

                $('.spinner-icn', $loading).css('top', (loadingFrame * -40) + 'px');

                    loadingFrame = (loadingFrame + 1) % 12;
                }, 66);
                return;
            }
            else if (node){
                $(node).addClass("js-loading");
                return;
            }

        }
        /**
         * Hides the spinner activity
         */
        function hideActivity(elem) {
            elem && $(elem).removeClass("js-loading").find(".js-loading").removeClass("js-loading");
            if ($loading){
                $loading.hide();
            }
        }


        /**
         * API functions
         */
        return {
            ajaxify: ajaxify,              // Fire ajax call
            listen : listen,               // Start listening to clics/submits/hovers
            handleResponse: handleResponse // Handles server reponses
        };

    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require(deps[0]));
    } else {
        window.frontal = factory(window.jQuery);
    }
}));
