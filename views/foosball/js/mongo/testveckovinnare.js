
mongo = require('mongodb'),
    MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://127.0.0.1:27017"
var url = "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/foosball"

MongoClient.connect(url, (err, client) => {
    var db = client.db('foosball');
    if (err) throw err;
    var compareArr = [];
    db.collection("playerWeek").distinct('vecka', function (err, veckor) {
        db.collection("playerWeek").find({}).toArray(function (err, data) {
            data.forEach(spelare => {
                for (const key in spelare) {
                    if (spelare.hasOwnProperty(key)) {
                        const element = spelare[key];
                        console.log(Object.filter(spelare, veckor[0]))
                    }
                }
            });
            
            console.log(veckor[2])

            // Object.filter(data)
            // for (let i = 0; i < veckor.length; i++) {
            //     for (let y = 0; y < data.length; y++) {
            //         if(data[y]['vecka'] == veckor[i]){
            //             compareArr.push()   
            //         }
            //     }
            // }
        })
    })
})

Object.filter = function( obj, predicate) {
    var result = {}, key;
    // ---------------^---- as noted by @CMS, 
    //      always declare variables with the "var" keyword

    for (key in obj) {
        if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};