//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Uppdatera resultat!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//TODO Ändrad...
var MongoClient = require("mongodb").MongoClient;

var alla = [], test = [], playerStat = {};

MongoClient.connect(
    "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/padel",
    (err, client) => {
        var db = client.db("padel");
        if (err) throw err;
        // Hitta samtliga spelare
        var player1 = "Jesper Kjellström";
        var player2 = "Ola Karlsson";
        var player3 = "Tobias Spaaarge"
        var player4 = "Jonathan Hedenbergh";

        db.collection("stat").find({}).toArray(function (err, stats) {
        if (err) throw err;
        var statFilter = stats.filter(row => {
            var checkedRow = playerEval(row, player1, player2, player3, player4);
            if(checkedRow) return row
        });
        
        checkStatistics(statFilter, player1, player2, player3, player4);
            
            
        });
    }
);


function checkStatistics(stat, player) {
    var winCounter = 0;
    var looseCounter = 0;
    // console.log(stat);
    stat.forEach(row => {
        if(row.Lag1Spelare1 === player || row.Lag1Spelare2 === player){
            row.Lag1 > row.Lag2 ? winCounter += 1 : looseCounter +=1;
        } else if (row.Lag2Spelare1 === player || row.Lag2Spelare2 === player){
            row.Lag1 < row.Lag2 ? winCounter += 1 :  looseCounter +=1;
        }
    });
    console.log(winCounter+looseCounter, Math.floor((1-(looseCounter/(winCounter+looseCounter)))*100) + "%");
}

function playerEval(row, player1, player2) {
    var foundGame = false;
    if(row["Lag1Spelare1"] === player1 && row["Lag1Spelare2"] === player2){
        foundGame = true;
    } else if (row["Lag1Spelare2"] === player1 && row["Lag1Spelare1"] === player2){
        foundGame = true;
    }
    else if(row["Lag2Spelare1"] === player1 && row["Lag2Spelare2"] === player2){
        foundGame = true;
    } else if (row["Lag2Spelare2"] === player1 && row["Lag2Spelare1"] === player2){
        foundGame = true;
    }
    return foundGame;
}