//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//TODO Ändrad...
var rp = require('request-promise');
var MongoClient = require("mongodb").MongoClient;

var alla = [], test = [], playerStat = {};

MongoClient.connect(
    "mongodb://127.0.0.1:27017",
    (err, client) => {
        var db = client.db("foosball");
        if (err) throw err;
        // Hitta samtliga spelare
        db.collection("stat").distinct("Lag1Spelare1", function (err, res1) {
            if (err) throw (err)
            // console.log(res1)
            db.collection("stat").distinct("Lag1Spelare2", function (err, res2) {
                if (err) throw (err)
                // console.log(res2)
                db.collection("stat").distinct("Lag2Spelare1", function (err, res3) {
                    if (err) throw (err)
                    // console.log(res3)
                    db.collection("stat").distinct("Lag2Spelare2", function (err, res4) {
                        if (err) throw (err)
                        // console.log(res4)
                        alla = test.concat(res1)
                        alla = alla.concat(res2)
                        alla = alla.concat(res3)
                        alla = alla.concat(res4)
                        var unique = alla.filter(onlyUnique)

                        // console.log(unique)
                        for (let i = 0; i < unique.length; i++) {
                            const element = unique[i];
                            db.collection("aktiva").insert({'Spelare': element}, function (err, res) {
                                if (err) console.log(err);
                                console.log('playerStat' + ' - ' + res.result.nModified + " är inlagd");
                            })
                        }
                        // db.collection("playerAll").insert(unique, function (err, res) {
                        //     if (err) console.log(err);
                        //     console.log('playerStat' + ' - ' + res.result.nModified + " är inlagd");
                        // })
                        // console.log(playerStat)

                        // console.log('vinster: ' + winCounter + ' loses: ' + loseCounter + ' mål : ' + madeGoalCounter + ' insläppta ' + lostGoalCounter)
                    })
                })
            })
        })
    }
);


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
