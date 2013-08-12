; (function (define) {
    define(['jquery'], function ($) {

        var $loading = null,
            loadingTimer,
            loadingFrame = 1,
            settings = {};

        function listen(options){ 
            $(document)
                .on("click", ":not(form)[type=submit], :not(form)[data-p-ajaxify]", handleEvent)
                .on("submit", "form[data-p-ajaxify]", handleEvent)
                .on("mouseenter", ":not(form)[type=submit], :not(form)[data-p-ajaxify]", handleEvent)

            $.extend(settings, options);
        }

        /**
         * Click/hover/submit handler
         * Event target is : 
         *     - a button/input if the event is click
         *     - a form if the event is submit
         *     - anything if the event is hover
         */ 
        function handleEvent(e)
        {
            var elem  = e.currentTarget,
                $elem = $(elem)

            // It's a button, and not inside a form[data-p-ajaxify], do nothing
            if ($elem.is("[type=submit]") && !$elem.parents("form[data-p-ajaxify]")[0]){
                return;
            }

            // If event is a mouseenter, but there is not hover directive, do nothing 
            if (e.type == "mouseenter" && !$elem.attr("data-p-hover")){
                return;
            }

            // Get the instructions
            var ajaxify = $elem.attr("data-p-ajaxify") || null,
                href    = $elem.attr("data-p-href") || $elem.attr("href") || $elem.attr("action"),
                loading = $elem.attr("data-p-loading") || null,
                uniq    = $elem.attr("data-p-uniq") || null,
                confirm = $elem.attr("data-p-confirm") || null,
                stop    = $elem.attr("data-p-stop") || null,
                toggle  = $elem.attr("data-p-toggle") || null,
                $form   = null,
                method  = $elem.attr("data-p-method") || null,
                e_type  = e.type;
            
            // A submit button/input has been clicked ? We find the main context
            if ($elem.is("[type=submit]")) {
                $form   = $elem.parents("form[data-p-ajaxify]").first();
                href    = href || $form.attr("action");
                ajaxify = $form.attr("data-p-ajaxify");
                confirm = confirm || $elem.attr("data-p-confirm");
            }

            // The main command is 0 ? Stop event propagation and stop there,
            // to let the time to the previous action to finish
            if (ajaxify === "0") {
                e.preventDefault();
                return;
            }

            // No action url provided ? Do nothing
            if (!href) {
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

            // Forms actions should be posts
            if ($elem.is("form")){
                method = "post";
            }
            else{
                method = method || "get";
            }

            // Show activity (loading state...) (to be configured by user)
            showActivity(elem, loading);

            // Set the state to 0, so the action won't be executed twice
            $elem.attr("data-p-ajaxify", "0")

            // Retrieve data to be sent to the server
            if ($elem.is("form")){
                var data = $elem.serializeArray();
                data.push({name:"__ajax__", value: 1});
            }
            else {
                var data = {__ajax__: 1};
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


            // Callback when the call was successful
            var callback_done = function(response) {
                handleResponse(response);
                if ($elem.is("form") && toggle && response.success) {
                    var $ori = $elem.find(".js-loading");
                    $elem.find("[type=submit]").attr("data-p-stop", "")
                        .filter(".js-loading").attr("data-p-stop", "1")
                }
            }
            // Callback in any case, success or error
            var callback_always = function(){
                $elem.attr("data-p-ajaxify", uniq ? null : "1");
                $elem.is("form") && $elem.find(".js-injected").remove();
                hideActivity(elem);
                if (e_type == "mouseenter")
                    $elem.trigger("mouseenter");

            }

            // Do we have a user custom function to call before ajax ?
            settings.onBeforeAjax
                ? settings.onBeforeAjax(ajax_settings, callback_done, callback_always)
                : $.ajax(ajax_settings).done(callback_done).always(callback_always)
            ;

            // Finaly, cancel default form submit, so frontal can handle it
            e.preventDefault();
        }

        /**
         * Server responses handler 
         */
        function handleResponse(response) {
            if (typeof response == "string")
                response = JSON.parse(response);
            
            if (typeof response.actions == "undefined") 
                return;

            var actions = $.isArray(response.actions) ? response.actions : [response.actions];

            var $query = null
                action = null;

            // Loop on each action
            for (var i=0; i<actions.length; i++) {
                action = actions[i];

                // Is it a jQuery method bases on a selector ?
                if ($.fn[action.method]){
                    $query = action.selector ? $(action.selector) : $query;
                    $query = $query[action.method].apply($query, action.args);

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
                        break
                    }
                }
            }

            $(document).trigger("contentchange")
            return;

        }

        /**
         * Public method to fire an ajax call, with frontal handling the server response
         * Ex : frontal.ajaxify("une/url/avec/index.php");
         */
        function ajaxify(url){
            $.get(url, function(response) {
                handleResponse(response);
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
                
        };


        /**
         * API functions
         */
        return {
            ajaxify: ajaxify,              // Fire ajax call
            listen : listen,               // Start listening to clics/submits/hovers
            handleResponse: handleResponse // Handles server reponses
        }

    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require(deps[0]));
    } else {
        window['frontal'] = factory(window['jQuery']);
    }
}));
