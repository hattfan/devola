//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017", (err, client) => {
  var db = client.db("foosball");
  if (err) throw err;

  db.collection("playerWeek").distinct('vecka', function (err, veckor) {
    if (err) throw err
    for (let x = 0; x < veckor.length; x++) {
      db.collection("playerWeek").find({'vecka':veckor[x]}).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        if (err) throw err
        console.log(veckor[x] + ' - ' + data[0].Spelare)
      })
    }
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