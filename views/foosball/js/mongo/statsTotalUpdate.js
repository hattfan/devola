//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//TODO Ändrad...
var rp = require('request-promise');
var MongoClient = require("mongodb").MongoClient;
var winCounter, loseCounter, madeGoalCounter, lostGoalCounter, procent, viktning;
var url = "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/foosball"
//mongodb://127.0.0.1:27017

MongoClient.connect(url, (err, client) => {
  var db = client.db("foosball");
  if (err) throw err;

  db.collection('playerTotal').remove({}, function (err, rec) {

    db.collection("stat").find().toArray(function (err, data) {
      if (err) throw err
      var spelare = []
      for (let i = 0; i < data.length; i++) {
        spelare.push(data[i].Lag1Spelare1)
        spelare.push(data[i].Lag1Spelare2)
        spelare.push(data[i].Lag2Spelare1)
        spelare.push(data[i].Lag2Spelare2)
      }


      var unique = spelare.filter(onlyUnique)

      for (let ii = 0; ii < unique.length; ii++) {
        winCounter = 0, loseCounter = 0, madeGoalCounter = 0, lostGoalCounter = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].Lag1Spelare1 == unique[ii]) {
            winCounter = winCounter + 1;
            madeGoalCounter = madeGoalCounter + Number(data[i].Lag1)
            lostGoalCounter = lostGoalCounter + Number(data[i].Lag2)
          } else if (data[i].Lag1Spelare2 == unique[ii]) {
            winCounter = winCounter + 1;
            madeGoalCounter = madeGoalCounter + Number(data[i].Lag1)
            lostGoalCounter = lostGoalCounter + Number(data[i].Lag2)
          } else if (data[i].Lag2Spelare1 == unique[ii]) {
            loseCounter = loseCounter + 1;
            madeGoalCounter = madeGoalCounter + Number(data[i].Lag2)
            lostGoalCounter = lostGoalCounter + Number(data[i].Lag1)

          } else if (data[i].Lag2Spelare2 == unique[ii]) {
            loseCounter = loseCounter + 1;
            madeGoalCounter = madeGoalCounter + Number(data[i].Lag2)
            lostGoalCounter = lostGoalCounter + Number(data[i].Lag1)
          }
        }
        procent = (winCounter / (winCounter + loseCounter));
        viktning = Math.round((Math.pow(procent, 3) * winCounter + (0.00001 * (madeGoalCounter - lostGoalCounter))) * 100) / 100

        var playerStats = {
          'Spelare': unique[ii],
          'Vinster': winCounter,
          'Förluster': loseCounter,
          'GjordaMål': madeGoalCounter,
          'InsläpptaMål': lostGoalCounter,
          'Viktning': viktning
        }
        db.collection('playerTotal').insert(playerStats, function (err, rec) {
        })
      }
    });
  })
})
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function viktning(spelare) {
  procent = (x['Vinster'] / (x['Vinster'] + x['Förlorade']));
  viktning = Math.pow(procent, 3) * x['Vinster']
  return viktning;
}