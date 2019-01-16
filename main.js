var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    moment = require('moment'),
    mongo = require('mongodb'),
    MongoClient = require('mongodb').MongoClient;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/views'));
//Store all HTML files in view folder.

// PASSPORT CONFIGURATION
// app.use(require("express-session")({
//     secret: "Once again Rusty wins cutest dog!",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// var url = "mongodb://127.0.0.1:27017"
var url = "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/foosball" 

MongoClient.connect(url, (err, client) => {
    var db = client.db('foosball');
        if (err) throw err;

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Foosball Landing routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/foosball', function (req, res) {
    res.render('foosball/index.ejs');
});

app.get('/foosball/tusenklubben', function (req, res) {
    res.render('foosball/tusenklubben.ejs');
});

app.get('/foosball/slump', function (req, res) {
    res.render('foosball/slump.ejs');
});

app.get('/foosball/reglanding', function (req, res) {
    res.render('foosball/reglanding.ejs');
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Foosball ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/foosball/admin', function (req, res) {
    res.render('foosball/adminLanding.ejs');
});

app.get("/foosball/removeGame/:id", (req, res) => {
    //find the campground with provided id in DB

    var o_id = new mongo.ObjectId(req.params.id)

    // var parameters = req.params

    db.collection("stat").deleteOne({'_id':o_id},function (err, data) {
        if (err) throw err
        // console.log(data)
        res.render(__dirname + "/views/foosball/removeGameLanding.ejs")
    });
}); 

app.get("/foosball/leagueUpdate", (req, res) => {
    require(__dirname + "/views/foosball/js/mongo/statsVeckaUpdate.js")
})

//!History route
app.get('/foosball/history', function (req, res) {
    db.collection("playerWeek").distinct('vecka', function(err, veckor){
        res.render('foosball/history.ejs', {veckor:JSON.stringify(veckor)});
    })
});
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! data-routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/foosball/data/vecka', function (req, res) {
    db.collection("playerWeek").find({}).sort({ 'vecka': -1, "Viktning": -1 }).toArray(function (err, data) {
        if (err) throw err
        res.json(data)

    })
});

app.get('/foosball/data/month', function (req, res) {
    db.collection("playerMonth").find({}).sort({ 'Månad': -1, "Viktning": -1 }).toArray(function (err, data) {
        if (err) throw err
        res.json(data)
    })
});

app.get('/foosball/data', function (req, res) {
    db.collection("playerMonth").find({}).sort({ 'Månad': -1, "Viktning": -1 }).toArray(function (err, monthData) {
        if (err) throw err
        db.collection("playerWeek").find({}).sort({ 'vecka': -1, "Viktning": -1 }).toArray(function (err, veckoData) {
            if (err) throw err
            var data ={}
            data.month = monthData
            data.vecka = veckoData
            res.json(data)
        })
    })
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Nya spelare !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/foosball/newPlayer', function (req, res) {
    res.render('foosball/newPlayer.ejs');
});

app.get('/foosball/newPlayerLanding', function (req, res) {
    res.render('foosball/newPlayerLanding.ejs');
});

