frontal.js
=======

Control your javascript interactions from the server.

Your frontend application logic is handled server side.

## Frontal VS Traditionnal way comparison

### Traditional way : ajax controller is frontend (example with jquery)

```html
<!--
  -- REPEAT CODE BELOW FOR EVERY AJAX ACTION OF THE SITE… SIGH !
  -->
<a href="#" class="some-link">Display a list bellow</a>
<script>
$(".link").on("click", function(e){
    var $link = $(this);
    
    // No default action
    e.preventDefault(); 
    
    // Is the link already loading ?
    if( $(this).is(".loading") ){
		alert("Ajax request is already launched !")
		return;
	}
	// Add loading state
	$link.addClass("loading").text("Loading…");
    $.ajax({
        url: "/some-url.php",
    }).done(function(response) {
    	// Response error ? Revert to initial state
    	if (response.error){
    		alert("An error occured while loading list");
			$link.removeClass("loading").text("Display a list below");
    		return;
    	}
    	// Else, build HTML with data retrieved
    	var ul = '<ul>';    
    	for(var i=0; i<response.length; i++){
    		ul+= '<li>List item :'+response[i]+'</li>';
    	}
    	ul+= '</ul>';
    	
    	// Insert it after the link
    	$link.after("<ul>");
    
    	// remove the loading link
        $link.replaceWith("<span>List loaded below :</span>");
    });
});
</script>
```

### Frontal way (with jQuery PHP adapter)

```html
<a href="/some-url.php" class="some-link" data-f-ajaxify="1">Display a list bellow</a>
```

And pseudo code, server side

```php
function someControllerAction()
{
    // Main content of the page
    $renderedHtml = render('/some-view.tpl');

    // If ajax, add content after the link, and remove the link 
    if ($request->isAjax(){
        // Call to a php wrapper, generating json instructions
        Frontal::getInstance()
            ->query(".some-link")
            ->after($renderedHtml)
            ->remove()
        ->send(); // => Does exit
    }
    
    // Otherwise, render the page normally
    $layout->set('content', $renderedHtml);
    $layout->render();
}
```


Voilà !

The server, when receiving a call, checks either it's an ajax call or a normal call.

If it's an ajax call, the server sends a json string, containing the instructions for frontal.

So the logic stays on the server. No need to edit any JS file. All the templating is done server side.

## Installation

via bower : 

    $ bower install frontal

via git :

    $ git clone https://github.com/Stol/frontal
    
## Inspiration

frontal.js was inspired by facebook "primer", detailed in a [frontend talk in 2010](https://www.facebook.com/video/video.php?v=596368660334).

Recently, 37signals made a blog post of [Server-generated JavaScript Responses](http://37signals.com/svn/posts/3697-server-generated-javascript-responses) similar to frontal.js

I used frontal.js for several years in various projects. It did remove many javascript code, unified templates, and is declarative, as it's commonly approved thoses days.

## How it works

### Setup

###### jQuery

```html
<script src="frontal.jquery.js"></script>
<script>frontal.listens();</script>
```

```js
```

###### ES6

```js
import { frontal } from 'frontal';

# OR

const frontal = require('frontal');

frontal.listen();
```

### Click

When clicking on any element, frontal is triggered IF data-f-ajaxify is present.

If the element clicked is a link, it sends an ajax request to the url specified in href attribute, or to the url specified in the data-f-href attribute (if present).

If the element clicked is a [type=submit] button/input inside a form with data-f-ajaxify, the button is cloned as an hidden field, the click event canceled so the submit event can happen.

### Submit

When submiting a form, if it has the class ``data-f-ajaxify``, the form is sent via an ajax request

### Hover

When clicking en element, if it's a submit input/button, 

### Attributes API (namespaced with "data-f-xxx)

<table>
    <tr><th>Attribute</th><th>Value</th><th>Description</th></tr>
    <tr><td>data-f-ajaxify</td><td>1|0</td><td>Triggers frontal for the tag</td></tr>
    <tr><td>data-f-href</td><td>url</td><td>Forces the url for the ajax request</td></tr>
    <tr><td>data-f-hover</td><td>1|0</td><td>Triggers the ajax call on hover</td></tr>
    <tr><td>data-f-loading</td><td>spinner|selector</td><td>spinner: adds a spinner to the page<br/>selector: adds class js-loading to the element(s) matching the css selector</td></tr>
    <tr><td>data-f-uniq</td><td>1|0</td><td>Frontal will only run once</td></tr>
    <tr><td>data-f-confirm</td><td>string</td><td>Display a confirm alertbox before sending the request</td></tr>
    <tr><td>data-f-stop</td><td>1|0</td><td>Stops Triggers frontal for the tag</td></tr>
    <tr><td>data-f-toggle</td><td>1|0</td><td>Can't remember :p</td></tr>
    <tr><td>data-f-method</td><td>post|get</td><td>Forces the request method</td></tr>
    <tr><td>data-f-register</td><td>[url]</td><td>[url] will be ajaxified once frontal.listen() is called</td></tr>
</table>

### Examples


**Sending a form :**

- ajax via frontal, if `enter` is pressed, or "Send ajax" is clicked
- non-ajax if "Send normal" is clicked

```html
<form action="/action.php" method="post" data-f-ajaxify="1">
    <input type="text" name="name" placeholder="Type your name"/>
    <!-- Will trigger frontal -->
    <button type="submit">Send ajax</button>
    <!--Will send normally, because of data-f-stop="1" -->
    <button type="submit" data-f-stop="1">Send normal</button>
</form>
```

**Sending a form with an alert**

```html
<form action="/action.php" method="post" data-f-ajaxify="1" data-f-confirm="Are you sure ?">
    <button type="submit">Delete</button>
</form>
```

**Hovering, only once, with force url**

```html
<a href="/user/42" data-f-ajaxify="1" data-f-hover="1" data-f-uniq="1" data-f-href="/user/42/card">User 42 (hover for more info)</a>
```

### Full examples 

Clone this repository, then navigate to /frontal/web/

### ROADMAP

* Create a native frontend core
* Create a jQuery adapter (front & back)
* Improve doc
* Make tests

### Changelog
1.0.0: add native version
0.6.4: contentchange event now send element triggered
0.6.3: ajaxify() > return deferred
0.6 : added data-f-register

-------
frontal.js is licensed under the [MIT license](http://opensource.org/licenses/MIT).
