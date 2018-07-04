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
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3030');

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

var url = "mongodb://127.0.0.1:27017"
// var url = "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/foosball"

MongoClient.connect(url, (err, client) => {
    var db = client.db('foosball');
        if (err) throw err;

app.get('/', function (req, res) {
    res.render('index.ejs');
});


app.get('/mathubben', function (req, res) {
    res.render('mathubben/index.ejs');
});

app.get('/tusenklubben', function (req, res) {
    res.render('tusenklubben.ejs');
});


app.get('/slump', function (req, res) {
    res.render('slump.ejs');
});

app.get('/reglanding', function (req, res) {
    res.render('reglanding.ejs');
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! ADMIN ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/admin', function (req, res) {
    res.render('adminLanding.ejs');
});

app.get('/data/vecka', function (req, res) {
    db.collection("playerWeek").distinct('vecka', function(err, veckor){
        res.json(veckor)
    })
});


app.get('/history', function (req, res) {
    db.collection("playerWeek").distinct('vecka', function(err, veckor){
        res.render('history.ejs', {veckor:JSON.stringify(veckor)});
    })
});

app.get('/newPlayer', function (req, res) {
    res.render('newPlayer.ejs');
});

app.get('/newPlayerLanding', function (req, res) {
    res.render('newPlayerLanding.ejs');
});

app.get("/remove/:id", (req, res) => {
    //find the campground with provided id in DB

    var o_id = new mongo.ObjectId(req.params.id)
        // console.log(o_id)
    db.collection("aktiva").deleteOne({'_id':o_id},function (err, data) {
        if (err) throw err
        // console.log(data)
        res.render('removePlayerLanding.ejs')
    })
}); 

app.get('/removePlayer', function (req, res) {

    db.collection("aktiva").find({}).toArray(function (err, data) {
        if (err) throw err
        // console.log('Inlagd spelare ' + resDB.insertedCount + ' - ' + req.body.playerNamn)
        res.render('removePlayer.ejs', {data:data});
    })
});

app.get('/slumpPlayers', function (req, res) {
    db.collection("aktiva").find({}).toArray(function (err, data) {
        if (err) throw err
        // console.log('Inlagd spelare ' + resDB.insertedCount + ' - ' + req.body.playerNamn)
        res.render('slumpPlayers.ejs', {data:data});
    })
})

app.post("/newPlayer", function (req, res) {
    var datum = new Date();
    
    var vecka = datum.getFullYear() + ' - ' + moment(datum, "MM-DD-YYYY").week()
    var månad = datum.getFullYear() + ' - ' + (datum.getMonth()+1)

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

    res.redirect("/newPlayerLanding");
})

//!!!END ADMIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/register', function (req, res) {
    db.collection("aktiva").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
        if (err) throw err

        res.render('register.ejs', { data: data });
    })
})

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! STATS ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.get('/statLanding', function (req, res) {
    res.render('statLanding.ejs');
});

app.get('/statsWeek', function (req, res) {
    var datum = new Date();
    var vecka = datum.getFullYear() + ' - ' + moment(datum, "MM-DD-YYYY").week()
    var månad = datum.getFullYear() + ' - ' + datum.getMonth()

    console.log(vecka)
    db.collection("playerWeek").find({ 'vecka': vecka }).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        if (err) throw err
        // console.log(data)
        res.render("statWeek.ejs", { dataname: data, vecka: vecka })
    })
})

app.get('/statsMonth', function (req, res) {
    var datum = new Date();

    var månad = datum.getFullYear() + ' - ' + (datum.getMonth()+1)
    // var vecka = "2018 - 15"
    db.collection("playerMonth").find({ 'Månad': månad }).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        if (err) throw err
        // console.log(data)
        res.render("statMonth.ejs", { dataname: data, månad: månad })
    })
})

app.get('/statsVroom', function (req, res) {
    db.collection("playerVroomBounty").find().sort({ 'vroomWinCount': -1 }).toArray(function (err, data) {
        if (err) throw err
        res.render("statVroom.ejs", { dataname: data })
    })
})


app.get('/statsTotal', function (req, res) {
    db.collection("playerTotal").find({}).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        if (err) throw err
        res.render("statTotal.ejs", { dataname: data })
    })
})

//! STATS ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// CREATE - add new campground to DB
app.post("/resultat", function (req, res) {
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
    var vecka = datum.getFullYear() + ' - ' + moment(datum, "MM-DD-YYYY").week()
    var månad = datum.getFullYear() + ' - ' + (datum.getMonth()+1)

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
    })

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
                        // console.log(query)
                        pushArr.push(query)
                        db.collection('playerMonth').update({ '_id': spelarStat['_id'] }, { $set: { 'Vinster':query.Vinster, 'Förluster':query['Förluster'],
                                                            'GjordaMål':query['GjordaMål'],'InsläpptaMål':query['InsläpptaMål'],'Viktning':query['Viktning']} }, function (err, res) {
                            if (err) throw err
                            // console.log('Updated: ' + res.result.nModified + ' - ' + spelarStat.Spelare)
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
                    console.log('Insertade ' + spelareArr[i])
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
    res.redirect("/reglanding");
})

// var portSettings = process.env.PORT
// var portSettings = 3030;

//COME ON!

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