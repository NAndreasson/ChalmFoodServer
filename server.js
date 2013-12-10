var express = require('express')
  , restaurants = require('./restaurants')
  , dishRetriever = require('./dishRetrieverRedis')
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

  dishRetriever.getCampusDishes(campus, function(err, results) {
    if (err) {
      res.send( 503 ); // service unavailable, maybe not the best one aye?
      return;
    }

    res.send( results );
  });

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});