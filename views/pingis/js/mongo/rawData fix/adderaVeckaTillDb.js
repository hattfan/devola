//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//todo Pågår
var moment = require('moment')
var query = {};
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/foosball"
//mongodb://127.0.0.1:27017

MongoClient.connect(url, (err, client) => {
  var db = client.db("foosball");
  if (err) throw err;
  db.collection("stat").find().forEach(function (x) {

    var månad = x.Datum.getFullYear() + ' - ' + (x.Datum.getMonth() + 1)
    var vecka = moment(x.Datum, "MM-DD-YYYY").week()
    moment(x.Datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
    vecka = x.Datum.getFullYear() + ' - ' + vecka
    // console.log(vecka)


    query = {
      'Månad': månad,
      'Vecka': vecka
    }
    // console.log(query)
    db.collection("stat").update({ '_id': x['_id'] }, { $set: query }, function (err, rec) {
      if (err) console.log(err);
      console.log("Uppdaterat: " + rec.result.nModified);
    });
  });
});

