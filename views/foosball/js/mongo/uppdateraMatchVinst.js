//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//todo Ofärdig
var query = {};
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb://127.0.0.1:27017",
  (err, client) => {
    var db = client.db("foosball");
    if (err) throw err;
    db.collection("stat").find().forEach(function (x) {
      console.log(x._id);
      
      if (x.Lag1 > x.Lag2) {
        query = {
          Lag1Matchvinst:1,
          Lag2Matchvinst:0
        }
      } 
      else if(x.Lag1 < x.Lag2) {
        query = {
          Lag1Matchvinst:0,
          Lag2Matchvinst:1
        }
      }
      
      db.collection("stat").update({'_id':x['_id']}, {$set: query}, function (err, rec) {
        if (err) console.log(err);
        console.log("Uppdaterat: " + rec.result.nModified);
      });
      query ={};
    });
  }
);
