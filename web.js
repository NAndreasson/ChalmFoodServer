var express = require('express')
  , request = require('request')
  , FeedParser = require('feedparser')
  , app = express()
  ;

var karrestaurang = 'http://cm.lskitchen.se/lskitchen/rss/sv/4'
  , linsen = 'http://cm.lskitchen.se/lskitchen/rss/sv/7'
  ;

app.get('/:place', function(req, res) {
  var restaurants = {
    karen: {
      title: 'Kårrestaurangen',
    },
    linsen: {
      title: 'Linsen',
    }
  };

  getDishes( karrestaurang, function(err, dishes) {
    if (err) {
      console.error(err);
    }
  });

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