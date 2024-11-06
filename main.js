var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    moment = require('moment'),
    mongo = require('mongodb'),
    url_parser = require('url');
    MongoClient = require('mongodb').MongoClient;
    dotenv = require('dotenv');
    
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/views'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var url = process.env.MONGODB

var todayHour = new Date().getHours();
var todayDay = new Date().getDay();

app.get('/alive', function(req,res){
    res.send('stayin alive')
})


var port = process.env.PORT || 3030;

app.listen(port, process.env.IP, function () {
    var appConsoleMsg = 'Page started at: ';
    appConsoleMsg += process.env.IP + ':' + port;
    console.log(appConsoleMsg);
});



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Mathubben routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/mathubben', function (req, res) {
    res.render('mathubben/index.ejs');
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!   Portfolio routes      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/portfolio/', function (req, res) {
    res.render('portfolio/portfolio.ejs');
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!   BrandEye routes      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


app.get('/brandeye/', function (req, res) {
    res.render('brandeye/index.ejs');
});

app.get('/brandeye/pure', function (req, res) {
    res.render('brandeye/pure.ejs');
});
app.get('/brandeye/slider', function (req, res) {
    res.render('brandeye/slider.ejs');
});
app.get('/brandeye/contact', function (req, res) {
    res.render('brandeye/contact.ejs');
});
app.get('/brandeye/news', function (req, res) {
    res.render('brandeye/news.ejs');
});

app.get('/brandeye/rena', function (req, res) {
    res.render('brandeye/rena.ejs');
});

app.get('/brandeye/recept', function (req, res) {
    res.render('brandeye/recept.ejs');
});
app.get('/brandeye/blanco', function (req, res) {
    res.render('brandeye/blanco.ejs');
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! BLANK route !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/', function (req, res) {
    res.redirect('/portfolio');
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! FOOSBALL STORE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/worldoffoosball/', function (req, res) {
    res.render('worldoffoosball/index.ejs');
});


function calculatePlayer(matches, allPlayers){
    
    var allPlayersStats = [];
    
    allPlayers.forEach(player => {
        var vinster = 0, losses = 0 ,gjordaMål = 0,insläpptaMål = 0, spelade = 0, procent, viktning;
        matches.forEach(match => {
          if (match['Lag1Spelare1'] == player || match['Lag1Spelare2'] == player) {
                if (match['Lag1'] > match['Lag2']) {
                    vinster = vinster + 1;
                    gjordaMål = gjordaMål + Number(match['Lag1']);
                    insläpptaMål = insläpptaMål + Number(match['Lag2']);
                } else if (match['Lag1'] < match['Lag2']) {
                      losses = losses + 1;  
                      gjordaMål = gjordaMål + Number(match['Lag1']);
                      insläpptaMål = insläpptaMål + Number(match['Lag2']);
                }
            }
            else if (match['Lag2Spelare1'] == player || match['Lag2Spelare2'] == player) {
                if (match['Lag1'] < match['Lag2']) {
                      vinster = vinster + 1;
                      gjordaMål = gjordaMål + Number(match['Lag2']);
                      insläpptaMål = insläpptaMål + Number(match['Lag1']);
                } else if (match['Lag1'] > match['Lag2']) {
                      losses = losses + 1;  
                      gjordaMål = gjordaMål + Number(match['Lag2']);
                      insläpptaMål = insläpptaMål + Number(match['Lag1']);
                }
            }
                        viktning = (Math.round((Math.pow((vinster / (vinster + losses)), 3) * vinster) * 100) / 100 + (gjordaMål - insläpptaMål) * 0.001)
            procent = Math.round(vinster / (vinster + losses) * 100) / 100
        })
        var query = {
              'Spelare' : player,
              'Vinster': vinster,
              'Förluster': losses,
              'GjordaMål': gjordaMål,
              'InsläpptaMål': insläpptaMål,
              'Viktning': viktning,
              'Procent': procent,
              'SpeladeMatcher': (vinster + losses)
          }
      allPlayersStats.push(query)
    })
    return allPlayersStats;
}

function calculateIceCreamGames(matches, allPlayers){
    
    var allPlayersStats = [];
    
    allPlayers.forEach(player => {
        var vinster = 0, losses = 0;
        matches.forEach(match => {
            if (match['Lag1Spelare1'] == player || match['Lag1Spelare2'] == player) {
                if (Number(match['Lag1']) === 10 && Number(match['Lag2']) === 0) {
                    vinster = vinster + 1;
                } 
                if (Number(match['Lag2']) === 10 && Number(match['Lag1']) === 0) {
                    losses = losses + 1;
                } 
            }
            if (match['Lag2Spelare1'] == player || match['Lag2Spelare2'] == player) {
                if (Number(match['Lag2']) === 10 && Number(match['Lag1']) === 0) {
                    vinster = vinster + 1;
                } 
                if (Number(match['Lag1']) === 10 && Number(match['Lag2']) === 0) {
                    losses = losses + 1;
                } 
            }
        })
        var query = {
              'Spelare' : player,
              'Vinster': vinster,
              'Losses': losses,
          }
      allPlayersStats.push(query)
    })
    return allPlayersStats;
}