var express = require("express"),
    app = express(),
    mongo = require('mongodb'),
    MongoClient = require('mongodb').MongoClient;

var url = "mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/foosball" 

MongoClient.connect(url, (err, client) => {
    var db = client.db('foosball');
    if (err) throw err;
    console.log('inside function')
}).then({
    console.log('after function')
})


// app.get('/foosball', function (req, res) {
//     res.render('foosball/index.ejs');
// });

// var port = process.env.PORT || 3030; 

// app.listen(port, process.env.IP, function () {
//     var appConsoleMsg = 'Hemsidan startad: ';
//     appConsoleMsg += process.env.IP + ':' + port;
//     console.log(appConsoleMsg);
// });

