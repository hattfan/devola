var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    moment = require('moment'),
    mongo = require('mongodb'),
    url_parser = require('url');
    MongoClient = require('mongodb').MongoClient;



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

var url = "mongodb+srv://ola:Neroxrox5(@foosball.plbsy.mongodb.net/foosball?retryWrites=true&w=majority";

var todayHour = new Date().getHours();
var todayDay = new Date().getDay();

app.get('/alive', function(req,res){
    res.send('stayin alive')
})

app.post('/plc', function(req,res){
    const queryObject = url_parser.parse(req.url, true).query;
    res.send(queryObject);
})

MongoClient.connect(url, (err, client) => {
    var db = client.db('foosball');
    if (err) throw err;

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //! Foosball Landing routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    app.get('/test', function (req, res) {
        res.send('test');
    });
    
    app.get('/foosball', function (req, res) {
        res.render('foosball/index.ejs');
    });

    app.get('/foosball/reglanding', function (req, res) {
        res.render('foosball/reglanding.ejs');
    });

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //! Foosball ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    app.get('/foosball/admin', function (req, res) {
        res.render('foosball/adminLanding.ejs');
    });

    app.get("/foosball/removeGame/:id", (req, res) => {
        //find the campground with provided id in DB

        var o_id = new mongo.ObjectId(req.params.id)

        // var parameters = req.params

        db.collection("stat_axkid").deleteOne({ '_id': o_id }, function (err, data) {
            if (err) throw err
            res.render(__dirname + "/views/foosball/removeGameLanding.ejs")
        });
    });

    app.get("/foosball/leagueUpdate", (req, res) => {
        require(__dirname + "/views/foosball/js/mongo/statsVeckaUpdate.js")
    })

    //!History route
    app.get('/foosball/history', function (req, res) {
        db.collection("playerWeek").distinct('vecka', function (err, veckor) {
            res.render('foosball/history.ejs', { veckor: JSON.stringify(veckor) });
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
        db.collection("stat_axkid").find().sort({"Tidstämpel":1}).toArray(function(err,result){
            res.json(result);
        });
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

        var newPlayer = { 'Spelare': req.body.playerNamn , 'Aktiv':true}
        db.collection("active_axkid").insert(newPlayer, function (err, resDB) {
            if (err) throw err
        })

        var totalPlayerAdd = { "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0, "Procent": 0, "SpeladeMatcher": 0 }
        db.collection("playerTotal").insert(totalPlayerAdd, function (err, resDB) {
            if (err) throw err

        })

        var monthPlayerAdd = { "Månad": månad, "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0 }
        db.collection("playerMonth").insert(monthPlayerAdd, function (err, resDB) {
            if (err) throw err
        })

        var veckoPlayerAdd = { "vecka": vecka, "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0 }
        db.collection("playerWeek").insert(veckoPlayerAdd, function (err, resDB) {
            if (err) throw err
        })

        var vroomPlayerAdd = { "Spelare": req.body.playerNamn, "vroomWinCount": 0, "vroomLostCount": 0, "bountyWinCount": 0, "bountyLostCount": 0 }
        db.collection("glass_axkid").insert(vroomPlayerAdd, function (err, resDB) {
            if (err) throw err
        })

        res.redirect("/foosball/newPlayerLanding");
    })


    //! End Nya spelare !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //! Remove player !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    app.get("/foosball/remove/:id", (req, res) => {
        //find the campground with provided id in DB

        var o_id = new mongo.ObjectId(req.params.id)
        db.collection("active_axkid").update({ '_id': o_id }, {$set:{'Aktiv':false}}, function (err, data) {
            if (err) throw err
            res.render('foosball/removePlayerLanding.ejs')
        })
    });
    
    app.get("/foosball/activate/:id", (req, res) => {
        //find the campground with provided id in DB

        var o_id = new mongo.ObjectId(req.params.id)
        db.collection("active_axkid").update({ '_id': o_id }, {$set:{'Aktiv':true}}, function (err, data) {
            if (err) throw err
            res.render('foosball/activatePlayerLanding.ejs')
        })
    });

    app.get('/foosball/removePlayer', function (req, res) {

        db.collection("active_axkid").find({}).toArray(function (err, data) {
            if (err) throw err
            res.render('foosball/removePlayer.ejs', { data: data });
        })
    });

    app.get('/foosball/nyaslumpen', function (req, res) {

        db.collection("active_axkid").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
            if (err) throw err
            res.render('foosball/nyaslumpen.ejs', { data: data });
        })
    });
        app.get('/foosball/slump', function (req, res) {

            res.render('foosball/slump.ejs')

    });
    
   app.get('/foosball/nyaslumpengetplayers', function (req, res) {

        db.collection("active_axkid").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
            if (err) throw err
            res.json(data)
        })
    });

    //! End remove !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    app.get('/foosball/slumpPlayers', function (req, res) {
        db.collection("active_axkid").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
            if (err) throw err
            res.render('foosball/slumpPlayers.ejs', { data: data });
        })
    })


    app.get('/foosball/register', function (req, res) {
        db.collection("active_axkid").find({'Aktiv':true}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
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
        if (err) throw err
        var datum = new Date();
        var vecka = moment(datum, "MM-DD-YYYY").week()
        moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
        vecka = datum.getFullYear() + ' - ' + vecka;
        db.collection("stat_axkid").find({'Vecka':vecka}).toArray(function(err,result){
            
        var allPlayers = [];
          var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
          
          options.forEach(option => {
            var arrayEv = [...new Set(result.map(item => item[option]))];
            arrayEv.forEach(player => {
              allPlayers.includes(player)?null:allPlayers.push(player);
            })
          })
          
        var playerStatistics = calculatePlayer(result, allPlayers);

        var sorted = playerStatistics.sort((a, b) => { 
                return b.Viktning > a.Viktning ?  1 
                     : a.Viktning > b.Viktning ?  -1
                     :0;                   
            });
        
        res.render('foosball/statWeek.ejs', {dataname:sorted, vecka: vecka})
            
        })
        
    })

    app.get('/foosball/historikinsamling', function(req, res) {
        var allPlayers = [];

        db.collection("stat_axkid").find().toArray(function(err,result){
            if(err) throw err
            var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
          
            options.forEach(option => {
            var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                    allPlayers.includes(player)?null:allPlayers.push(player);
                })
            })
            calculateColumnOne(result, allPlayers);

            // var historicStats = calculatePlayerForHistory(result, allPlayers);
        })
    })

    app.get('/foosball/statsMonth', function (req, res) {
        var datum = new Date();

        var månad = datum.getFullYear() + ' - ' + (datum.getMonth() + 1)
        db.collection("stat_axkid").find({'Månad':månad}).toArray(function(err,result){
        var allPlayers = [];
          var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
          
          options.forEach(option => {
            var arrayEv = [...new Set(result.map(item => item[option]))];
            arrayEv.forEach(player => {
              allPlayers.includes(player)?null:allPlayers.push(player);
            })
          })
          
        var playerStatistics = calculatePlayer(result, allPlayers);

        var sorted = playerStatistics.sort((a, b) => { 
                return b.Viktning > a.Viktning ?  1 
                     : a.Viktning > b.Viktning ?  -1
                     :0;                   
            });
            
        res.render('foosball/statMonth.ejs', {dataname:sorted, månad: månad})
            
        })

    })

    app.get('/foosball/statsVroom', function (req, res) {
        db.collection("stat_axkid").find().toArray(function (err, stats) {
            if (err) throw err
            var allPlayers = [];
            var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
          
            options.forEach(option => {
                var arrayEv = [...new Set(stats.map(item => item[option]))];
                arrayEv.forEach(player => {
                    allPlayers.includes(player)?null:allPlayers.push(player);
                })
            })
            var data = calculateIceCreamGames(stats, allPlayers)
            res.render("foosball/statVroom.ejs", { dataname: data })
        })
    })


    // app.get('/foosball/statsTotal', function (req, res) {
    //     db.collection("playerTotal").find({}).sort({ 'Viktning': -1 }).toArray(function (err, data) {
    //         if (err) throw err
    //         res.render("foosball/statTotal.ejs", { dataname: data })
    //     })
    // })
    
    app.get('/foosball/statsTotal', function (req, res) {
        if (err) throw err

        db.collection("stat_axkid").find().toArray(function(err,result){
            
            var allPlayers = [];
            var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
          
            options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                    allPlayers.includes(player)?null:allPlayers.push(player);
                })
            })
          
            var playerStatistics = calculatePlayer(result, allPlayers);

            var sorted = playerStatistics.sort((a, b) => { 
                return b.Viktning > a.Viktning ?  1 
                     : a.Viktning > b.Viktning ?  -1
                     :0;                   
            });
        
            res.render('foosball/statTotal.ejs', {dataname:sorted})
        })
    })
  
    app.get('/foosball/allGames', function (req, res) {

        db.collection("stat_axkid").find({}).sort({ 'Tidstämpel': -1 }).toArray(function (err, data) {
            if (err) throw err

            res.render("foosball/allGames.ejs", { dataname: data, moment: moment })
        })
    })


        // CREATE - add new campground to DB
    app.post("/foosball/resultat", function (req, res) {
        
        var Lag1Matchvinst, Lag2Matchvinst;
        var Lag1 = parseInt(req.body.goalTeam1)
        var Lag2 = parseInt(req.body.goalTeam2)
        console.log(Lag1, Lag2, Lag1 > Lag2);
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
            "Lag1": Lag1,
            "Lag2Spelare1": req.body.player1Team2,
            "Lag2Spelare2": req.body.player2Team2,
            "Lag2": Lag2,
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


        db.collection("stat_axkid").insert(newPost, function (err, resDB) {
            if (err) throw err

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
                                pushArr.push(query)
                                db.collection('playerTotal').update({ '_id': spelarStat['_id'] }, {
                                    $set: {
                                        'Vinster': query.Vinster, 'Förluster': query['Förluster'],
                                        'GjordaMål': query['GjordaMål'], 'InsläpptaMål': query['InsläpptaMål'], 'Viktning': query['Viktning'], 'SpeladeMatcher': query['SpeladeMatcher'], 'Procent': query['Procent']
                                    }
                                }, function (err, res) {
                                    if (err) throw err
                                })
                            }
                        })
                    };
                }
                for (let i = 0; i < spelareArr.length; i++) {
                    if (!spelareloggade.includes(spelareArr[i]) && i < 2) {
                        insertDB = {
                            "Spelare": spelareArr[i], "Vinster": Lag1Matchvinst, "Förluster": Lag2Matchvinst, "GjordaMål": Lag1, "InsläpptaMål": Lag2,
                            "Viktning": (Math.round((Math.pow((Lag1Matchvinst / (Lag1Matchvinst + Lag2Matchvinst)), 3) * Lag1Matchvinst) * 100) / 100 + (Lag1 - Lag2) * 0.001), 'SpeladeMatcher': query['SpeladeMatcher'], 'Procent': query['Procent']
                        }
                        db.collection('playerTotal').insert(insertDB, function (err, res) {
                            if (err) throw err
                        })
                    } else if (!spelareloggade.includes(spelareArr[i]) && i >= 2) {
                        insertDB = {
                            "Spelare": spelareArr[i], "Vinster": Lag2Matchvinst, "Förluster": Lag1Matchvinst, "GjordaMål": Lag2, "InsläpptaMål": Lag1,
                            "Viktning": (Math.round((Math.pow((Lag2Matchvinst / (Lag2Matchvinst + Lag1Matchvinst)), 3) * Lag2Matchvinst) * 100) / 100 + (Lag2 - Lag1) * 0.001), 'SpeladeMatcher': query['SpeladeMatcher'], 'Procent': query['Procent']
                        }
                        db.collection('playerTotal').insert(insertDB, function (err, res) {
                            if (err) throw err
                        })
                    }
                }
            })

            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //!! VROOM-INSERT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            vroomlogg = {}, vromTot = [];
            db.collection('glass_axkid').find().toArray(function (err, res) {
                if (err) throw err
                for (const key in spelare) {
                    if (spelare.hasOwnProperty(key)) {
                        const spelarenr = spelare[key];
                        res.forEach(spelarStat => {
                            if (Object.values(spelarStat).indexOf(spelarenr) > -1) {
                                spelareloggade.push(spelarenr)
                                var query = vroomEval(spelare, spelarStat, req, Lag1, Lag2)

                                db.collection('glass_axkid').update({ '_id': spelarStat['_id'] }, {
                                    $set: {
                                        'vroomWinCount': query.vroomWinCount, 'vroomLostCount': query.vroomLostCount,
                                        'bountyWinCount': query.bountyWinCount, 'bountyLostCount': query.bountyLostCount
                                    }
                                }, function (err, res) {
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

        viktning = (Math.round((Math.pow((vinster / (vinster + losses)), 3) * vinster) * 100) / 100 + (gjordaMål - insläpptaMål) * 0.001)
        procent = Math.round(vinster / (vinster + losses) * 100) / 100

        var query = {
            'Vinster': vinster,
            'Förluster': losses,
            'GjordaMål': gjordaMål,
            'InsläpptaMål': insläpptaMål,
            'Viktning': viktning,
            'Procent': procent,
            'SpeladeMatcher': (vinster + losses)
        }

        return query
    }

    function vroomEval(spelare, x, req, l1, l2) {
        var vroomWin = x['vroomWinCount'], vroomLost = x['vroomLostCount'], bountyWin = x['bountyWinCount'], bountyLost = x['bountyLostCount'];
        if (x['Spelare'] == spelare.spelare1 || x['Spelare'] == spelare.spelare2) {
            if (l1 == 10 && l2 == 0) {
                vroomWin = x['vroomWinCount'] + 1;
            } else if (l1 == 10 && l2 == 1) {
                bountyWin = x['bountyWinCount'] + 1
            } else if (l1 == 0 && l2 == 10) {
                vroomLost = x['vroomLostCount'] + 1
            } else if (l1 == 1 && l2 == 10) {
                bountyLost = x['bountyLostCount'] + 1
            }
        }
        else if (x['Spelare'] == spelare.spelare3 || x['Spelare'] == spelare.spelare4) {
            if (l1 == 0 && l2 == 10) {
                vroomWin = x['vroomWinCount'] + 1;
            } else if (l1 == 1 && l2 == 10) {
                bountyWin = x['bountyWinCount'] + 1
            } else if (l1 == 10 && l2 == 0) {
                vroomLost = x['vroomLostCount'] + 1
            } else if (l1 == 10 && l2 == 1) {
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

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Pingis Landing routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/pingis', function (req, res) {
            if (err) throw err
            var datum = new Date();
            var vecka = moment(datum, "MM-DD-YYYY").week()
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
            vecka = datum.getFullYear() + ' - ' + vecka;
            db.collection("stat_axkid").find({'Vecka':vecka}).toArray(function(err,result){
                
            var allPlayers = [];
                var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
                
                options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                    allPlayers.includes(player)?null:allPlayers.push(player);
                })
                })
                
            var playerStatistics = calculatePlayer(result, allPlayers);
    
            var sorted = playerStatistics.sort((a, b) => { 
                return b.Viktning > a.Viktning ?  1 
                        : a.Viktning > b.Viktning ?  -1
                        :0;                   
            });
            lastWeeksWinner = null;
            
            res.render('pingis/index.ejs', {lastWeeksWinner:lastWeeksWinner});
            });
        });
    
        app.get('/pingis/tusenklubben', function (req, res) {
            res.render('pingis/tusenklubben.ejs');
        });
    
    
        app.get('/pingis/reglanding', function (req, res) {
            res.render('pingis/reglanding.ejs');
        });
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! pingis ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        app.get('/pingis/admin', function (req, res) {
            res.render('pingis/adminLanding.ejs');
        });
    
        app.get("/pingis/removeGame/:id", (req, res) => {
            //find the campground with provided id in DB
    
            var o_id = new mongo.ObjectId(req.params.id)
    
            // var parameters = req.params
    
            db.collection("stats_pingis").deleteOne({ '_id': o_id }, function (err, data) {
                if (err) throw err
                res.render(__dirname + "/views/pingis/removeGameLanding.ejs")
            });
        });
    
    
        //!History route
        app.get('/pingis/history', function (req, res) {
            db.collection("playerWeek").distinct('vecka', function (err, veckor) {
                res.render('pingis/history.ejs', { veckor: JSON.stringify(veckor) });
            })
        });
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! data-routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        app.get('/pingis/data/vecka', function (req, res) {
            db.collection("playerWeek").find({}).sort({ 'vecka': -1, "Viktning": -1 }).toArray(function (err, data) {
                if (err) throw err
                res.json(data)
    
            })
        });
    
        app.get('/pingis/data/month', function (req, res) {
            db.collection("playerMonth").find({}).sort({ 'Månad': -1, "Viktning": -1 }).toArray(function (err, data) {
                if (err) throw err
                res.json(data)
            })
        });
    
        app.get('/pingis/data', function (req, res) {
            db.collection("playerMonth").find({}).sort({ 'Månad': -1, "Viktning": -1 }).toArray(function (err, monthData) {
                if (err) throw err
                db.collection("playerWeek").find({}).sort({ 'vecka': -1, "Viktning": -1 }).toArray(function (err, veckoData) {
                    if (err) throw err
                    var data = {}
                    data.month = monthData
                    data.vecka = veckoData
                    res.json(data)
                })
            })
        });
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Nya spelare !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/pingis/newPlayer', function (req, res) {
            res.render('pingis/newPlayer.ejs');
        });
    
        app.get('/pingis/newPlayerLanding', function (req, res) {
            res.render('pingis/newPlayerLanding.ejs');
        });
    
        app.post("/pingis/newPlayer", function (req, res) {
            var datum = new Date();
    
            var månad = datum.getFullYear() + ' - ' + (datum.getMonth() + 1)
            var vecka = moment(datum, "MM-DD-YYYY").week()
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
            vecka = datum.getFullYear() + ' - ' + vecka
    
            var newPlayer = { 'Spelare': req.body.playerNamn , 'Aktiv':true}
            db.collection("aktiva_pingis").insert(newPlayer, function (err, resDB) {
                if (err) throw err
            })
    
            var totalPlayerAdd = { "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0, "Procent": 0, "SpeladeMatcher": 0 }
            db.collection("playerTotal").insert(totalPlayerAdd, function (err, resDB) {
                if (err) throw err
    
            })
    
            var monthPlayerAdd = { "Månad": månad, "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0 }
            db.collection("playerMonth").insert(monthPlayerAdd, function (err, resDB) {
                if (err) throw err
            })
    
            var veckoPlayerAdd = { "vecka": vecka, "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0 }
            db.collection("playerWeek").insert(veckoPlayerAdd, function (err, resDB) {
                if (err) throw err
            })
    
            var vroomPlayerAdd = { "Spelare": req.body.playerNamn, "vroomWinCount": 0, "vroomLostCount": 0, "bountyWinCount": 0, "bountyLostCount": 0 }
            db.collection("glass_axkid").insert(vroomPlayerAdd, function (err, resDB) {
                if (err) throw err
            })
    
            res.redirect("/pingis/newPlayerLanding");
        })
    
    
        //! End Nya spelare !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Remove player !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get("/pingis/remove/:id", (req, res) => {
            //find the campground with provided id in DB
    
            var o_id = new mongo.ObjectId(req.params.id)
            db.collection("aktiva_pingis").update({ '_id': o_id }, {$set:{'Aktiv':false}}, function (err, data) {
                if (err) throw err
                res.render('pingis/removePlayerLanding.ejs')
            })
        });
        
        app.get("/pingis/activate/:id", (req, res) => {
            //find the campground with provided id in DB
    
            var o_id = new mongo.ObjectId(req.params.id)
            db.collection("aktiva_pingis").update({ '_id': o_id }, {$set:{'Aktiv':true}}, function (err, data) {
                if (err) throw err
                res.render('pingis/activatePlayerLanding.ejs')
            })
        });
    
        app.get('/pingis/removePlayer', function (req, res) {
    
            db.collection("aktiva_pingis").find({}).toArray(function (err, data) {
                if (err) throw err
                res.render('pingis/removePlayer.ejs', { data: data });
            })
        });
    
        app.get('/pingis/nyaslumpen', function (req, res) {
    
            db.collection("aktiva_pingis").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
                res.render('pingis/nyaslumpen.ejs', { data: data });
            })
        });
            app.get('/pingis/slump', function (req, res) {
    
                res.render('pingis/slump.ejs')
    
        });
        
       app.get('/pingis/nyaslumpengetplayers', function (req, res) {
    
            db.collection("aktiva_pingis").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
                res.json(data)
            })
        });
    
        //! End remove !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/pingis/slumpPlayers', function (req, res) {
            db.collection("aktiva_pingis").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
                res.render('pingis/slumpPlayers.ejs', { data: data });
            })
        })
    
    
        app.get('/pingis/register', function (req, res) {
            db.collection("aktiva_pingis").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
    
                res.render('pingis/register.ejs', { data: data });
            })
        })
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! STATS ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/pingis/statLanding', function (req, res) {
            res.render('pingis/statLanding.ejs');
        });
        
        app.get('/pingis/statsWeek', function (req, res) {
            if (err) throw err
            var datum = new Date();
            var vecka = moment(datum, "MM-DD-YYYY").week()
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
            vecka = datum.getFullYear() + ' - ' + vecka;
            db.collection("stats_pingis").find({'Vecka':vecka}).toArray(function(err,result){
                
            var allPlayers = [];
              var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
              
              options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                  allPlayers.includes(player)?null:allPlayers.push(player);
                })
              })
              
            var playerStatistics = calculatePlayer(result, allPlayers);
    
            var sorted = playerStatistics.sort((a, b) => { 
                    return b.Viktning > a.Viktning ?  1 
                         : a.Viktning > b.Viktning ?  -1
                         :0;                   
                });
            
            res.render('pingis/statWeek.ejs', {dataname:sorted, vecka: vecka})
                
            })
            
        })
    
        app.get('/pingis/historikinsamling', function(req, res) {
            var allPlayers = [];
    
            db.collection("stats_pingis").find().toArray(function(err,result){
                if(err) throw err
                var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
              
                options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                    arrayEv.forEach(player => {
                        allPlayers.includes(player)?null:allPlayers.push(player);
                    })
                })
                calculateColumnOne(result, allPlayers);
    
                // var historicStats = calculatePlayerForHistory(result, allPlayers);
            })
        })
    
        app.get('/pingis/statsMonth', function (req, res) {
            var datum = new Date();
    
            var månad = datum.getFullYear() + ' - ' + (datum.getMonth() + 1)
    
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? månad = '0' + månad : null;
            db.collection("stats_pingis").find({'Månad':månad}).toArray(function(err,result){
                
            var allPlayers = [];
              var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
              
              options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                  allPlayers.includes(player)?null:allPlayers.push(player);
                })
              })
              
            var playerStatistics = calculatePlayer(result, allPlayers);
    
            var sorted = playerStatistics.sort((a, b) => { 
                    return b.Viktning > a.Viktning ?  1 
                         : a.Viktning > b.Viktning ?  -1
                         :0;                   
                });
                
            res.render('pingis/statMonth.ejs', {dataname:sorted, månad: månad})
                
            })
    
        })
    
        app.get('/pingis/statsVroom', function (req, res) {
            db.collection("glass_axkid").find().sort({ 'vroomWinCount': -1 }).toArray(function (err, data) {
                if (err) throw err
                res.render("pingis/statVroom.ejs", { dataname: data })
            })
        })
    
    
        // app.get('/pingis/statsTotal', function (req, res) {
        //     db.collection("playerTotal").find({}).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        //         if (err) throw err
        //         res.render("pingis/statTotal.ejs", { dataname: data })
        //     })
        // })
        
        app.get('/pingis/statsTotal', function (req, res) {
            if (err) throw err
    
            db.collection("stats_pingis").find().toArray(function(err,result){
                
                var allPlayers = [];
                var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
              
                options.forEach(option => {
                    var arrayEv = [...new Set(result.map(item => item[option]))];
                    arrayEv.forEach(player => {
                        allPlayers.includes(player)?null:allPlayers.push(player);
                    })
                })
              
                var playerStatistics = calculatePlayer(result, allPlayers);
    
                var sorted = playerStatistics.sort((a, b) => { 
                    return b.Viktning > a.Viktning ?  1 
                         : a.Viktning > b.Viktning ?  -1
                         :0;                   
                });
            
                res.render('pingis/statTotal.ejs', {dataname:sorted})
            })
        })
      
        app.get('/pingis/allGames', function (req, res) {
    
            db.collection("stats_pingis").find({}).sort({ 'Tidstämpel': -1 }).toArray(function (err, data) {
                if (err) throw err
    
                res.render("pingis/allGames.ejs", { dataname: data, moment: moment })
            })
        })
    
    
            // CREATE - add new campground to DB
        app.post("/pingis/resultat", function (req, res) {
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
    
    
            db.collection("stats_pingis").insert(newPost, function (err, resDB) {
                if (err) throw err
                res.redirect("/pingis/reglanding");
            })
        })

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Carlpong Landing routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/carlpong', function (req, res) {
            
            var datum = new Date();
            var vecka = moment(datum, "MM-DD-YYYY").week()
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
            vecka = datum.getFullYear() + ' - ' + vecka;
            db.collection("stat_axkid").find({'Vecka':vecka}).toArray(function(err,result){
                
            var allPlayers = [];
                var options = ['Lag1Spelare1','Lag2Spelare1'];
                
                options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                    allPlayers.includes(player)?null:allPlayers.push(player);
                })
                })
                
            var playerStatistics = calculatePlayer(result, allPlayers);
    
            var sorted = playerStatistics.sort((a, b) => { 
                return b.Viktning > a.Viktning ?  1 
                        : a.Viktning > b.Viktning ?  -1
                        :0;                   
            });
            lastWeeksWinner = null;
            
            res.render('carlpong/index.ejs', {lastWeeksWinner:lastWeeksWinner});
            });
        });
    
        app.get('/carlpong/tusenklubben', function (req, res) {
            res.render('carlpong/tusenklubben.ejs');
        });
    
    
        app.get('/carlpong/reglanding', function (req, res) {
            res.render('carlpong/reglanding.ejs');
        });
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! carlpong ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        app.get('/carlpong/admin', function (req, res) {
            res.render('carlpong/adminLanding.ejs');
        });
    
        app.get("/carlpong/removeGame/:id", (req, res) => {
            //find the campground with provided id in DB
    
            var o_id = new mongo.ObjectId(req.params.id)
    
            // var parameters = req.params
    
            db.collection("stats_carlpong").deleteOne({ '_id': o_id }, function (err, data) {
                if (err) throw err
                res.render(__dirname + "/views/carlpong/removeGameLanding.ejs")
            });
        });
    
    
        //!History route
        app.get('/carlpong/history', function (req, res) {
            db.collection("playerWeek").distinct('vecka', function (err, veckor) {
                res.render('carlpong/history.ejs', { veckor: JSON.stringify(veckor) });
            })
        });
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! data-routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        app.get('/carlpong/data/vecka', function (req, res) {
            db.collection("playerWeek").find({}).sort({ 'vecka': -1, "Viktning": -1 }).toArray(function (err, data) {
                if (err) throw err
                res.json(data)
    
            })
        });
    
        app.get('/carlpong/data/month', function (req, res) {
            db.collection("playerMonth").find({}).sort({ 'Månad': -1, "Viktning": -1 }).toArray(function (err, data) {
                if (err) throw err
                res.json(data)
            })
        });
    
        app.get('/carlpong/data', function (req, res) {
            db.collection('stats_carlpong').find().sort({"Tidstämpel":1}).toArray(function(err,result){
                res.json(result);
            });
        });
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Nya spelare !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/carlpong/newPlayer', function (req, res) {
            res.render('carlpong/newPlayer.ejs');
        });
    
        app.get('/carlpong/newPlayerLanding', function (req, res) {
            res.render('carlpong/newPlayerLanding.ejs');
        });
    
        app.post("/carlpong/newPlayer", function (req, res) {
            var datum = new Date();
    
            var månad = datum.getFullYear() + ' - ' + (datum.getMonth() + 1)
            var vecka = moment(datum, "MM-DD-YYYY").week()
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
            vecka = datum.getFullYear() + ' - ' + vecka
    
            var newPlayer = { 'Spelare': req.body.playerNamn , 'Aktiv':true}
            db.collection("aktiva_carlpong").insert(newPlayer, function (err, resDB) {
                if (err) throw err
            })
    
            // var totalPlayerAdd = { "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0, "Procent": 0, "SpeladeMatcher": 0 }
            // db.collection("playerTotal").insert(totalPlayerAdd, function (err, resDB) {
            //     if (err) throw err
    
            // })
    
            // var monthPlayerAdd = { "Månad": månad, "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0 }
            // db.collection("playerMonth").insert(monthPlayerAdd, function (err, resDB) {
            //     if (err) throw err
            // })
    
            // var veckoPlayerAdd = { "vecka": vecka, "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0 }
            // db.collection("playerWeek").insert(veckoPlayerAdd, function (err, resDB) {
            //     if (err) throw err
            // })
    
            // var vroomPlayerAdd = { "Spelare": req.body.playerNamn, "vroomWinCount": 0, "vroomLostCount": 0, "bountyWinCount": 0, "bountyLostCount": 0 }
            // db.collection("glass_axkid").insert(vroomPlayerAdd, function (err, resDB) {
            //     if (err) throw err
            // })
    
            res.redirect("/carlpong/newPlayerLanding");
        })
    
    
        //! End Nya spelare !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Remove player !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get("/carlpong/remove/:id", (req, res) => {
            //find the campground with provided id in DB
    
            var o_id = new mongo.ObjectId(req.params.id)
            db.collection("aktiva_carlpong").update({ '_id': o_id }, {$set:{'Aktiv':false}}, function (err, data) {
                if (err) throw err
                res.render('carlpong/removePlayerLanding.ejs')
            })
        });
        
        app.get("/carlpong/activate/:id", (req, res) => {
            //find the campground with provided id in DB
    
            var o_id = new mongo.ObjectId(req.params.id)
            db.collection("aktiva_carlpong").update({ '_id': o_id }, {$set:{'Aktiv':true}}, function (err, data) {
                if (err) throw err
                res.render('carlpong/activatePlayerLanding.ejs')
            })
        });
    
        app.get('/carlpong/removePlayer', function (req, res) {
    
            db.collection("aktiva_carlpong").find({}).toArray(function (err, data) {
                if (err) throw err
                res.render('carlpong/removePlayer.ejs', { data: data });
            })
        });
    
        app.get('/carlpong/nyaslumpen', function (req, res) {
    
            db.collection("aktiva_carlpong").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
                res.render('carlpong/nyaslumpen.ejs', { data: data });
            })
        });
            app.get('/carlpong/slump', function (req, res) {
    
                res.render('carlpong/slump.ejs')
    
        });
        
       app.get('/carlpong/nyaslumpengetplayers', function (req, res) {
    
            db.collection("aktiva_carlpong").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
                res.json(data)
            })
        });
    
        //! End remove !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/carlpong/slumpPlayers', function (req, res) {
            db.collection("aktiva_carlpong").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
                res.render('carlpong/slumpPlayers.ejs', { data: data });
            })
        })
    
    
        app.get('/carlpong/register', function (req, res) {
            db.collection("aktiva_carlpong").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
    
                res.render('carlpong/register.ejs', { data: data });
            })
        })
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! STATS ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/carlpong/statLanding', function (req, res) {
            res.render('carlpong/statLanding.ejs');
        });
        
        app.get('/carlpong/statsWeek', function (req, res) {
            if (err) throw err
            var datum = new Date();
            var vecka = moment(datum, "MM-DD-YYYY").week()
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
            vecka = datum.getFullYear() + ' - ' + vecka;
            db.collection("stats_carlpong").find({'Vecka':vecka}).toArray(function(err,result){
                
            var allPlayers = [];
              var options = ['Lag1Spelare1','Lag2Spelare1'];
              
              options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                  allPlayers.includes(player)?null:allPlayers.push(player);
                })
              })
              
            var playerStatistics = calculatePlayer(result, allPlayers);
    
            var sorted = playerStatistics.sort((a, b) => { 
                    return b.Viktning > a.Viktning ?  1 
                         : a.Viktning > b.Viktning ?  -1
                         :0;                   
                });
            
            res.render('carlpong/statWeek.ejs', {dataname:sorted, vecka: vecka})
                
            })
            
        })
    
        app.get('/carlpong/historikinsamling', function(req, res) {
            var allPlayers = [];
    
            db.collection("stats_carlpong").find().toArray(function(err,result){
                if(err) throw err
                var options = ['Lag1Spelare1','Lag2Spelare1'];
              
                options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                    arrayEv.forEach(player => {
                        allPlayers.includes(player)?null:allPlayers.push(player);
                    })
                })
                calculateColumnOne(result, allPlayers);
    
                // var historicStats = calculatePlayerForHistory(result, allPlayers);
            })
        })
    
        app.get('/carlpong/statsMonth', function (req, res) {
            var datum = new Date();
    
            var månad = datum.getFullYear() + ' - ' + (datum.getMonth() + 1)
    
            // moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? månad = '0' + månad : null;
            db.collection("stats_carlpong").find({'Månad':månad}).toArray(function(err,result){
                
            var allPlayers = [];
              var options = ['Lag1Spelare1','Lag2Spelare1'];
              
              options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                  allPlayers.includes(player)?null:allPlayers.push(player);
                })
              })
              
            var playerStatistics = calculatePlayer(result, allPlayers);
    
            var sorted = playerStatistics.sort((a, b) => { 
                    return b.Viktning > a.Viktning ?  1 
                         : a.Viktning > b.Viktning ?  -1
                         :0;                   
                });
                
            res.render('carlpong/statMonth.ejs', {dataname:sorted, månad: månad})
                
            })
    
        })
    
        app.get('/carlpong/statsVroom', function (req, res) {
            db.collection("glass_axkid").find().sort({ 'vroomWinCount': -1 }).toArray(function (err, data) {
                if (err) throw err
                res.render("carlpong/statVroom.ejs", { dataname: data })
            })
        })
    
    
        // app.get('/carlpong/statsTotal', function (req, res) {
        //     db.collection("playerTotal").find({}).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        //         if (err) throw err
        //         res.render("carlpong/statTotal.ejs", { dataname: data })
        //     })
        // })
        
        app.get('/carlpong/statsTotal', function (req, res) {
            if (err) throw err
    
            db.collection("stats_carlpong").find().toArray(function(err,result){
                
                var allPlayers = [];
                var options = ['Lag1Spelare1','Lag2Spelare1'];
              
                options.forEach(option => {
                    var arrayEv = [...new Set(result.map(item => item[option]))];
                    arrayEv.forEach(player => {
                        allPlayers.includes(player)?null:allPlayers.push(player);
                    })
                })
              
                var playerStatistics = calculatePlayer(result, allPlayers);
    
                var sorted = playerStatistics.sort((a, b) => { 
                    return b.Viktning > a.Viktning ?  1 
                         : a.Viktning > b.Viktning ?  -1
                         :0;                   
                });
            
                res.render('carlpong/statTotal.ejs', {dataname:sorted})
            })
        })
      
        app.get('/carlpong/allGames', function (req, res) {
    
            db.collection("stats_carlpong").find({}).sort({ 'Tidstämpel': -1 }).toArray(function (err, data) {
                if (err) throw err
    
                res.render("carlpong/allGames.ejs", { dataname: data, moment: moment })
            })
        })
    
    
            // CREATE - add new campground to DB
        app.post("/carlpong/resultat", function (req, res) {
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
                // "Lag1Spelare2": req.body.player2Team1,
                "Lag1": req.body.goalTeam1,
                "Lag2Spelare1": req.body.player1Team2,
                // "Lag2Spelare2": req.body.player2Team2,
                "Lag2": req.body.goalTeam2,
                "Lag1Matchvinst": Lag1Matchvinst,
                "Lag2Matchvinst": Lag2Matchvinst,
                "Datum": datum,
                "Månad": månad,
                "Vecka": vecka
            };
    
            var spelare = {
                spelare1: req.body.player1Team1,
                // spelare2: req.body.player2Team1,
                spelare3: req.body.player1Team2,
                // spelare4: req.body.player2Team2
            }
            // var spelareArr = [req.body.player1Team1, req.body.player2Team1, req.body.player1Team2, req.body.player2Team2]
            var spelareArr = [req.body.player1Team1, req.body.player1Team2]
    
    
            db.collection("stats_carlpong").insert(newPost, function (err, resDB) {
                if (err) throw err
                res.redirect("/carlpong/reglanding");
            })
        })

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Carlpong Landing routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/padel', function (req, res) {
            
            var datum = new Date();
            var vecka = moment(datum, "MM-DD-YYYY").week()
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
            vecka = datum.getFullYear() + ' - ' + vecka;
            db.collection("stat_axkid").find({'Vecka':vecka}).toArray(function(err,result){
                
            var allPlayers = [];
                var options = ['Lag1Spelare1','Lag2Spelare1'];
                
                options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                    allPlayers.includes(player)?null:allPlayers.push(player);
                })
                })
                
            var playerStatistics = calculatePlayer(result, allPlayers);
    
            var sorted = playerStatistics.sort((a, b) => { 
                return b.Viktning > a.Viktning ?  1 
                        : a.Viktning > b.Viktning ?  -1
                        :0;                   
            });
            lastWeeksWinner = null;
            
            res.render('padel/index.ejs', {lastWeeksWinner:lastWeeksWinner});
            });
        });
    
        app.get('/padel/tusenklubben', function (req, res) {
            res.render('padel/tusenklubben.ejs');
        });
    
    
        app.get('/padel/reglanding', function (req, res) {
            res.render('padel/reglanding.ejs');
        });
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! padel ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        app.get('/padel/admin', function (req, res) {
            res.render('padel/adminLanding.ejs');
        });
    
        app.get("/padel/removeGame/:id", (req, res) => {
            //find the campground with provided id in DB
    
            var o_id = new mongo.ObjectId(req.params.id)
    
            // var parameters = req.params
    
            db.collection("stats_padel").deleteOne({ '_id': o_id }, function (err, data) {
                if (err) throw err
                res.render(__dirname + "/views/padel/removeGameLanding.ejs")
            });
        });
    
    
        //!History route
        app.get('/padel/history', function (req, res) {
            db.collection("playerWeek").distinct('vecka', function (err, veckor) {
                res.render('padel/history.ejs', { veckor: JSON.stringify(veckor) });
            })
        });
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! data-routes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        app.get('/padel/data/vecka', function (req, res) {
            db.collection("playerWeek").find({}).sort({ 'vecka': -1, "Viktning": -1 }).toArray(function (err, data) {
                if (err) throw err
                res.json(data)
    
            })
        });
    
        app.get('/padel/data/month', function (req, res) {
            db.collection("playerMonth").find({}).sort({ 'Månad': -1, "Viktning": -1 }).toArray(function (err, data) {
                if (err) throw err
                res.json(data)
            })
        });
    
        app.get('/padel/data', function (req, res) {
            db.collection('stats_padel').find().sort({"Tidstämpel":1}).toArray(function(err,result){
                res.json(result);
            });
        });
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Nya spelare !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/padel/newPlayer', function (req, res) {
            res.render('padel/newPlayer.ejs');
        });
    
        app.get('/padel/newPlayerLanding', function (req, res) {
            res.render('padel/newPlayerLanding.ejs');
        });
    
        app.post("/padel/newPlayer", function (req, res) {
            var datum = new Date();
    
            var månad = datum.getFullYear() + ' - ' + (datum.getMonth() + 1)
            var vecka = moment(datum, "MM-DD-YYYY").week()
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
            vecka = datum.getFullYear() + ' - ' + vecka
    
            var newPlayer = { 'Spelare': req.body.playerNamn , 'Aktiv':true}
            db.collection("aktiva_padel").insert(newPlayer, function (err, resDB) {
                if (err) throw err
            })
    
            // var totalPlayerAdd = { "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0, "Procent": 0, "SpeladeMatcher": 0 }
            // db.collection("playerTotal").insert(totalPlayerAdd, function (err, resDB) {
            //     if (err) throw err
    
            // })
    
            // var monthPlayerAdd = { "Månad": månad, "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0 }
            // db.collection("playerMonth").insert(monthPlayerAdd, function (err, resDB) {
            //     if (err) throw err
            // })
    
            // var veckoPlayerAdd = { "vecka": vecka, "Spelare": req.body.playerNamn, "Vinster": 0, "Förluster": 0, "GjordaMål": 0, "InsläpptaMål": 0, "Viktning": 0 }
            // db.collection("playerWeek").insert(veckoPlayerAdd, function (err, resDB) {
            //     if (err) throw err
            // })
    
            // var vroomPlayerAdd = { "Spelare": req.body.playerNamn, "vroomWinCount": 0, "vroomLostCount": 0, "bountyWinCount": 0, "bountyLostCount": 0 }
            // db.collection("glass_axkid").insert(vroomPlayerAdd, function (err, resDB) {
            //     if (err) throw err
            // })
    
            res.redirect("/padel/newPlayerLanding");
        })
    
    
        //! End Nya spelare !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Remove player !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get("/padel/remove/:id", (req, res) => {
            //find the campground with provided id in DB
    
            var o_id = new mongo.ObjectId(req.params.id)
            db.collection("aktiva_padel").update({ '_id': o_id }, {$set:{'Aktiv':false}}, function (err, data) {
                if (err) throw err
                res.render('padel/removePlayerLanding.ejs')
            })
        });
        
        app.get("/padel/activate/:id", (req, res) => {
            //find the campground with provided id in DB
    
            var o_id = new mongo.ObjectId(req.params.id)
            db.collection("aktiva_padel").update({ '_id': o_id }, {$set:{'Aktiv':true}}, function (err, data) {
                if (err) throw err
                res.render('padel/activatePlayerLanding.ejs')
            })
        });
    
        app.get('/padel/removePlayer', function (req, res) {
    
            db.collection("aktiva_padel").find({}).toArray(function (err, data) {
                if (err) throw err
                res.render('padel/removePlayer.ejs', { data: data });
            })
        });
    
        app.get('/padel/nyaslumpen', function (req, res) {
    
            db.collection("aktiva_padel").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
                res.render('padel/nyaslumpen.ejs', { data: data });
            })
        });
            app.get('/padel/slump', function (req, res) {
    
                res.render('padel/slump.ejs')
    
        });
        
       app.get('/padel/nyaslumpengetplayers', function (req, res) {
    
            db.collection("aktiva_padel").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
                res.json(data)
            })
        });
    
        //! End remove !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/padel/slumpPlayers', function (req, res) {
            db.collection("aktiva_padel").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
                res.render('padel/slumpPlayers.ejs', { data: data });
            })
        })
    
    
        app.get('/padel/register', function (req, res) {
            db.collection("aktiva_padel").find({}).sort({ 'Spelare': 1 }).toArray(function (err, data) {
                if (err) throw err
    
                res.render('padel/register.ejs', { data: data });
            })
        })
    
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! STATS ROUTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
        app.get('/padel/statLanding', function (req, res) {
            res.render('padel/statLanding.ejs');
        });
        
        app.get('/padel/statsWeek', function (req, res) {
            if (err) throw err
            var datum = new Date();
            var vecka = moment(datum, "MM-DD-YYYY").week()
            moment(datum, "MM-DD-YYYY").week().toString().length == 1 ? vecka = '0' + vecka : null;
            vecka = datum.getFullYear() + ' - ' + vecka;
            db.collection("stats_padel").find({'Vecka':vecka}).toArray(function(err,result){
                
            var allPlayers = [];
            var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1','Lag2Spelare2'];
              
              options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                  allPlayers.includes(player)?null:allPlayers.push(player);
                })
              })
              
            var playerStatistics = calculatePlayer(result, allPlayers);
    
            var sorted = playerStatistics.sort((a, b) => { 
                    return b.Viktning > a.Viktning ?  1 
                         : a.Viktning > b.Viktning ?  -1
                         :0;                   
                });
            
            res.render('padel/statWeek.ejs', {dataname:sorted, vecka: vecka})
                
            })
            
        })
    
        app.get('/padel/historikinsamling', function(req, res) {
            var allPlayers = [];
    
            db.collection("stats_padel").find().toArray(function(err,result){
                if(err) throw err
                var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1','Lag2Spelare2'];
              
                options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                    arrayEv.forEach(player => {
                        allPlayers.includes(player)?null:allPlayers.push(player);
                    })
                })
                calculateColumnOne(result, allPlayers);
    
                // var historicStats = calculatePlayerForHistory(result, allPlayers);
            })
        })
    
        app.get('/padel/statsMonth', function (req, res) {
            var datum = new Date();
    
            var månad = datum.getFullYear() + ' - ' + (datum.getMonth() + 1)
            db.collection("stats_padel").find({'Månad':månad}).toArray(function(err,result){
                
            var allPlayers = [];
              var options = ['Lag1Spelare1','Lag2Spelare1'];
              
              options.forEach(option => {
                var arrayEv = [...new Set(result.map(item => item[option]))];
                arrayEv.forEach(player => {
                  allPlayers.includes(player)?null:allPlayers.push(player);
                })
              })
              
            var playerStatistics = calculatePlayer(result, allPlayers);
    
            var sorted = playerStatistics.sort((a, b) => { 
                    return b.Viktning > a.Viktning ?  1 
                         : a.Viktning > b.Viktning ?  -1
                         :0;                   
                });
                
            res.render('padel/statMonth.ejs', {dataname:sorted, månad: månad})
                
            })
    
        })
    
        app.get('/padel/statsVroom', function (req, res) {
            db.collection("glass_axkid").find().sort({ 'vroomWinCount': -1 }).toArray(function (err, data) {
                if (err) throw err
                res.render("padel/statVroom.ejs", { dataname: data })
            })
        })
    
    
        // app.get('/padel/statsTotal', function (req, res) {
        //     db.collection("playerTotal").find({}).sort({ 'Viktning': -1 }).toArray(function (err, data) {
        //         if (err) throw err
        //         res.render("padel/statTotal.ejs", { dataname: data })
        //     })
        // })
        
        app.get('/padel/statsTotal', function (req, res) {
            if (err) throw err
    
            db.collection("stats_padel").find().toArray(function(err,result){
                
                var allPlayers = [];
                var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1','Lag2Spelare2'];
              
                options.forEach(option => {
                    var arrayEv = [...new Set(result.map(item => item[option]))];
                    arrayEv.forEach(player => {
                        allPlayers.includes(player)?null:allPlayers.push(player);
                    })
                })
              
                var playerStatistics = calculatePlayer(result, allPlayers);
    
                var sorted = playerStatistics.sort((a, b) => { 
                    return b.Viktning > a.Viktning ?  1 
                         : a.Viktning > b.Viktning ?  -1
                         :0;                   
                });
            
                res.render('padel/statTotal.ejs', {dataname:sorted})
            })
        })
      
        app.get('/padel/allGames', function (req, res) {
    
            db.collection("stats_padel").find({}).sort({ 'Tidstämpel': -1 }).toArray(function (err, data) {
                if (err) throw err
    
                res.render("padel/allGames.ejs", { dataname: data, moment: moment })
            })
        })
    
    
            // CREATE - add new campground to DB
        app.post("/padel/resultat", function (req, res) {
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
                // spelare2: req.body.player2Team1,
                spelare3: req.body.player1Team2,
                // spelare4: req.body.player2Team2
            }
            // var spelareArr = [req.body.player1Team1, req.body.player2Team1, req.body.player1Team2, req.body.player2Team2]
            var spelareArr = [req.body.player1Team1, req.body.player1Team2]
    
    
            db.collection("stats_padel").insert(newPost, function (err, resDB) {
                if (err) throw err
                res.redirect("/padel/reglanding");
            })
        })
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //! Starcraft-slumpen !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    app.get('/starcraft/', function (req, res) {
        res.redirect('/starcraft/register');
    });

    app.get('/starcraft/register', function (req, res) {
        db.collection('starcraft_players').find().toArray(function (err, players) {
            if (err) throw err
            res.render('starcraft/register.ejs', {players : players});
        })
    });

    app.get('/starcraft/stats', function (req, res) {
        db.collection('starcraft_register').find().toArray(function (err, data) {
            if (err) throw err
            res.render('starcraft/stats.ejs', {data : data});
        })
    });

    app.get('/starcraft/slump', function (req, res) {
        res.render('starcraft/slump.ejs');
    });

    app.post('/starcraft/register', function (req, res) {
        var datum = new Date();
        var newPost = {
            "Tidstämpel": datum,
            "Lag1Spelare1": req.body.player1Team1,
            "Lag1Spelare1Ras": req.body.player1Team1race,
            "Lag1Spelare2": req.body.player2Team1,
            "Lag1Spelare2Ras": req.body.player2Team1race,
            "Lag1Spelare3": req.body.player3Team1,
            "Lag1Spelare3Ras": req.body.player3Team1race,
            "Lag2Spelare1": req.body.player1Team2,
            "Lag2Spelare1Ras": req.body.player1Team2race,
            "Lag2Spelare2": req.body.player2Team2,
            "Lag2Spelare2Ras": req.body.player2Team2race,
            "Lag2Spelare3": req.body.player3Team2,
            "Lag2Spelare3Ras": req.body.player3Team2race,

        };

        if (req.body.optradio === "team1Win") {
            newPost["VinstLag1"] = 1, newPost["VinstLag2"] = 0;
        }
        else if (req.body.optradio === "team2Win") {
            newPost["VinstLag1"] = 0, newPost["VinstLag2"] = 1;
        }

        db.collection('starcraft_register').insertOne(newPost, function (error, response) {
            if(error) {
                console.log('Error occurred while inserting');
                // return 
            } else {
                res.redirect("/starcraft/stats")
              // return 
            }
        });
    });
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