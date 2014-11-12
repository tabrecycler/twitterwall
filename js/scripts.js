$(document).ready(function() {
    var TWITTERWALL = {
        main_page: {
            // main page
            _init: function () {
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
                        var selector = ".highlight";
                        var rule = "{color: "+randomColor+"}";

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
                    tweetCode += '<p class="username" ">'+tweet.user.name+' <span class="realusername">@'+ tweet.user.screen_name +'</span></p>';
                    tweetCode += '<p class="text">'+ addInformation(tweet)+'</p>';

                    //check for image
                    if(tweet.entities.media !== undefined) {
                        tweetCode += '<img src="'+tweet.entities.media[0].media_url_https+'">';

                        // URL des Bildes entfernen
                        tweetCode = tweetCode.replace(tweet.entities.media[0].url, '');

                    }
                    tweetCode += '</div>';

                    $('.holdsresponse').prepend(tweetCode);
                }

                function addInformation(mytweet) {
                    var offset = 0;
                    var theText = mytweet.text;
                    for (var i = 0; i < mytweet.entities.hashtags.length; i++) {
                        var begin = mytweet.entities.hashtags[i].indices[0] + offset;
                        offset += replaceBefore.length;

                        var end = mytweet.entities.hashtags[i].indices[1] + offset;
                        offset += replaceAfter.length;

                        theText = [theText.slice(0, begin), replaceBefore , theText.slice(begin)].join('');
                        theText = [theText.slice(0, end), replaceAfter , theText.slice(end)].join('');
                    }
                    return theText;
                }

                function setSearch(keyword) {
                    $('title').html('TwitterWall - ' + keyword);
                    refresh_url = '?callback=1&include_entities=true&q=' + encodeURIComponent(keyword);
                    $('.holdsresponse').html('');
                    newColor();
                    performSearch(keyword);
                }

                function performSearch(keyword) {
                    searchCounter++;
                    if((searchCounter % 3) === 0) {
                        newColor();
                        getRemainingCalls();
                        searchCounter = 0;
                    }
                    var url = 'backend/endpoint.php' + refresh_url;

                    var jqxhr = $.getJSON( url, function() {})
                        .done(function( data ) {
                            processResponse(data, keyword);
                        })
                        .fail(function() {
                            alert("Fehler!");
                        });
                }


                function processResponse(data, thisKeyword) {
                    refresh_url = data.search_metadata.refresh_url + '&callback=1';
                    var counter = data.statuses.length;

                    if(counter > 0) {
                        //no animation for existing tweets
                        $('.tweet').removeClass('slideinanimation');
                        for (i = counter - 1; i >= 0; i--) {
                            var tweet = data.statuses[i];
                            createSpace();
                            addTweet(tweet);
                        }
                    }
                    if(thisKeyword == currentKeyword) {
                        setTimeout(function(){performSearch(thisKeyword);}, 10000);
                    }

                }

                function createSpace() {
                    //deletes last tweet
                    for(var i = $('.tweet').length; i >= maximumTweetsToShow; i-- ) {
                        $('.tweet:last-child').remove();
                    }

                }

                function getRemainingCalls() {
                    var remainingCallsUrl = 'backend/remainingcalls.php';
                    $.getJSON(remainingCallsUrl, function(data) {
                        var remaining = data.resources.search["/search/tweets"].remaining;
                        var limit = data.resources.search["/search/tweets"].limit;

                        //all calls used?
                        if(remaining === 0) {
                            alert("Calls are empty. Please wait.");
                        }
                    });
                }


                newColor();
                $('#searchinput').change(function(){
                    currentKeyword = $('#searchinput').val();
                    setSearch($('#searchinput').val());
                });

                $(document).keyup(function(e) {
                    //c pressed
                    if (e.keyCode == 67) {
                        newColor();
                        searchCounter = 0;

                    }
                });
            }
        },
        _start: function () {
            // Aufrufen der _init Funktion der bestimmten Seite
            this[PAGE_TYPE]._init();

            // Durch Widgets gehen und deren _init Funktion ausführen
            $('[data-widget]').each(function(values){
                TWITTERWALL[$(this).data('widget')]._init();
            });
        }
    };

    // Seite starten
    TWITTERWALL._start();
});
