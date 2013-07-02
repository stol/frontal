frontal.js
=======

Control your javascript interactions from the server.

Your frontend application logic is handled server side.


### Basic use

The following link should work without JS. But with frontal.js and the appropriate server response, ajax magic should happend !

    
    <a class="some-link" href="/some-url.php" data-p-ajaxify="1">Show me the data</a>

And pseudo code, server side

    function someControllerAction()
    {
        // Main content of the page
        $viewContent = render('/some-view.tpl');

        // If ajax, add content after the link, and remove the link 
        if ($request->isAjax(){
            // Call to a php wrapper, generating json instructions
            Frontal::getInstance()
                ->query(".some-link")
                ->after($viewContent)
                ->remove()
            ->send(); // => Does exit
        }
        
        // Otherwise, render the page normally
        $layout->set('content', $viewContent);
        $layout->render();
    }

Voilà !

The server, when receiving a call, checks either it's an ajax call or a normal call.

If it's an ajax call, the server sends a json string, containing the instructions for frontal.

So the logic stays on the server. No need to edit any JS file. All the templating is done server side.