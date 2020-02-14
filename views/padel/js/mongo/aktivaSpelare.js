//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//TODO Ändrad...
var MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
    "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/padel",
    (err, client) => {
        var db = client.db("padel");
        if (err) throw err;
        // Hitta samtliga spelare
        db.collection("aktiva").find({}, function (err, res) {
            if (err) throw (err)
            res.forEach(row => {
                db.collection("aktiva").updateOne({'_id':row['_id']},{$set:{'Aktiv':true}}, function (err, result) {
                    console.log(result)        
                })
            })
            
        })
    }
);

