var moment = require('moment')
var query = {};
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/foosball"
//mongodb://127.0.0.1:27017

MongoClient.connect(url, (err, client) => {
  var db = client.db("foosball");
  if (err) throw err;
  db.collection("stat").find().forEach(function (x) {

    db.collection("statBKUP20180718").insert(x, function (err, rec) {
      if (err) console.log(err);
    //   console.log("Uppdaterat: " + rec.result.nModified);
        console.log('yes')
    });
  });
});

