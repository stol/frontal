<?php

// web/index.php

require_once __DIR__.'/../vendor/autoload.php';


require_once __DIR__.'/../vendor/frontal/frontal-jquery.php';

$app = new Silex\Application();


$app['debug'] = true;

$app->get('/', function (){
	return get_include_contents("../views/index.php");
});


/**
 * Adds a <ul> list item after the title of the first box
 * and removes the action button
 */
$app->get('/samples/1', function () use ($app){

 	return $app->json(
 		Frontal::getInstance()
			->query('.sample-box-1 h2')
			->after("<ul><li>This list</li><li>could/should be</li><li>in a template file</li></ul>")
			->next()->next()
			->remove()
			->end()
	);
});




// definitions

$app->run();

// Minimal tpl include function
function get_include_contents($filename) {
 	if (is_file($filename)) {
		ob_start();
		include $filename;
		return ob_get_clean();
	}
	return false;
}