var request = require('request')
  , FeedParser = require('feedparser')
  , moment = require('moment')
  ;


exports.getRestaurantDishes = getRestaurantDishes;

function getRestaurantDishes(restaurant, cb) {
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
