var mongodb = require('mongodb');
var express = require('express')
var http = require('http')
var mongo = mongodb.MongoClient;
var url = process.env.URL_SHORT_MONGOLAB_URI.replace(/[ ]/,"")
var re = /^[a-z0-9\-]+[.]\w+/i // tests for valid url

var app = express()

app.set('port', (process.env.PORT || 5000))

app.get('/', function(request, response) {
  response.send('App is running')
})

app.get('/:SHORT', function(request, response) {
  //check if SHORT is in the DB
  var short = request.params.SHORT
  if (isNaN(short)) {
    console.log('Waiting...')
  } else {
    var short_http = 'http://hidden-plains-19155.herokuapp.com/' + short
    var short_https = 'https://hidden-plains-19155.herokuapp.com/' + short
    mongo.connect(url, function(err, db) {
      if (err) console.log('Unable to connect to mongoDB')
      console.log('Connection established to database')
      var urls = db.collection('urls')
      urls.find({
        short_url: { $in: [short_http, short_https]}
      }).toArray(function(err, document) {
        if (err) console.log('Error: something whent wrong when looking up the short_url')
        if (document && document.length === 1) {
          var redirect = document[0].orig_url
          console.log("Redirecting to " + redirect)
        } else {
          console.log("Short URL does not exist")
        }
        db.close()
        console.log('Connection to database has been closed')
      })
    })
  }
  //if SHORT in DB redirect to orig_url
  //if SHORT not in DB, return to / page with an error message
})

app.get('/new/http://:URL', function(request, response) {
  if (!request.params.URL.match(re)) {
    response.send({'error': 'Invalid url'})
  } else {
    var orig_url = 'http://' + request.params.URL
    //var url_object = {'original_url': orig_url}
    //console.log(url_object)
    //lookupURL(orig_url)
    mongo.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to database');
        // do some work here with the database.
        var urls = db.collection('urls')
        var numberOfURLS = 0
        urls.count({}, function(err, count) {
          if (err) console.log("Error: count failed -- ")
          numberOfURLS = count
        })
        urls.find({
          orig_url: orig_url
        }).toArray(function(err, document) {
          if (err) {
            console.log('Error: something went wrong during urls.find event')
          } else if (document.length === 0) {
            var short_url = 'http://hidden-plains-19155.herokuapp.com/' + parseInt(numberOfURLS + 1)
            var url_object = {'orig_url': orig_url, 'short_url': short_url}
            urls.insert(url_object, function() {
                var newUrlObject = {'orig_url': orig_url, 'short_url': short_url}
                response.send(newUrlObject)
                console.log(JSON.stringify(url_object) + ' has been successfully added to the database')
              }
            )
          } else if (document.length === 1) {
            // return orig_url and short_url object
            var url_object = {'orig_url': document[0].orig_url, 'short_url': document[0].short_url}
            response.send(url_object)
          }
          db.close()
          console.log('Connection to database has been closed')
        })
      }
    }
  )}
  }
)

app.get('/new/https://:URL', function(request, response) {
  if (!request.params.URL.match(re)) {
    response.send({'error': 'Invalid url'})
  } else {
    var orig_url = 'https://' + request.params.URL
    //var url_object = {'original_url': orig_url}
    //console.log(url_object)
    //lookupURL(orig_url)
    mongo.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to database');
        // do some work here with the database.
        var urls = db.collection('urls')
        var numberOfURLS = 0
        urls.count({}, function(err, count) {
          if (err) console.log("Error: count failed -- ")
          numberOfURLS = count
        })
        urls.find({
          orig_url: orig_url
        }).toArray(function(err, document) {
          if (err) {
            console.log('Error: something went wrong during urls.find event')
          } else if (document.length === 0) {
            var short_url = 'https://hidden-plains-19155.herokuapp.com/' + parseInt(numberOfURLS + 1)
            var url_object = {'orig_url': orig_url, 'short_url': short_url}
            urls.insert(url_object, function() {
                var newUrlObject = {'orig_url': orig_url, 'short_url': short_url}
                response.send(newUrlObject)
                console.log(JSON.stringify(url_object) + ' has been successfully added to the database')
              }
            )
          } else if (document.length === 1) {
            // return orig_url and short_url object
            var url_object = {'orig_url': document[0].orig_url, 'short_url': document[0].short_url}
            response.send(url_object)
          }
          db.close()
          console.log('Connection to database has been closed')
        })
      }
    }
  )}
  }
)

app.listen(app.get('port'), function() {
  console.log('Node app is running on port ', app.get('port'))
})
