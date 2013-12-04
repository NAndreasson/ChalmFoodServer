var express = require('express')
  , restaurants = require('./restaurants')
  , request = require('request')
  , FeedParser = require('feedparser')
  , async = require('async')
  , moment = require('moment')
  , app = express()
  ;


app.get('/:campus', function(req, res) {
  // which campus?
  var campus = req.params.campus;

  // TODO error handling, what if the restaurant dont exist
  var campusRestaurants = restaurants[ campus ];

  // get dishes for restaurants at campus
  async.map(campusRestaurants, getDishes, function(err, results) {
    if (err) {
      return;
    }

    res.send( results );
  });
});

function getDishes(restaurant, cb) {
  var restaurantFeedUrl = buildFeedUrl( restaurant.url )
    , dishes = []
    ;

  request( restaurantFeedUrl ).pipe( new FeedParser() )
      .on('error', function(err) {
        cb(err);
      })
      .on('readable', function() {
        var stream = this
          , item
          , desc
          ;

        while ( item = stream.read() ) {
          desc = item.description;
          // add dish (and remove the @ for price from description)
          dishes.push({ title: item.title, desc: desc.slice( 0, desc.lastIndexOf('@') ) });
        }
      })
      .on('end', function() {
        restaurant.dishes = dishes;
        cb(null, restaurant);
      });
}

function buildFeedUrl(baseUrl) {
  var todaysDate = moment().format('YYYY-MM-DD');

  return baseUrl + todaysDate + '.rss';
}


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});