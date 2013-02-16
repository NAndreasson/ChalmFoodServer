var express = require('express')
  , http = require('http')
  , jsdom = require('jsdom');

var app = express.createServer();

// TODO, remove colon and subdivs, ex price div
// TODO, figure out why its called twice. 
// Return object
var getDishes = function(window, restaurantId) {
  var dishes = [];
  window.$('#' + restaurantId + ' li').each(function() {
      var $li = window.$(this)
        , title = $li.find('span.title')[0].innerHTML
        , desc = $li.find('span.desc')[0].innerHTML;

      dishes.push({
        title: title
      , desc: desc
      });
    });
  return dishes;
};

app.get('/:place', function(request, response) {

  var data = '';
  http.get('http://chalmerskonferens.se/dagens-menyer/johanneberg/', function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      console.log('Called twice?');
      jsdom.env(data, ['http://code.jquery.com/jquery.js'], function(errors, window) {
        var unionRestaurant = getDishes(window, 'K')
          , linsen = getDishes(window, 'L');

        response.send(unionRestaurant);
      });
    });


  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

  // get the webpage, http request and such

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});