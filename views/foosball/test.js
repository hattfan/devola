var matches = [ { '_id': '5cfe2ddd932afe001546e733',
    'Tidstämpel': '2019-06-10T10:15:57.303Z',
    'Lag1Spelare1': 'David Carlsson',
    'Lag1Spelare2': 'Christoffer Bengtsson',
    'Lag1': 6,
    'Lag2Spelare1': 'Patrik Nilsson',
    'Lag2Spelare2': 'Kajsa',
    'Lag2': 0,
    'Lag1Matchvinst': 1,
    'Lag2Matchvinst': 0,
    'Månad': '2019 - 6',
    'Vecka': '2019 - 24' },
  { '_id': '5cfe2dfc932afe001546e734',
    'Tidstämpel': '2019-06-10T10:16:28.657Z',
    'Lag1Spelare1': 'Christoffer Bengtsson',
    'Lag1Spelare2': 'Patrik Nilsson',
    'Lag1': 6,
    'Lag2Spelare1': 'David Carlsson',
    'Lag2Spelare2': 'Kajsa',
    'Lag2': 1,
    'Lag1Matchvinst': 1,
    'Lag2Matchvinst': 0,
    'Månad': '2019 - 6',
    'Vecka': '2019 - 24' },
  { '_id': '5cfe2e36932afe001546e735',
    'Tidstämpel': '2019-06-10T10:17:26.974Z',
    'Lag1Spelare1': 'Helena Pixsjö',
    'Lag1Spelare2': 'Ola Karlsson',
    'Lag1': 6,
    'Lag2Spelare1': 'Tobbe Spaaarge',
    'Lag2Spelare2': 'Magnus Karlsson',
    'Lag2': 4,
    'Lag1Matchvinst': 1,
    'Lag2Matchvinst': 0,
    'Månad': '2019 - 6',
    'Vecka': '2019 - 24' },
  { '_id': '5cfe3014932afe001546e736',
    'Tidstämpel': '2019-06-10T10:25:24.036Z',
    'Lag1Spelare1': 'David Carlsson',
    'Lag1Spelare2': 'Helena Pixsjö',
    'Lag1': 6,
    'Lag2Spelare1': 'Magnus Karlsson',
    'Lag2Spelare2': 'Patrik Nilsson',
    'Lag2': 2,
    'Lag1Matchvinst': 1,
    'Lag2Matchvinst': 0,
    'Månad': '2019 - 6',
    'Vecka': '2019 - 24' },
  { '_id': '5cff7aaa6877de00152be89a',
    'Tidstämpel': '2019-06-11T09:55:54.217Z',
    'Lag1Spelare1': 'David Carlsson',
    'Lag1Spelare2': 'Helena Pixsjö',
    'Lag1': 6,
    'Lag2Spelare1': 'Tobbe Spaaarge',
    'Lag2Spelare2': 'Magnus Karlsson',
    'Lag2': 4,
    'Lag1Matchvinst': 1,
    'Lag2Matchvinst': 0,
    'Månad': '2019 - 6',
    'Vecka': '2019 - 24' },
  { '_id': '5cff7ed46877de00152be89f',
    'Tidstämpel': '2019-06-11T10:13:40.526Z',
    'Lag1Spelare1': 'Christoffer Bengtsson',
    'Lag1Spelare2': 'David Carlsson',
    'Lag1': 6,
    'Lag2Spelare1': 'Helena Pixsjö',
    'Lag2Spelare2': 'Ola Karlsson',
    'Lag2': 4,
    'Lag1Matchvinst': 1,
    'Lag2Matchvinst': 0,
    'Månad': '2019 - 6',
    'Vecka': '2019 - 24' },
  { '_id': '5cff7ee36877de00152be8a0',
    'Tidstämpel': '2019-06-11T10:13:55.302Z',
    'Lag1Spelare1': 'Ola Karlsson',
    'Lag1Spelare2': 'Magnus Karlsson',
    'Lag1': 6,
    'Lag2Spelare1': 'Christoffer Bengtsson',
    'Lag2Spelare2': 'Tobbe Spaaarge',
    'Lag2': 4,
    'Lag1Matchvinst': 1,
    'Lag2Matchvinst': 0,
    'Månad': '2019 - 6',
    'Vecka': '2019 - 24' } ]
  
  var allPlayers = [];
  var options = ['Lag1Spelare1','Lag1Spelare2','Lag2Spelare1', 'Lag2Spelare2'];
  console.log(typeof(matches))
  
  options.forEach(option => {
    var arrayEv = [...new Set(matches.map(item => item[option]))];
    arrayEv.forEach(player => {
      allPlayers.includes(player)?null:allPlayers.push(player);
    })
  })
  
  // var playerStatistics = calculatePlayer();
  // console.log(playerStatistics);
  
  console.log(typeof(matches))
  
