//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//TODO Ändrad...
var MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://127.0.0.1:27017", (err, client) => {
    var db = client.db("foosball");
    if (err) throw err;
    db.collection("stat").find().toArray(function (err, data) {
        if (err) throw err
        var spelare = [];
        for (let i = 0; i < data.length; i++) {
            spelare.push(data[i].Lag1Spelare1)
            spelare.push(data[i].Lag1Spelare2)
            spelare.push(data[i].Lag2Spelare1)
            spelare.push(data[i].Lag2Spelare2)
        }

        var unique = spelare.filter(onlyUnique)


        for (let ii = 0; ii < unique.length; ii++) {
            vroomWinCount = 0, vroomLostCount = 0, bountyWinCount = 0, bountyLostCount = 0;
            for (let i = 0; i < data.length; i++) {
                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                //!! Lag 1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                if (data[i].Lag1Spelare1 == unique[ii]) {
                    //?Vroom
                    if (data[i].Lag1 == 6 && data[i].Lag2 == 0) {
                        vroomWinCount = vroomWinCount + 1;
                    } else if (data[i].Lag1 == 0 && data[i].Lag2 == 6) {
                        vroomLostCount = vroomLostCount + 1;
                    }
                    //!Bounty
                    else if (data[i].Lag1 == 6 && data[i].Lag2 == 1) {
                        bountyWinCount = bountyWinCount + 1;
                    } else if (data[i].Lag1 == 1 && data[i].Lag2 == 6) {
                        bountyLostCount = bountyLostCount + 1;
                    }

                }

                else if (data[i].Lag1Spelare2 == unique[ii]) {
                    //?Vroom
                    if (data[i].Lag1 == 6 && data[i].Lag2 == 0) {
                        vroomWinCount = vroomWinCount + 1;
                    } else if (data[i].Lag1 == 0 && data[i].Lag2 == 6) {
                        vroomLostCount = vroomLostCount + 1;
                    }
                    //!Bounty
                    else if (data[i].Lag1 == 6 && data[i].Lag2 == 1) {
                        bountyWinCount = bountyWinCount + 1;
                    } else if (data[i].Lag1 == 1 && data[i].Lag2 == 6) {
                        bountyLostCount = bountyLostCount + 1;
                    }
                }
                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                //!! Lag 2!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                else if (data[i].Lag2Spelare1 == unique[ii]) {
                    //?Vroom
                    if (data[i].Lag1 == 0 && data[i].Lag2 == 6) {
                        vroomWinCount = vroomWinCount + 1;
                    } else if (data[i].Lag1 == 6 && data[i].Lag2 == 0) {
                        vroomLostCount = vroomLostCount + 1;
                    }
                    //!Bounty
                    else if (data[i].Lag1 == 1 && data[i].Lag2 == 6) {
                        bountyWinCount = bountyWinCount + 1;
                    } else if (data[i].Lag1 == 6 && data[i].Lag2 == 1) {
                        bountyLostCount = bountyLostCount + 1;
                    }
                }

                else if (data[i].Lag2Spelare2 == unique[ii]) {
                    //?Vroom
                    if (data[i].Lag1 == 0 && data[i].Lag2 == 6) {
                        vroomWinCount = vroomWinCount + 1;
                    } else if (data[i].Lag1 == 6 && data[i].Lag2 == 0) {
                        vroomLostCount = vroomLostCount + 1;
                    }
                    //!Bounty
                    else if (data[i].Lag1 == 1 && data[i].Lag2 == 6) {
                        bountyWinCount = bountyWinCount + 1;
                    } else if (data[i].Lag1 == 6 && data[i].Lag2 == 1) {
                        bountyLostCount = bountyLostCount + 1;
                    }

                }
            }

            var playerStats = {
                'Spelare': unique[ii],
                'vroomWinCount': vroomWinCount,
                'vroomLostCount': vroomLostCount,

                'bountyWinCount': bountyWinCount,
                'bountyLostCount': bountyLostCount
            }

            // console.log(playerStats)
            db.collection('playerVroomBounty').insert(playerStats, function (err, rec) {
                console.log('Lagt in ' + rec.insertedCount)
            })
        }
    });
})

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function viktning(spelare) {
    procent = (x['Vinster'] / (x['Vinster'] + x['Förlorade']));
    viktning = Math.pow(procent, 3) * x['Vinster']
    return viktning;
}