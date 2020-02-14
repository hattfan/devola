//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/padel"
//mongodb://127.0.0.1:27017

MongoClient.connect(url, (err, client) => {
    var db = client.db("padel");
    if (err) throw err;

    var veckoLog = [], obj, veckovinnare = [];
    db.collection("playerWeek").find({}).sort({ 'vecka': -1, "Viktning": -1 }).toArray(function (err, data) {
        if (err) throw err

        data.forEach(key => {
            if (!veckoLog.includes(key.vecka)) {
                veckoLog.push(key.vecka)
            } else if (veckoLog.includes(key.vecka)) {
            }
        })
        for (let i = 0; i < veckoLog.length; i++) {
            obj = data.find(function (obj) { return obj['vecka'] === veckoLog[i] });
            // console.log(obj.vecka + ' ' + obj.Spelare)
            veckovinnare.push(obj.Spelare)
        }
        var counts = {};

        for (var i = 0; i < veckovinnare.length; i++) {
            var num = veckovinnare[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        
        var unique = veckovinnare.filter( onlyUnique )
        console.log(unique)
        unique.forEach( namn => {
            console.log(namn + ' - ' + counts[namn])
        })
    })

})

function foo(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
