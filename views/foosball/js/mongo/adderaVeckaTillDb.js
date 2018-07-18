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
  db.collection("stat").find().forEach(function (x) {

    var vecka = x.Datum.getFullYear() + ' - ' + moment(x.Datum, "MM-DD-YYYY").week()
    var månad = x.Datum.getFullYear() + ' - ' + (x.Datum.getMonth()+1)

    query = {
      'Månad' : månad,
      'Vecka' : vecka
    }
    console.log(query)
    db.collection("stat").update({ '_id': x['_id'] }, { $set: query }, function (err, rec) {
      if (err) console.log(err);
      console.log("Uppdaterat: " + rec.result.nModified);
      // });
    });
  });
})
