//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//* KLAR
var query = {};
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb://127.0.0.1:27017",
  (err, client) => {
    var db = client.db("padel");
    if (err) throw err;
    db.collection("stat").find().forEach(function (x) {

      var datum = new Date(x['Tidstämpel']);

      // console.log(datum)
      db.collection("stat").update({'_id':x['_id']}, {$set: {'Datum':datum}}, function (err, rec) {
        if (err) console.log(err);
        console.log("Uppdaterat: " + rec.result.nModified);
      });
    });
  }
);
