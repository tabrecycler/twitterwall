<?php
require_once('TwitterAPIExchange.php');

/* header('Content-Type: application/json'); */

header('Content-Type: application/javascript');

/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
    'oauth_access_token' => "YOUR_CODE",
    'oauth_access_token_secret' => "YOUR_CODE",
    'consumer_key' => "YOUR_CODE",
    'consumer_secret' => "YOUR_CODE"
);


/* $url = 'https://api.twitter.com/1.1/followers/list.json'; */
$url = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield = '?q=tobias&include_entities=true';
$getfield = '';

//get through fields

if(!isset($_GET['q'])) {
	exit();
} else {
	$getfield .= '?q=' . $_GET['q'];
}

if(isset($_GET['since_id'])) {
	$getfield .= '&since_id=' . $_GET['since_id'];
}

if(isset($_GET['include_entities'])) {
	$getfield .= '&include_entities=' . $_GET['include_entities'];
}


$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();  

?>