//   function calculatePlayer(matches, allPlayers){
//     var vinster = 0, losses = 0 ,gjordaMål = 0,insläpptaMål = 0, spelade = 0, procent; 
//     var allPlayersStats = [];
//     matches.forEach(match => {
//         allPlayers.forEach(player => {
//           if (match['Lag1Spelare1'] == player || match['Lag1Spelare2'] == player) {
//                 if (match['Lag1Matchvinst'] > match['Lag2Matchvinst']) {
//                     vinster = vinster + 1;
//                     gjordaMål = gjordaMål + match['Lag1'];
//                     insläpptaMål = insläpptaMål + match['Lag2'];
//                 } else if (match['Lag1Matchvinst'] < match['Lag2Matchvinst']) {
//                       losses = losses + 1;  
//                       gjordaMål = gjordaMål + match['Lag1'];
//                       insläpptaMål = insläpptaMål + match['Lag2'];
//                 }
//             }
//             else if (match['Lag2Spelare1'] == player || match['Lag2Spelare2'] == player) {
//                 if (match['Lag1Matchvinst'] < match['Lag2Matchvinst']) {
//                       vinster = vinster + 1;
//                       gjordaMål = gjordaMål + match['Lag2'];
//                       insläpptaMål = insläpptaMål + match['Lag1'];
//                 } else if (match['Lag1Matchvinst'] > match['Lag2Matchvinst']) {
//                       losses = losses + 1;  
//                       gjordaMål = gjordaMål + match['Lag2'];
//                       insläpptaMål = insläpptaMål + match['Lag1'];
//                 }
//             }
  
//             var viktning = (Math.round((Math.pow((vinster / (vinster + losses)), 3) * vinster) * 100) / 100 + (gjordaMål - insläpptaMål) * 0.001)
//             procent = Math.round(vinster / (vinster + losses) * 100) / 100
//             var query = {
//               'Spelare' : player,
//               'Vinster': vinster,
//               'Förluster': losses,
//               'GjordaMål': gjordaMål,
//               'InsläpptaMål': insläpptaMål,
//               'Viktning': viktning,
//               'Procent': procent,
//               'SpeladeMatcher': (vinster + losses)
//           }
//           allPlayersStats.push(query)
//         })
        
    
      
//       return allPlayersStats;
//     })
//   }


//   // var spelareArr = ['Lag1Spelare1', 'Lag1Spelare2', 'Lag2Spelare1', 'Lag2Spelare2'];
  
//   // var spelareloggade = [], insertDB = {};
//   // db.collection('playerWeek').find({ 'vecka': vecka }).toArray(function (err, res) {
//   //     if (err) throw err
// // var pushArr = [];
// // for (const key in spelare) {
// //   if (spelare.hasOwnProperty(key)) {
// //       const spelarenr = spelare[key];
// //       res.forEach(spelarStat => {
// //           if (Object.values(spelarStat).indexOf(spelarenr) > -1) {
// //               spelareloggade.push(spelarenr)
// //               var query = evaluate(spelare, spelarStat, req, Lag1Matchvinst, Lag2Matchvinst)
// //               // console.log(query)
// //               pushArr.push(query)
// //               db.collection('playerWeek').update({ '_id': spelarStat['_id'] }, {
// //                   $set: {
// //                       'Vinster': query.Vinster, 'Förluster': query['Förluster'],
// //                       'GjordaMål': query['GjordaMål'], 'InsläpptaMål': query['InsläpptaMål'], 'Viktning': query['Viktning']
// //                   }
// //               }, function (err, res) {
// //                   if (err) throw err
// //                   // console.log('Updated: ' + res.result.nModified + ' - ' + spelarStat.Spelare)
// //               })
// //           }
// //       })
// //   };
//   //     }


//   // function evaluate(spelare,) {
//   // var vinster = x['Vinster'], losses = x['Förluster'], gjordaMål = Number(x['GjordaMål']), insläpptaMål = Number(x['InsläpptaMål']), procent, spelade
//   // if (x['Spelare'] == spelare.spelare1 || x['Spelare'] == spelare.spelare2) {
//   //     if (Lag1Matchvinst > Lag2Matchvinst) {
//   //         vinster = x['Vinster'] + 1;
//   //         gjordaMål = Number(x['GjordaMål']) + Number(req.body.goalTeam1)
//   //         insläpptaMål = Number(x['InsläpptaMål']) + Number(req.body.goalTeam2)
//   //     } else if (Lag1Matchvinst < Lag2Matchvinst) {
//   //         losses = x['Förluster'] + 1
//   //         gjordaMål = Number(x['GjordaMål']) + Number(req.body.goalTeam2)
//   //         insläpptaMål = Number(x['InsläpptaMål']) + Number(req.body.goalTeam1)
//   //     }
//   // }
//   // else if (x['Spelare'] == spelare.spelare3 || x['Spelare'] == spelare.spelare4) {
//   //     if (Lag1Matchvinst < Lag2Matchvinst) {
//   //         vinster = x['Vinster'] + 1;
//   //         gjordaMål = Number(x['GjordaMål']) + Number(req.body.goalTeam1)
//   //         insläpptaMål = Number(x['InsläpptaMål']) + Number(req.body.goalTeam2)
//   //     } else if (Lag1Matchvinst > Lag2Matchvinst) {
//   //         losses = x['Förluster'] + 1
//   //         gjordaMål = Number(x['GjordaMål']) + Number(req.body.goalTeam2)
//   //         insläpptaMål = Number(x['InsläpptaMål']) + Number(req.body.goalTeam1)
//   //     }
//   // }

//   // viktning = (Math.round((Math.pow((vinster / (vinster + losses)), 3) * vinster) * 100) / 100 + (gjordaMål - insläpptaMål) * 0.001)
//   // procent = Math.round(vinster / (vinster + losses) * 100) / 100

//   // var query = {
//   //     'Vinster': vinster,
//   //     'Förluster': losses,
//   //     'GjordaMål': gjordaMål,
//   //     'InsläpptaMål': insläpptaMål,
//   //     'Viktning': viktning,
//   //     'Procent': procent,
//   //     'SpeladeMatcher': (vinster + losses)
//   // }

//   // return query