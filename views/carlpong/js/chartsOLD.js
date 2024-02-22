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
                var orderedData = {}
                // console.log(data.month)
                orderedData.month = orderMonth(data.month)
                orderedData.vecka = orderVeckor(data.vecka)
                // console.log(orderedData.month)
                googleChart(orderedData.vecka, orderedData.month)
            });
        }
    )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });

function googleChart(veckoData, monthData) {
    // Load Charts and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Draw the pie chart for Sarah's pizza when Charts is loaded.
    google.charts.setOnLoadCallback(drawChartMånad);

    // Draw the pie chart for Sarah's pizza when Charts is loaded.
    google.charts.setOnLoadCallback(drawChartVecka);


    // Callback that draws the pie chart for Sarah's pizza.
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
                position: "top",
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

    // Callback that draws the pie chart for Sarah's pizza.
    function drawChartVecka() {

        // Create the data table for Sarah's pizza.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows(veckoData);
        var options = {
            backgroundColor: { fill: 'transparent' },
            is3D: true,
            legend: {
                alignment: "center",
                position: "top",
                textStyle: {
                    color: 'white', 
                },
                maxLines: 20
            }
        };

        // Instantiate and draw the chart for Sarah's pizza.
        var chart = new google.visualization.PieChart(document.getElementById('vecko_chart'));
        chart.draw(data, options);
    }

    $(window).resize(function(){
        drawChartMånad();
        drawChartVecka();

      });
}

function orderMonth(data) {
    var månadLog = [], obj, månadsvinnare = [], totalVinnare ={};
    data.forEach(key => {
        if (!månadLog.includes(key.Månad)) {
            månadLog.push(key.Månad)
        } else if (månadLog.includes(key.Månad)) {
        }
    })
    for (let i = 0; i < månadLog.length; i++) {
        obj = data.find(function (obj) { return obj['Månad'] === månadLog[i] });
        // console.log(obj.Månad + ' ' + obj.Spelare)
        månadsvinnare.push(obj.Spelare)
    }
    var counts = {};

    for (var i = 0; i < månadsvinnare.length; i++) {
        var num = månadsvinnare[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    var unique = månadsvinnare.filter(onlyUnique)
    // console.log(unique)
    unique.forEach(namn => {
        totalVinnare[namn] = counts[namn]
    })


    var sortable = [];
    for (var vinster in totalVinnare) {
        sortable.push([vinster, totalVinnare[vinster]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    return(sortable)
}

function orderVeckor(data) {
    var veckoLog = [], obj, veckovinnare = [], totalVinnare ={};
    data.forEach(key => {
        if (!veckoLog.includes(key.vecka)) {
            veckoLog.push(key.vecka)
        } else if (veckoLog.includes(key.vecka)) {
        }
    })
    for (let i = 0; i < veckoLog.length; i++) {
        obj = data.find(function (obj) { return obj['vecka'] === veckoLog[i] });
        // console.log(obj.vecka + ' ' + obj.Spelare)
        veckovinnare.push(obj.Spelare)
    }
    var counts = {};

    for (var i = 0; i < veckovinnare.length; i++) {
        var num = veckovinnare[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    var unique = veckovinnare.filter(onlyUnique)
    // console.log(unique)
    unique.forEach(namn => {
        totalVinnare[namn] = counts[namn]
    })


    var sortable = [];
    for (var vinster in totalVinnare) {
        sortable.push([vinster, totalVinnare[vinster]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    return(sortable)
}

function foo(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}