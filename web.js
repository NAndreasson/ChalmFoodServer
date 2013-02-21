var express = require('express')
  , http = require('http')
  , jsdom = require('jsdom');

var app = express.createServer();

var getDishes = function(window, restaurantId) {
  var dishes = [];
  window.$('#' + restaurantId + ' li:not(#notitle)').each(function() {
      var $li = window.$(this)
        , title = $li.find('span.title')[0].innerHTML
        , desc = $li.find('span.desc')[0].innerHTML.replace(/@(\d+)?$/, '');

      dishes.push({
        title: title
      , desc: desc
      });
    });

    window.$('#' + restaurantId + ' li#notitle').each(function() {
      var $li = window.$(this)
        , title = ''
        , desc = $li.find('span.desc')[0].innerHTML.replace(/@(\d+)?$/, '');

      dishes.push({
        title: title
      , desc: desc
      });
    });

  return dishes;
};

app.get('/:place', function(request, response) {
  console.log('Request');
  var data = '';
  http.get('http://chalmerskonferens.se/dagens-menyer/johanneberg/', function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      jsdom.env(data, ['http://code.jquery.com/jquery.js'], function(errors, window) {
        var unionRestaurant = getDishes(window, 'K')
          , linsen = getDishes(window, 'Li');

        var restaurants = {
          karen: {
             title: 'Kårrestaurangen'
           , dishes: unionRestaurant
          } 
        , linsen: {
             title: 'Linsen'
           , dishes: linsen
          }
        };

        response.send(restaurants);
      });
    });

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});