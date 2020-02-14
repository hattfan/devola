//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//todo Pågår
var moment = require('moment')
var query = {};
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", (err, client) => {
  var db = client.db("foosball");
  if (err) throw err;
  db.collection("playerTotal").find().forEach(function (x) {

    db.collection("playerTotal").update({ '_id': x['_id'] }, { $rename: {'Förlorade':'Förluster'} }, function (err, rec) {
      if (err) console.log(err);
      console.log("Uppdaterat: " + rec.result.nModified);
      // });
    });
  });
})
