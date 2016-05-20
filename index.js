var mongodb = require('mongodb');
var express = require('express')
var MongoClient = mongodb.MongoClient;
var url = process.env.URL_SHORT_MONGOLAB_URI

var app = express()

app.set('port', (process.env.PORT || 5000))

app.get('/', function(request, response) {
  response.send('App is running')
})

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port ', app.get('port'))
})
