var express = require('express')
  , redis = require('redis')
  , redisDb = redis.createClient()
  , restaurants = require('./restaurants')
  , dishRetriever = require('./dishRetriever')
  , async = require('async')
  , app = express()
  ;

app.get('/:campus', function(req, res) {
  var campus = req.params.campus
    , campusRestaurants = restaurants[ campus ]
    ;

  if ( !campusRestaurants ) {
    res.send( 204 );
    return;
  }

  redisDb.get(campus, function(err, result) {
    if ( err || !result ) {
      // get dishes for restaurants at campus
      async.map(campusRestaurants, dishRetriever.getRestaurantDishes, handleResults);
      return;
    }

    res.send( JSON.parse( result ) );
  });

  function handleResults(err, results) {
    if (err) return;

    // cache the result for an hour
    redisDb.setex(campus, 3600, JSON.stringify( results ));

    res.send( results );
  };

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});