var express = require('express')
  , restaurants = require('./restaurants')
  , request = require('request')
  , FeedParser = require('feedparser')
  , app = express()
  ;


app.get('/:place', function(req, res) {
  var restaurant
    ;

  for (restaurant in restaurants) {
    restaurant.hej = 'Bujkas';
    console.log('restaurant', restaurant);
  }
  console.log('Restaurants', restaurants);
  // restaurants.forEach(function(restaurant) {
  //   restaurantObj[ restaurant.title ] = restaurant.title;
  // });


  // console.log('Restaurants', restaurantObj);
  // getDishes( karrestaurang, function(err, dishes) {
  //   if (err) {
  //     console.error(err);
  //   }
  //   console.log('Dishes', dishes);
  // });

});

function getDishes(url, cb) {
  var dishes = [];

  request( url ).pipe( new FeedParser() )
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
        cb(null, dishes);
      });
}

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});