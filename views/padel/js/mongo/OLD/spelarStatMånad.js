//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//todo Pågår
var query = {};
var MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb://127.0.0.1:27017",
  (err, client) => {
    var db = client.db("padel");
    if (err) throw err;
    query = {

    }
    // { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
    // db.collection("stat").find({ $or: [ {Lag1Spelare1 :'Jesper Kjellström'}, {Lag1Spelare2 :'Jesper Kjellström'}, {Lag2Spelare1 :'Jesper Kjellström'}, {Lag2Spelare2 :'Jesper Kjellström'} ]}  ).toArray(function (err, res)  {
    db.collection("stat").find({ $or: [ {Lag1Spelare1 :'Jesper Kjellström'}, {Lag1Spelare2 :'Jesper Kjellström'}, {Lag2Spelare1 :'Jesper Kjellström'}, {Lag2Spelare2 :'Jesper Kjellström'} ]}).count(function (e, res)  {
      // db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
    // var datum = new Date(x['Tidstämpel'].substr(0,10));
      console.log(res)
    });
  }
);
