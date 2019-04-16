var races = ["Zerg", "Protoss", "Terran"];

fetch('../starcraft/data',{credentials: 'same-origin'})
  .then(
    function (response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function (data) {
        // document.querySelector("spinner-border")
        var resultat = calculateWins(data);
        document.querySelector(".spinner-container").style.display = "none";
        document.querySelector(".chart-container").style.display = "";
        document.querySelector(".top-charts").style.display = "";
        document.querySelector(".pie-charts-container").style.display = "";
        document.querySelectorAll(".chart-label").forEach(label => label.style.display = "")

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Larzons', 'Nymsons'],
            datasets: [{
              label: 'Vunna games',
              data: [resultat.Lag1, resultat.Lag2],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
        var formData = calculateFormLast10Games(data);
        debugger;
        new Chart(document.getElementById("line-chart"), {
          type: 'line',
          data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [{
              data: formData,
              label: "Form",
              borderColor: "#3e95cd",
              fill: false
            }
            ]
          },
          options: {
            title: {
              display: false,
              text: 'Form senaste 10'
            }
          }
        });
        var players = ["Larz","Korben","Hatten"];
        players.forEach(player => {
          races.forEach(race => {
            var winData = evaluateStatistics(data,player,race)
            pieChartCreator(player, race, winData);
          });
        });
        var winData = evaluateStatistics(data,"Danne","Terran");
        pieChartCreator("Danne","Terran", winData);
      });
    }
  )
  .catch(function (err) {
    console.log('Fetch Error :-S', err);
  });


function pieChartCreator(playerName, raceName, playerAndRaceData){
  var labelName = `${playerName} - ${raceName} stats`;
  new Chart(document.querySelector(`#${playerName}-${raceName}`), {
    type: 'pie',
    data: {
      labels: ["Win", "Losses"],
      datasets: [{
        label: labelName,
        backgroundColor: ["green", "red"],
        data: [playerAndRaceData["wins"], playerAndRaceData["losses"]]
      }]
    },
    options: {
      title: {
        display: true,
        text: labelName
      }
    },
  });
}

// Helper functions
function evaluateStatistics(statistics, player, race ){
  var playerOptions = ["Lag1Spelare1","Lag1Spelare2","Lag2Spelare1","Lag2Spelare2"];
  var winCount = 0, looseCount = 0;
  statistics.forEach(row => {
    if(row.Lag1Spelare1 === player && row.Lag1Spelare1Ras === race  && row.VinstLag1 === 1) winCount += 1;
    else if(row.Lag1Spelare1 === player && row.Lag1Spelare1Ras === race  && row.VinstLag1 === 0) looseCount += 1;
    else if(row.Lag1Spelare2 === player && row.Lag1Spelare2Ras === race  && row.VinstLag1 === 1) winCount += 1;
    else if(row.Lag1Spelare2 === player && row.Lag1Spelare2Ras === race  && row.VinstLag1 === 0) looseCount += 1;
    //
    else if(row.Lag2Spelare1 === player && row.Lag2Spelare1Ras === race  && row.VinstLag2 === 1) winCount += 1;
    else if(row.Lag2Spelare1 === player && row.Lag2Spelare1Ras === race  && row.VinstLag2 === 0) looseCount += 1;
    else if(row.Lag2Spelare2 === player && row.Lag2Spelare2Ras === race  && row.VinstLag2 === 1) winCount += 1;
    else if(row.Lag2Spelare2 === player && row.Lag2Spelare2Ras === race  && row.VinstLag2 === 0) looseCount += 1;

  })
  var results = {
    "wins":winCount,
    "losses":looseCount,
  }
  return results;
}

function calculateWins(inputData) {
  var vinsterLag1 = 0;
  var vinsterLag2 = 0;
  inputData.forEach(row => {

    vinsterLag1 = vinsterLag1 + row.VinstLag1;
    vinsterLag2 = vinsterLag2 + row.VinstLag2;
  })
  var vinster = {
    "Lag1": vinsterLag1,
    "Lag2": vinsterLag2,
  }

  return vinster;
}

function calculateFormLast10Games(inputData){
  var formResult = [0];
  for (let i = 1; i < inputData.length; i++) {
    if(inputData[i].Lag1Spelare1 === "Larz" && inputData[i].Lag1Spelare2 === "Korben" && inputData[i].VinstLag1 === 1) formResult[i] = formResult[i-1] + 1;
    else if(inputData[i].Lag1Spelare1 === "Korben" && inputData[i].Lag1Spelare2 === "Larz" && inputData[i].VinstLag1 === 1) formResult[i] = formResult[i-1] + 1;
    else if(inputData[i].Lag2Spelare1 === "Larz" && inputData[i].Lag2Spelare2 === "Korben" && inputData[i].VinstLag2 === 1) formResult[i] = formResult[i-1] + 1;
    else if(inputData[i].Lag2Spelare1 === "Korben" && inputData[i].Lag2Spelare2 === "Larz" && inputData[i].VinstLag2 === 1) formResult[i] = formResult[i-1] + 1;
    else if(inputData[i].Lag1Spelare1 === "Hatten" && inputData[i].Lag1Spelare2 === "Danne" && inputData[i].VinstLag1 === 1) formResult[i] = formResult[i-1] - 1;
    else if(inputData[i].Lag1Spelare1 === "Danne" && inputData[i].Lag1Spelare2 === "Hatten" && inputData[i].VinstLag1 === 1) formResult[i] = formResult[i-1] - 1;
    else if(inputData[i].Lag2Spelare1 === "Hatten" && inputData[i].Lag2Spelare2 === "Danne" && inputData[i].VinstLag2 === 1) formResult[i] = formResult[i-1] - 1;
    else if(inputData[i].Lag2Spelare1 === "Danne" && inputData[i].Lag2Spelare2 === "Hatten" && inputData[i].VinstLag2 === 1) formResult[i] = formResult[i-1] - 1;
  }
  return formResult;
}