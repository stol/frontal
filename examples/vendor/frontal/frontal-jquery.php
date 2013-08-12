<?php
/**
 * Communicates withs frontal.js, using jquery
 * ex : 
 *
 * Frontal::getInstance()
 *     ->query("$id .bt-follow")
 *         ->toggleClass("followed")
 *     ->find("span")
 *         ->toggleClass("hidden")
 *     ->query(".u-{$user_id} .tooltip")
 *         ->remove()
 *     ->query("$id")
 *         ->append($content)
 *         ->tooltip(".u-{$user_id} .tooltip")
 *     ->query(".u-{$user_id} .tooltip")
 *         ->fadeIn(".u-{$user_id} .tooltip")
 *         ->delay(3000)
 *         ->fadeOut(".u-{$user_id} .tooltip")
 *     ->send();
 */

class Frontal
{
    private static $instance = null;
    private static $actions = array();
    private static $selector = null;

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new Frontal;
        }

        return self::$instance;
    }

    public function query($selector = null)
    {
        self::$selector = $selector;
        return self::$instance;
    }


    public function end($success = true)
    {
        return array(
            "success" => $success,
            "actions" => self::$actions
        );
    }

    public function send($success = true)
    {

        if (!headers_sent()) {
            header('Pragma: no-cache');
            header('Cache-Control: no-cache, must-revalidate');
            header('Content-Type: application/json; charset=UTF-8');
        }

        echo json_encode($this->end($success));
        self::clean();
    }


    private static function clean()
    {
        self::$actions = array();
        self::$instance = null;
    }

    public function __call($name, $args)
    {
        self::$actions[] = array(
            'selector' => self::$selector,
            'method'   => $name,
            'args'     => $args
        );

        self::$selector = null;

        return $this;
    }
}
