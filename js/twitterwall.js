// DONT CHANGE THESE
var refresh_url = '';
currentKeyword = '';
var Monat = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");
var mydate;
var searchCounter = 0;
var replaceBefore = '<span class="highlight">';
var replaceAfter = '</span>';

// YOU MAY CHANGE THESE
var maximumTweetsToShow = 15;
var colors = ['#DC4FAD','#AC193D','#D24726','#FF8F32','#82BA00','#008A17','#03B3B2','#008299','#5DB2FF','#0072C6','#4617B4','#8C0095','#004B8B','#001940','#585858','#000000' ];


function newColor() {
	var randomColor = colors[Math.floor(Math.random()*colors.length)];
	$('body').css('background-color', randomColor);
	$('#searchinput').css('background-color', randomColor);
	$('#searchinput').css('border-color', randomColor);
	
	try {
        var stylesheet = document.styleSheets[0];
        selector = ".highlight", rule = "{color: "+randomColor+"}";
    
        if (stylesheet.insertRule) {
            stylesheet.insertRule(selector + rule, stylesheet.cssRules.length);
        } else if (stylesheet.addRule) {
            stylesheet.addRule(selector, rule, -1);
        }
    } catch (e) {}
	
}

function processTime(time) {
	mydate = new Date(time);
	return mydate.getDate() + '. ' + Monat[mydate.getMonth()] + ' ' + (mydate.getYear()+1900)  + ' ' + mydate.getHours() + ':' + mydate.getMinutes() + ':' + mydate.getSeconds() + 'Uhr';
}

function addTweet(tweet) {
	tweetCode = '';
	tweetCode += '<div title="'+processTime(tweet.created_at)+'" class="tweet slideinanimation">';
    tweetCode += '<p class="username" ">'+tweet.from_user_name+' <span class="realusername">@'+ tweet.from_user +'</span></p>'
    tweetCode += '<p class="text">'+ addInformation(tweet)+'</p>';
    tweetCode += '</div>';
	
	$('.holdsresponse').prepend(tweetCode);
}

function addInformation(mytweet) {
	var offset = 0;
	var theText = mytweet.text;
	for (var i = 0; i < mytweet['entities']['hashtags']['length']; i++) {
        var begin = mytweet['entities']['hashtags'][i]['indices'][0] + offset;
        offset += replaceBefore.length;
        
        var end = mytweet['entities']['hashtags'][i]['indices'][1] + offset;
        offset += replaceAfter.length;
        
        theText = [theText.slice(0, begin), replaceBefore , theText.slice(begin)].join('');
        theText = [theText.slice(0, end), replaceAfter , theText.slice(end)].join('');
    }
	
	return theText;
}

function setSearch(keyword) {
	$('title').html('TwitterWall - ' + keyword);
    refresh_url = '?callback=?&include_entities=true&q=' + escape(keyword);
    $('.holdsresponse').html('');
    newColor();
    performSearch(keyword);
}

function performSearch(keyword) {
	searchCounter++;
	if((searchCounter % 3) == 0) {
		newColor();
		searchCounter = 0;
	}
    var url = 'https://search.twitter.com/search.json' + refresh_url;
    $.getJSON(url, function(data) {
        processResponse(data, keyword);
    });
}


function processResponse(data, thisKeyword) {  
    refresh_url = data.refresh_url + '&callback=?';
    var counter = data.results.length;
    if(counter > 0) {
        //no animation for existing tweets
        $('.tweet').removeClass('slideinanimation');
        for (i=0; i < data.results.length; i++) {
            var tweet = data.results[i];
            createSpace();

            //console.log(tweet);
            addTweet(tweet);
        }
    }
    if(thisKeyword == currentKeyword) {
    	functionString = 'performSearch("' + thisKeyword + '")';
	    setTimeout(functionString, 10000);
    }
    
}

function createSpace() {
    //deletes last tweet
    for(var i = $('.tweet').length; i >= maximumTweetsToShow; i-- ) {
        $('.tweet:last-child').remove();
    }
    
}

$(document).ready(function() {
	newColor();
  	$('#searchinput').change(function(){ 
  		currentKeyword = $('#searchinput').val();
	  	setSearch($('#searchinput').val());
	});
});


    

  

