//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//* KLAR

var query = {}, viktning;
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb://127.0.0.1:27017",
  (err, client) => {
    var db = client.db("foosball");
    if (err) throw err;
    db.collection("playerTotal").find().forEach(function (x) {
      procent = (x['Vinster']/(x['Vinster']+x['Förlorade']));
      viktning = Math.pow(procent,3) * x['Vinster']
      
      // console.log(x['Spelare'] + ' - ' + viktning )

      db.collection("playerTotal").update({'_id':x['_id']}, {$set: {'Viktning':viktning}}, function (err, rec) {
        if (err) console.log(err);
        console.log("Uppdaterat: " + rec.result.nModified);
      });
      query ={};
      // viktning = 0;
    });
  }
);
