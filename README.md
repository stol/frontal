frontal.js
=======

Control your javascript interactions from the server.

Your frontend application logic is handled server side.


### Compared to traditionnal ajax handling

**Traditional ajax (using jQuery) to load a list after a link :**

*(To be repeated for each ajax load link on the site)*

```
<!-- REPEAT CODE BELOW FOR EVERY AJAX ACTION OF THE SITE… GOSH -->
<a href="#" class="link">Display a list bellow</a>
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
        url: "/getlist.php",
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


### Examples

Clone this repository, then navigate to /frontal/web/

### Basic use

The following link should work without JS. But with frontal.js and the appropriate server response, ajax magic should happend !

```html
<a class="some-link" href="/some-url.php" data-p-ajaxify="1">Show me the data</a>
```

And pseudo code, server side

```php
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
```

Voilà !

The server, when receiving a call, checks either it's an ajax call or a normal call.

If it's an ajax call, the server sends a json string, containing the instructions for frontal.

So the logic stays on the server. No need to edit any JS file. All the templating is done server side.

How it works
------- 

### Click

When clicking on any element, frontal is triggered IF data-p-ajaxify is present.

If the element clicked is a link, it sends an ajax request to the url specified in href attribute, or to the url specified in the data-p-href attribute (if present).

If the element clicked is a [type=submit] button/input inside a form with data-p-ajaxify, the button is cloned as an hidden field, the click event canceled so the submit event can happen.

### Submit

When submiting a form, if is has the class data-p-ajaxify, the form is sent via an ajax request

### Hover

When clicking en element, if it's a submit input/button, 

Attributes API
------- 

<table>
    <tr><th>Attribute</th><th>Value</th><th>Description</th></tr>
    <tr><td>data-p-ajaxify</td><td>1|0</td><td>Triggers frontal for the tag</td></tr>
    <tr><td>data-p-href</td><td>url</td><td>Forces the url for the ajax request</td></tr>
    <tr><td>data-p-hover</td><td>1|0</td><td>Triggers the ajax call on hover</td></tr>
    <tr><td>data-p-loading</td><td>spinner|selector</td><td>spinner: adds a spinner to the page<br/>selector: adds class js-loading to the element(s) matching the css selector</td></tr>
    <tr><td>data-p-uniq</td><td>1|0</td><td>Frontal will only run once</td></tr>
    <tr><td>data-p-confirm</td><td>string</td><td>Display a confirm alertbox before sending the request</td></tr>
    <tr><td>data-p-stop</td><td>1|0</td><td>Stops Triggers frontal for the tag</td></tr>
    <tr><td>data-p-toggle</td><td>1|0</td><td>Can't remember :p</td></tr>
    <tr><td>data-p-method</td><td>post|get</td><td>Forces the request method</td></tr>
</table>

Examples
------- 

**Sending a form :**

- ajax via frontal, if `enter` is pressed, or "Send ajax" is clicked
- non-ajax if "Send normal" is clicked

```html
<form action="/action.php" method="post" data-p-ajaxify="1">
    <input type="text" name="name" placeholder="Type your name"/>
    <!-- Will trigger frontal -->
    <button type="submit">Send ajax</button>
    <!--Will send normally, because of data-p-stop="1" -->
    <button type="submit" data-p-stop="1">Send normal</button>
</form>
```

**Sending a form with an alert**
```html
<form action="/action.php" method="post" data-p-ajaxify="1" data-p-confirm="Are you sure ?">
    <button type="submit">Delete</button>
</form>
```

**Hovering, only once, with force url**
```html
<a href="/user/42" data-p-ajaxify="1" data-p-hover="1" data-p-uniq="1" data-p-href="/user/42/card">User 42 (hover for more info)</a>
```
### TODO

* Create a native core
* Create a jquery adapter
* Create a native adapter


------- 
License
Unveil is licensed under the [MIT license](http://opensource.org/licenses/MIT). 