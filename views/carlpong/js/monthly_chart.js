fetch('../carlpong/data',{credentials: 'same-origin'})
    .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            
            // Examine the text in the response
            response.json().then(function (data) {
                var monthlyStats = parseDataForCharts(getWinnerByPeriod(data, "Månad"));
                googleChart("", monthlyStats)
            });
        }
    )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });

function parseDataForCharts(data){
    var stats = [];
    Object.keys(data).forEach(key => {
        if(data[key] > 0){
            stats.push([key, data[key]]);
        }
    })
    return stats;
}
function getWinnerByPeriod(data, period){
    var uniquePeriods = [...new Set(data.map(item => item[period]))];
    var playerPeriodWins = {};
    getUniquePlayers(data).forEach(player => playerPeriodWins[player] = 0)
    uniquePeriods.forEach(uniquePeriod => {
        var dataPerPeriod = data.filter(rows => rows[period] === uniquePeriod)
        var uniquePlayers = getUniquePlayers(dataPerPeriod);
        var stats = calculatePlayer(dataPerPeriod, uniquePlayers);
        playerPeriodWins[stats[0].Spelare] = playerPeriodWins[stats[0].Spelare] + 1;
    });
    var playerPeriodWinsSorted = sortObject(playerPeriodWins);
    return playerPeriodWinsSorted;
}

function sortObject(sortableObject){
    var sortable = [];
    for (var item in sortableObject) {
        sortable.push([item, sortableObject[item]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    var objSorted = {}
    sortable.forEach(function(item){
        objSorted[item[0]]=item[1]
    })

    return objSorted;
}

function googleChart(veckoData, monthData) {
    // Load Charts and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    google.charts.setOnLoadCallback(drawChartMånad);

    function drawChartMånad() {
        // console.log(veckoData)

        // Create the data table for Sarah's pizza.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows(monthData);
        var options = {
            backgroundColor: { fill: 'transparent' },
            is3D: true,
            legend: {
                alignment: "center",
                position: "right",
                textStyle: {
                    color: 'white', 
                },
                maxLines: 20
            }
        };

        // Instantiate and draw the chart for Sarah's pizza.
        var chart = new google.visualization.PieChart(document.getElementById('månad_chart'));
        chart.draw(data, options);
    }

    $(window).resize(function(){
        drawChartMånad();
      });
}
function getUniquePlayers(data){
    var uniquePlayers = []; 
    var playerOptions = ['Lag1Spelare1','Lag2Spelare1'];
    playerOptions.forEach( playeroption => {
        [...new Set(data.map(item => item[playeroption]))].forEach(player => {
            !uniquePlayers.includes(player)?uniquePlayers.push(player):null;
        })
    })
    return uniquePlayers;    
};

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
    return allPlayersStats.sort((a,b) => b['Viktning'] - a['Viktning']);
}