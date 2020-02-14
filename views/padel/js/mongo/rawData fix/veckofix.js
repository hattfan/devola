//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//todo Pågår
var moment = require('moment')
var query = {};
var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/padel"
// //mongodb://127.0.0.1:27017

// MongoClient.connect(url, (err, client) => {
//   var db = client.db("padel");
//   if (err) throw err;
//   db.collection("stat").find().forEach(function (x) {

    var datum = new Date();
    datum.setDate(datum.getDate() - 0);
    var vecka = moment(datum, "MM-DD-YYYY").week()
    
    moment(datum, "MM-DD-YYYY").week().toString().length == 1? vecka = '0'+ vecka:null;
    var vecka = datum.getFullYear() + ' - ' + vecka
    console.log(vecka)
    var månad = datum.getFullYear() + ' - ' + (datum.getMonth()+1)

    query = {
      'Månad' : månad,
      'Vecka' : vecka
    }
    // console.log(query)
    // db.collection("stat").update({ '_id': x['_id'] }, { $set: query }, function (err, rec) {
    //   if (err) console.log(err);
    //   console.log("Uppdaterat: " + rec.result.nModified);
    //   // });
    // });
//   });
// })