app.post("/foosball/newPlayer", function (req, res) {
    var datum = new Date();
    
    var månad = datum.getFullYear() + ' - ' + (datum.getMonth() + 1)
    var vecka = moment(datum, "MM-DD-YYYY").week()
    moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
    vecka = datum.getFullYear() + ' - ' + vecka

    var newPlayer = {'Spelare': req.body.playerNamn}
    db.collection("aktiva").insert(newPlayer, function (err, resDB) {
        if (err) throw err
        console.log('Inlagd spelare ' + resDB.insertedCount + ' - ' + req.body.playerNamn)
    })

    var totalPlayerAdd = {"Spelare": req.body.playerNamn,"Vinster": 0,"Förluster": 0,"GjordaMål": 0,"InsläpptaMål": 0,"Viktning": 0, "Procent":0, "SpeladeMatcher" : 0}
    db.collection("playerTotal").insert(totalPlayerAdd, function (err, resDB) {
        if (err) throw err
        console.log('Inlagd spelare i totalligan' + resDB.insertedCount + ' - ' + req.body.playerNamn)
    })

    var monthPlayerAdd = {"Månad": månad,"Spelare": req.body.playerNamn,"Vinster": 0,"Förluster": 0,"GjordaMål": 0,"InsläpptaMål": 0,"Viktning": 0}
    db.collection("playerMonth").insert(monthPlayerAdd, function (err, resDB) {
        if (err) throw err
        console.log('Inlagd spelare i månadsligan' + resDB.insertedCount + ' - ' + req.body.playerNamn)
    })

    var veckoPlayerAdd = {"vecka": vecka,"Spelare": req.body.playerNamn,"Vinster": 0,"Förluster": 0,"GjordaMål": 0,"InsläpptaMål": 0,"Viktning": 0}
    db.collection("playerWeek").insert(veckoPlayerAdd, function (err, resDB) {
        if (err) throw err
        console.log('Inlagd spelare i veckoligan' + resDB.insertedCount + ' - ' + req.body.playerNamn)
    })

    var vroomPlayerAdd = {"Spelare": req.body.playerNamn,"vroomWinCount": 0,"vroomLostCount": 0,"bountyWinCount": 0,"bountyLostCount": 0}
    db.collection("playerVroomBounty").insert(vroomPlayerAdd, function (err, resDB) {
        if (err) throw err
        console.log('Inlagd spelare i veckoligan' + resDB.insertedCount + ' - ' + req.body.playerNamn)
    })

    res.redirect("/foosball/newPlayerLanding");
})


//! End Nya spelare !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! Remove player !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get("/foosball/remove/:id", (req, res) => {
    //find the campground with provided id in DB

    var o_id = new mongo.ObjectId(req.params.id)
        // console.log(o_id)
    db.collection("aktiva").deleteOne({'_id':o_id},function (err, data) {
        if (err) throw err
        // console.log(data)
        res.render('foosball/removePlayerLanding.ejs')
    })
}); 

app.get('/foosball/removePlayer', function (req, res) {

    db.collection("aktiva").find({}).toArray(function (err, data) {
        if (err) throw err
        // console.log('Inlagd spelare ' + resDB.insertedCount + ' - ' + req.body.playerNamn)
        res.render('foosball/removePlayer.ejs', {data:data});
    })
});

app.get('/foosball/nyaslumpen', function (req, res) {

    db.collection("aktiva").find({}).sort({'Spelare':1}).toArray(function (err, data) {
        if (err) throw err
        // console.log('Inlagd spelare ' + resDB.insertedCount + ' - ' + req.body.playerNamn)
        res.render('foosball/nyaslumpen.ejs', {data:data});
    })
});

//! End remove !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/foosball/slumpPlayers', function (req, res) {
    db.collection("aktiva").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
        if (err) throw err
        // console.log('Inlagd spelare ' + resDB.insertedCount + ' - ' + req.body.playerNamn)
        res.render('foosball/slumpPlayers.ejs', {data:data});
    })
})


app.get('/foosball/register', function (req, res) {
    db.collection("aktiva").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
        if (err) throw err

        res.render('foosball/register.ejs', { data: data });
    })
})

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! STATS ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/foosball/statLanding', function (req, res) {
    res.render('foosball/statLanding.ejs');
});

app.get('/foosball/statsWeek', function (req, res) {
    var datum = new Date();
    // datum.setDate(datum.getDate() + 5);
    
    var vecka = moment(datum, "MM-DD-YYYY").week()
    moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
    vecka = datum.getFullYear() + ' - ' + vecka
    
    db.collection("playerWeek").find({ 'vecka': vecka }).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        if (err) throw err
        // console.log(data)
        res.render("foosball/statWeek.ejs", { dataname: data, vecka: vecka })
    })
})

app.get('/foosball/statsMonth', function (req, res) {
    var datum = new Date();

    var månad = datum.getFullYear() + ' - ' + (datum.getMonth()+1)
    // var vecka = "2018 - 15"
    db.collection("playerMonth").find({ 'Månad': månad }).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        if (err) throw err
        // console.log(data)
        res.render("foosball/statMonth.ejs", { dataname: data, månad: månad })
    })
})

app.get('/foosball/statsVroom', function (req, res) {
    db.collection("playerVroomBounty").find().sort({ 'vroomWinCount': -1 }).toArray(function (err, data) {
        if (err) throw err
        res.render("foosball/statVroom.ejs", { dataname: data })
    })
})


