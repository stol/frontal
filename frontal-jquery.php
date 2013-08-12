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
 *     ->after()
 *          ->remove()
 *     ->send();
 *
 * ex : 
 */

class Frontal
{
    private static $instance = null;   // The instance
    private static $actions = array(); // An array of actions
    private static $selector = null;   // Current selector

    /**
     * Returns the current instance
     */
    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new Frontal;
        }

        return self::$instance;
    }

    /**
     * Sets the current selector
     */ 
    public function query($selector = null)
    {
        self::$selector = $selector;
        return self::$instance;
    }

    /**
     * Adds an action to the list
     */ 
    public function __call($name, $args)
    {
        self::$actions[] = array(
            // the action is bound to the current selector.
            // If the selector is null, the action will be bound to the previous selector
            'selector' => self::$selector, 
            'method'   => $name,
            'args'     => $args
        );

        // Sets the selector for the next action to null, so the next action can stay bound to the current selector
        self::$selector = null;

        return $this;
    }

    /**
     * Returns the current pile of actions, as an array of actions
     */
    public function toArray($success = true)
    {
        return array(
            "success" => $success,
            "actions" => self::$actions
        );
    }

    /**
     * Echos the current pile of actions, as a json encoded string
     */ 
    public function send($success = true)
    {

        if (!headers_sent()) {
            header('Pragma: no-cache');
            header('Cache-Control: no-cache, must-revalidate');
            header('Content-Type: application/json; charset=UTF-8');
        }

        echo json_encode($this->toArray($success));
    }

    /**
     * Re-init the instance
     */
    private static function clean()
    {
        self::$actions = array();
        self::$instance = null;
        self::$selector = null;
    }

}
