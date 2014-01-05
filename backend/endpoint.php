<?php
require_once('TwitterAPIExchange.php');
require_once('config.php');
/* header('Content-Type: application/json'); */

header('Content-Type: application/javascript');




/* $url = 'https://api.twitter.com/1.1/followers/list.json'; */
$url = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield = '?q=tobias&include_entities=true';
$getfield = '';

//get through fields

if(!isset($_GET['q'])) {
	exit();
} else {
	$getfield .= '?q=' . urlencode($_GET['q']);
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