app.get('/foosball/statsTotal', function (req, res) {
    db.collection("playerTotal").find({}).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        if (err) throw err
        res.render("foosball/statTotal.ejs", { dataname: data })
    })
})

app.get('/foosball/allGames', function (req, res) {

    db.collection("stat").find({}).sort({ 'Tidstämpel': -1 }).toArray(function (err, data) {
        if (err) throw err

        res.render("foosball/allGames.ejs", { dataname: data, moment: moment })
    })
})


// CREATE - add new campground to DB
app.post("/foosball/resultat", function (req, res) {
    var Lag1Matchvinst, Lag2Matchvinst;
    var Lag1 = Number(req.body.goalTeam1)
    var Lag2 = Number(req.body.goalTeam2)
    if (Lag1 > Lag2) {
        Lag1Matchvinst = 1
        Lag2Matchvinst = 0
    }
    else if (Lag1 < Lag2) {
        Lag1Matchvinst = 0
        Lag2Matchvinst = 1
    }
    var datum = new Date();
    // datum.setDate(datum.getDate() + 5);
    var vecka = moment(datum, "MM-DD-YYYY").week()
    moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
    vecka = datum.getFullYear() + ' - ' + vecka

    var månad = datum.getFullYear() + ' - ' + (datum.getMonth() + 1)

    // get data from the form
    var newPost = {
        "Tidstämpel": datum,
        "Lag1Spelare1": req.body.player1Team1,
        "Lag1Spelare2": req.body.player2Team1,
        "Lag1": req.body.goalTeam1,
        "Lag2Spelare1": req.body.player1Team2,
        "Lag2Spelare2": req.body.player2Team2,
        "Lag2": req.body.goalTeam2,
        "Lag1Matchvinst": Lag1Matchvinst,
        "Lag2Matchvinst": Lag2Matchvinst,
        "Datum": datum,
        "Månad": månad,
        "Vecka": vecka
    };

    var spelare = {
        spelare1: req.body.player1Team1,
        spelare2: req.body.player2Team1,
        spelare3: req.body.player1Team2,
        spelare4: req.body.player2Team2
    }
    var spelareArr = [req.body.player1Team1, req.body.player2Team1, req.body.player1Team2, req.body.player2Team2]
    

    db.collection("stat").insert(newPost, function (err, resDB) {
        if (err) throw err
        console.log('Inlagd match ' + resDB.insertedCount)


    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!! VECKO-INSERT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var spelareloggade = [], insertDB = {};
        db.collection('playerWeek').find({ 'vecka': vecka }).toArray(function (err, res) {
            if (err) throw err
            var pushArr = [];
            for (const key in spelare) {
                if (spelare.hasOwnProperty(key)) {
                    const spelarenr = spelare[key];
                    res.forEach(spelarStat => {
                        if (Object.values(spelarStat).indexOf(spelarenr) > -1) {
                            spelareloggade.push(spelarenr)
                            var query = evaluate(spelare, spelarStat, req, Lag1Matchvinst, Lag2Matchvinst)
                            // console.log(query)
                            pushArr.push(query)
                            db.collection('playerWeek').update({ '_id': spelarStat['_id'] }, { $set: { 'Vinster':query.Vinster, 'Förluster':query['Förluster'],
                                                                'GjordaMål':query['GjordaMål'],'InsläpptaMål':query['InsläpptaMål'],'Viktning':query['Viktning'] } }, function (err, res) {
                                if (err) throw err
                                // console.log('Updated: ' + res.result.nModified + ' - ' + spelarStat.Spelare)
                            })
                        }
                    })
                };
            }
            for (let i = 0; i < spelareArr.length; i++) {
                if (!spelareloggade.includes(spelareArr[i]) && i < 2) {
                    insertDB = {"vecka": vecka,"Spelare": spelareArr[i],"Vinster": Lag1Matchvinst,"Förluster": Lag2Matchvinst,"GjordaMål": Lag1,"InsläpptaMål": Lag2, 
                                "Viktning": (Math.round((Math.pow((Lag1Matchvinst/(Lag1Matchvinst+Lag2Matchvinst)),3) * Lag1Matchvinst)*100)/100 + (Lag1-Lag2)*0.001)}
                    db.collection('playerWeek').insert(insertDB, function (err, res) {
                        if (err) throw err
                        // console.log('Insertade ' + spelareArr[i])
                    })
                } else if (!spelareloggade.includes(spelareArr[i]) && i >= 2) {
                    insertDB = {"vecka": vecka,"Spelare": spelareArr[i],"Vinster": Lag2Matchvinst,"Förluster": Lag1Matchvinst,"GjordaMål": Lag2,"InsläpptaMål": Lag1,
                                "Viktning": (Math.round((Math.pow((Lag2Matchvinst/(Lag2Matchvinst+Lag1Matchvinst)),3) * Lag2Matchvinst)*100)/100 + (Lag2-Lag1)*0.001)}
                    db.collection('playerWeek').insert(insertDB, function (err, res) {
                        if (err) throw err
                        // console.log('Insertade ' + spelareArr[i])
                    })
                }
            }
        })
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!! MÅNADS-INSERT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var spelareloggade = [], insertDB = {};
        db.collection('playerMonth').find({ 'Månad': månad }).toArray(function (err, res) {
            if (err) throw err
            var pushArr = [];
            for (const key in spelare) {
                if (spelare.hasOwnProperty(key)) {
                    const spelarenr = spelare[key];
                    res.forEach(spelarStat => {
                        if (Object.values(spelarStat).indexOf(spelarenr) > -1) {
                            spelareloggade.push(spelarenr)
                            var query = evaluate(spelare, spelarStat, req, Lag1Matchvinst, Lag2Matchvinst)
                            pushArr.push(query)
                            db.collection('playerMonth').update({ '_id': spelarStat['_id'] }, { $set: { 'Vinster':query.Vinster, 'Förluster':query['Förluster'],
                                                                'GjordaMål':query['GjordaMål'],'InsläpptaMål':query['InsläpptaMål'],'Viktning':query['Viktning']} }, function (err, res) {
                                if (err) throw err
                            })
                        }
                    })
                };
            }
            for (let i = 0; i < spelareArr.length; i++) {
                if (!spelareloggade.includes(spelareArr[i]) && i < 2) {
                    insertDB = {'Månad':månad,"Spelare": spelareArr[i],"Vinster": Lag1Matchvinst,"Förluster": Lag2Matchvinst,"GjordaMål": Lag1,"InsläpptaMål": Lag2,
                    "Viktning": (Math.round((Math.pow((Lag1Matchvinst/(Lag1Matchvinst+Lag2Matchvinst)),3) * Lag1Matchvinst)*100)/100 + (Lag1-Lag2)*0.001)}
                    db.collection('playerMonth').insert(insertDB, function (err, res) {
                        if (err) throw err
                    })
                } else if (!spelareloggade.includes(spelareArr[i]) && i >= 2) {
                    insertDB = {'Månad':månad,"Spelare": spelareArr[i],"Vinster": Lag2Matchvinst,"Förluster": Lag1Matchvinst,"GjordaMål": Lag2,"InsläpptaMål": Lag1,
                                "Viktning": (Math.round((Math.pow((Lag2Matchvinst/(Lag2Matchvinst+Lag1Matchvinst)),3) * Lag2Matchvinst)*100)/100 + (Lag2-Lag1)*0.001)}
                    db.collection('playerMonth').insert(insertDB, function (err, res) {
                        if (err) throw err
                        console.log('Insertade ' + spelareArr[i])
                    })
                }
            }
        })
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!! TOTAL-INSERT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var spelareloggade = [], insertDB = {};
        db.collection('playerTotal').find({}).toArray(function (err, res) {
            if (err) throw err
            var pushArr = [];
            for (const key in spelare) {
                if (spelare.hasOwnProperty(key)) {
                    const spelarenr = spelare[key];
                    res.forEach(spelarStat => {
                        if (Object.values(spelarStat).indexOf(spelarenr) > -1) {
                            spelareloggade.push(spelarenr)
                            var query = evaluate(spelare, spelarStat, req, Lag1Matchvinst, Lag2Matchvinst)
                            // console.log(query)
                            pushArr.push(query)
                            db.collection('playerTotal').update({ '_id': spelarStat['_id'] }, { $set: { 'Vinster':query.Vinster, 'Förluster':query['Förluster'],
                                                                'GjordaMål':query['GjordaMål'],'InsläpptaMål':query['InsläpptaMål'],'Viktning':query['Viktning'], 'SpeladeMatcher':query['SpeladeMatcher'],'Procent':query['Procent']} }, function (err, res) {
                                if (err) throw err
                                // console.log('Updated: ' + res.result.nModified + ' - ' + spelarStat.Spelare)
                            })
                        }
                    })
                };
            }
            for (let i = 0; i < spelareArr.length; i++) {
                if (!spelareloggade.includes(spelareArr[i]) && i < 2) {
                    insertDB = {"Spelare": spelareArr[i],"Vinster": Lag1Matchvinst,"Förluster": Lag2Matchvinst,"GjordaMål": Lag1,"InsläpptaMål": Lag2,
                    "Viktning": (Math.round((Math.pow((Lag1Matchvinst/(Lag1Matchvinst+Lag2Matchvinst)),3) * Lag1Matchvinst)*100)/100 + (Lag1-Lag2)*0.001), 'SpeladeMatcher':query['SpeladeMatcher'],'Procent':query['Procent']}
                    db.collection('playerTotal').insert(insertDB, function (err, res) {
                        if (err) throw err
                        console.log('Insertade ' + spelareArr[i])
                    })
                } else if (!spelareloggade.includes(spelareArr[i]) && i >= 2) {
                    insertDB = {"Spelare": spelareArr[i],"Vinster": Lag2Matchvinst,"Förluster": Lag1Matchvinst,"GjordaMål": Lag2,"InsläpptaMål": Lag1,
                                "Viktning": (Math.round((Math.pow((Lag2Matchvinst/(Lag2Matchvinst+Lag1Matchvinst)),3) * Lag2Matchvinst)*100)/100 + (Lag2-Lag1)*0.001),'SpeladeMatcher':query['SpeladeMatcher'],'Procent':query['Procent']}
                    db.collection('playerTotal').insert(insertDB, function (err, res) {
                        if (err) throw err
                        console.log('Insertade ' + spelareArr[i])
                    })
                }
            }
        })

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!! VROOM-INSERT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        vroomlogg = {}, vromTot=[];    
        db.collection('playerVroomBounty').find().toArray(function(err,res){
            if(err) throw err
            for (const key in spelare) {
                if (spelare.hasOwnProperty(key)) {
                    const spelarenr = spelare[key];
                    res.forEach(spelarStat => {
                        if (Object.values(spelarStat).indexOf(spelarenr) > -1) {
                            spelareloggade.push(spelarenr)
                            var query = vroomEval(spelare, spelarStat, req, Lag1, Lag2)
                            
                            db.collection('playerVroomBounty').update({ '_id': spelarStat['_id'] }, { $set: { 'vroomWinCount':query.vroomWinCount,'vroomLostCount':query.vroomLostCount,
                                            'bountyWinCount':query.bountyWinCount,'bountyLostCount':query.bountyLostCount} }, function (err, res) {
                                if (err) throw err
                            })
                        }
                    })
                };
            }    
        })
        


    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!! KLART !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        res.redirect("/foosball/reglanding");
    })
})

