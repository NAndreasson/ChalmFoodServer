var express = require('express')
  , restaurants = require('./restaurants')
  , request = require('request')
  , FeedParser = require('feedparser')
  , app = express()
  ;


app.get('/:campus', function(req, res) {
  var campus = req.params.campus
    , campusRestaurants = restaurants[ campus ]
    , nrRestaurants = Object.keys( campusRestaurants ).length
    , cbFinished = 0
    , restaurantKey
    , restaurant
    ;

  for (restaurantKey in campusRestaurants) {
    restaurant = campusRestaurants[ restaurantKey ];

    getDishes(restaurant, function(err, restaurant) {
      if ( err ) console.error( err );

      cbFinished++;

      if (cbFinished === nrRestaurants ) {
        res.send( campusRestaurants );
      }

    });
  }
});

function getDishes(restaurant, cb) {
  var dishes = []
    ;

  request( restaurant.url ).pipe( new FeedParser() )
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

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});