var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var url = process.env.URL_SHORT_MONGOLAB_URI



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