var port = process.env.PORT || 3030; 

app.listen(port, process.env.IP, function () {
    var appConsoleMsg = 'Hemsidan startad: ';
    appConsoleMsg += process.env.IP + ':' + port;
    console.log(appConsoleMsg);
});


function evaluate(spelare, x, req, Lag1Matchvinst, Lag2Matchvinst) {
    var vinster = x['Vinster'], losses = x['Förluster'], gjordaMål = Number(x['GjordaMål']), insläpptaMål = Number(x['InsläpptaMål']), procent, spelade
    if (x['Spelare'] == spelare.spelare1 || x['Spelare'] == spelare.spelare2) {
        if (Lag1Matchvinst > Lag2Matchvinst) {
            vinster = x['Vinster'] + 1;
            gjordaMål = Number(x['GjordaMål']) + Number(req.body.goalTeam1)
            insläpptaMål = Number(x['InsläpptaMål']) + Number(req.body.goalTeam2)
        } else if (Lag1Matchvinst < Lag2Matchvinst) {
            losses = x['Förluster'] + 1
            gjordaMål = Number(x['GjordaMål']) + Number(req.body.goalTeam2)
            insläpptaMål = Number(x['InsläpptaMål']) + Number(req.body.goalTeam1)
        }
    }
    else if (x['Spelare'] == spelare.spelare3 || x['Spelare'] == spelare.spelare4) {
        if (Lag1Matchvinst < Lag2Matchvinst) {
            vinster = x['Vinster'] + 1;
            gjordaMål = Number(x['GjordaMål']) + Number(req.body.goalTeam1)
            insläpptaMål = Number(x['InsläpptaMål']) + Number(req.body.goalTeam2)
        } else if (Lag1Matchvinst > Lag2Matchvinst) {
            losses = x['Förluster'] + 1
            gjordaMål = Number(x['GjordaMål']) + Number(req.body.goalTeam2)
            insläpptaMål = Number(x['InsläpptaMål']) + Number(req.body.goalTeam1)
        }
    }

    viktning = (Math.round((Math.pow((vinster/(vinster+losses)),3) * vinster)*100)/100 + (gjordaMål-insläpptaMål)*0.001)
    procent = Math.round(vinster/(vinster+losses)*100)/100

    var query = {
        'Vinster': vinster,
        'Förluster': losses,
        'GjordaMål': gjordaMål,
        'InsläpptaMål': insläpptaMål,
        'Viktning' : viktning,
        'Procent' : procent,
        'SpeladeMatcher' : (vinster+losses)
    }

    return query
}

