var express = require('express')
  , restaurants = require('./restaurants')
  , dishRetriever = require('./dishRetriever')
  , async = require('async')
  , app = express()
  ;


app.get('/:campus', function(req, res) {
  var campus = req.params.campus;

  var campusRestaurants = restaurants[ campus ];

  if ( !campusRestaurants ) {
    res.send( 204 );
    return;
  }

  // get dishes for restaurants at campus
  async.map(campusRestaurants, dishRetriever.getDishes, function(err, results) {
    if (err) {
      return;
    }

    res.send( results );
  });
});



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});