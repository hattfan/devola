//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//todo Pågår
var rp = require('request-promise');
var MongoClient = require("mongodb").MongoClient;

var alla = [], test = [], winCounter, loseCounter, goalCounter;

MongoClient.connect("mongodb://127.0.0.1:27017", (err, client) => {
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

            (function loop(i) {
              const promise = new Promise((resolve, reject) => {
                console.log(unique[i])
                db.collection("stat").find({ $or: [{ Lag1Spelare1: unique[i] }, { Lag1Spelare2: unique[i] }, { Lag2Spelare1: unique[i] }, { Lag2Spelare2: unique[i] }] }).toArray(function (err, x) {
                  if (err) throw err
                  winCounter = 0, loseCounter = 0, goalCounter = 0;
                  for (let ii = 0; ii < x.length; ii++) {
                    if (x[ii]['Lag1Spelare1'] == unique[i] || x[ii]['Lag1Spelare2'] == unique[i]) {
                      if (x[ii]['Lag1Matchvinst'] == 1) {
                        winCounter++;
                      } else if (x[ii]['Lag2Matchvinst'] == 1) {
                        loseCounter++;
                      }
                    } else if (x[ii]['Lag2Spelare1'] == unique[i] || x[ii]['Lag2Spelare2'] == unique[i]) {
                      if (x[ii]['Lag2Matchvinst'] == 1) {
                        winCounter++;
                      } else if (x[ii]['Lag1Matchvinst'] == 1) {
                        loseCounter++;
                      }
                    }
                  }
                  console.log('vinster: ' + winCounter + ' loses: ' + loseCounter + ' mål : ' + goalCounter)
                })
                resolve();
              }).then(() => i >= (unique.length - 1) || loop(i + 1));
            })(0);
        })
      })
    })
  })
});


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