function vroomEval(spelare, x, req, l1, l2){
    var vroomWin = x['vroomWinCount'], vroomLost = x['vroomLostCount'],bountyWin = x['bountyWinCount'],bountyLost = x['bountyLostCount'];
    if (x['Spelare'] == spelare.spelare1 || x['Spelare'] == spelare.spelare2) {
        if (l1 == 6 && l2 == 0) {
            vroomWin = x['vroomWinCount'] + 1;
        } else if (l1 == 6 && l2 == 1) {
            bountyWin = x['bountyWinCount'] + 1
        } else if (l1 == 0 && l2 == 6) {
            vroomLost = x['vroomLostCount'] + 1
        } else if (l1 == 1 && l2 == 6) {
            bountyLost = x['bountyLostCount'] + 1
        }
    }
    else if (x['Spelare'] == spelare.spelare3 || x['Spelare'] == spelare.spelare4) {
        if (l1 == 0 && l2 == 6) {
            vroomWin = x['vroomWinCount'] + 1;
        } else if (l1 == 1 && l2 == 6) {
            bountyWin = x['bountyWinCount'] + 1
        } else if (l1 == 6 && l2 == 0) {
            vroomLost = x['vroomLostCount'] + 1
        } else if (l1 == 6 && l2 == 1) {
            bountyLost = x['bountyLostCount'] + 1
        }
    }

    var query = {
        'vroomWinCount': vroomWin,
        'vroomLostCount': vroomLost,
        'bountyWinCount': bountyWin,
        'bountyLostCount': bountyLost
    }
    return query

}

})

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


app.get('/brandeye/',function(req,res){
	res.render('brandeye/index.ejs');
});

app.get('/brandeye/pure',function(req,res){
	res.render('brandeye/pure.ejs');
});
app.get('/brandeye/slider',function(req,res){
	res.render('brandeye/slider.ejs');
});
app.get('/brandeye/contact',function(req,res){
	res.render('brandeye/contact.ejs');
});
app.get('/brandeye/news',function(req,res){
	res.render('brandeye/news.ejs');
});

app.get('/brandeye/rena',function(req,res){
	res.render('brandeye/rena.ejs');
});

app.get('/brandeye/recept',function(req,res){
	res.render('brandeye/recept.ejs');
});
app.get('/brandeye/blanco',function(req,res){
	res.render('brandeye/blanco.ejs');
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! BLANK route !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/', function (req, res) {
    res.send('Wrong route, try again');
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! FOOSBALL STORE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/worldoffoosball/',function(req,res){
	res.render('worldoffoosball/index.ejs');
});
