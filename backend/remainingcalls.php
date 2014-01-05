<?php
require_once('TwitterAPIExchange.php');

/* header('Content-Type: application/json'); */

header('Content-Type: application/javascript');

/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
    'oauth_access_token' => "20850958-pB20niE8c2wIJB5kVb54JkxoRAlE7GTPPGZ1UxnX6",
    'oauth_access_token_secret' => "WM6NXUuPG769EFaHRRE5nlWqQoJbucCfp21Mt9Nh2ro",
    'consumer_key' => "8VfPreRXxMFFViyfFFzKTg",
    'consumer_secret' => "l7KE1vDsKmK5EMDnqnpuDXUfReyPJrzilrTLeJCSRg"
);


/* $url = 'https://api.twitter.com/1.1/followers/list.json'; */
$url = 'https://api.twitter.com/1.1/application/rate_limit_status.json';
$getfield = '?resources=search';



$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();  

?>