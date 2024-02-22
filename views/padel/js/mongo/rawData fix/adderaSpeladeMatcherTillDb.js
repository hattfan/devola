//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//todo Pågår
var moment = require('moment')
var query = {}, totalt, procent;
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", (err, client) => {
  var db = client.db("padel");
  if (err) throw err;
  db.collection("playerTotal").find().forEach(function (x) {

    // totalt = x["Vinster"] + x["Förlorade"];
    procent = x["Vinster"] / (x["Förlorade"]+x["Vinster"]);
    query = { 'Procent': procent}
    db.collection("playerTotal").update({ '_id': x['_id'] }, { $set: query }, function (err, rec) {
      if (err) console.log(err);
      console.log("Uppdaterat: " + rec.result.nModified);
      // });
    });
  });
})
