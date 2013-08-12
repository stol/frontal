<?php

// web/index.php
use Symfony\Component\HttpFoundation\Request;
require_once __DIR__.'/../vendor/autoload.php';


require_once __DIR__.'/../vendor/frontal/frontal-jquery.php';

$app = new Silex\Application();

$app->get('/', function (){
	$content = get_include_contents("../views/pages/index.php");
	return get_include_contents("../views/layout.php", array(
		"content" => $content
	));
});


/**
 * Adds a <ul> list item after the title of the first box
 * and removes the action button
 */
$app->get('/samples/1', function () use ($app) {

	// Could be a template file
	$content = "<ul><li>This list</li><li>could/should be</li><li>in a template file</li></ul>";

	// Replaces the button with the item list
	$response = Frontal::getInstance()
		->query('.sample-box-1 .btn')
		->replaceWith($content)
		->toArray();

 	return $app->json($response);
});


/**
 * Displays more and more items in the second box. Stops after page 3.
 * Detects if the request is Ajax, then handles the response using frontal.
 * If non-ajax, the response is the full page
 */
$app->get('/samples/2', function (Request $request) use ($app) {

	// 1/ Check the url params
	$page = abs((int) $request->query->get('page'));
	$page = $page ? $page : 1;

	// 2/ Fill the template
	$content = get_include_contents("../views/pages/sample2.php", array(
		'page' => $page
	));

	// 3/ Non-ajax request ? Fill the content (we also could redirect)
	if( !isAjax()){
		return get_include_contents("../views/layout.php", array(
			"content" => $content
		));
	}

	// 4/ Ajax request ? Adds the items to the existing list, using frontal
	$response = Frontal::getInstance()
		->query('.sample-box-2 .sample-read-more')
			->remove()
		->query('.sample-box-2 ul')->last()
		->after($content);

 	return $app->json($response->toArray());

});


/**
 * Just waits 5 seconds, before answering (to test loading feature)
 */
$app->get('/samples/3', function () use ($app) {
	if (!isAjax()){
		return $app->redirect('/');
	}
	sleep(5);
 	return $app->json(Frontal::getInstance()->toArray());
});

// definitions

$app->run();

// Minimal tpl include function
function get_include_contents($filename, $vars = array()) {
	extract($vars);
 	if (is_file($filename)) {
		ob_start();
		include $filename;
		return ob_get_clean();
	}
	return false;
}

function isAjax(){
	if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
		return true;
	if (isset($_GET['__ajax__']))
		return true;
	return false;
}

}