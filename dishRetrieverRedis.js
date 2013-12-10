var dishRetriever = require('./dishRetriever')
  , restaurants = require('./restaurants')
  , redis = require('redis')
  , redisDb = redis.createClient()
  , async = require('async')
  ;

exports.getCampusDishes = getCampusDishes;

function getCampusDishes(campus, cb) {

  var handleResults = function(err, results) {
    if (err) {
      cb(err);
      return;
    }
    // cache the result for an hour
    redisDb.setex(campus, 3600, JSON.stringify( results ));

    cb(err, results);
  };

  redisDb.get(campus, function(err, result) {
    if ( err || !result ) {
      var campusRestaurants = restaurants[ campus ];
      // get dishes for restaurants at campus
      async.map(campusRestaurants, dishRetriever.getRestaurantDishes, handleResults);
      return;
    }

    cb(err, JSON.parse( result ));
  });
}

