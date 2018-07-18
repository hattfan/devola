fetch('../foosball/data/vecka')
    .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(function (data) {
                googleChart(data)
            });
        }
    )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });

function googleChart(apiData) {
    // Load Charts and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Draw the pie chart for Sarah's pizza when Charts is loaded.
    google.charts.setOnLoadCallback(drawSarahChart);

    // Draw the pie chart for the Anthony's pizza when Charts is loaded.
    google.charts.setOnLoadCallback(drawAnthonyChart);

    // Callback that draws the pie chart for Sarah's pizza.
    function drawSarahChart() {

        // Create the data table for Sarah's pizza.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
            [apiData[0], 1],
            ['Onions', 1],
            ['Olives', 2],
            ['Zucchini', 2],
            ['Pepperoni', 1]
        ]);


        // Set options for Sarah's pie chart.
        var options = {
            title: 'title',
            width: 610,
            height: 260,
            backgroundColor: { fill: 'transparent' },
            is3D: true,
            legend: {
                textStyle: {
                    color: 'white'
                }
            }
        };

        // Instantiate and draw the chart for Sarah's pizza.
        var chart = new google.visualization.PieChart(document.getElementById('Sarah_chart_div'));
        chart.draw(data, options);
    }

    // Callback that draws the pie chart for Anthony's pizza.
    function drawAnthonyChart() {

        // Create the data table for Anthony's pizza.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
            ['Mushrooms', 2],
            ['Onions', 2],
            ['Olives', 2],
            ['Zucchini', 0],
            ['Pepperoni', 3]
        ]);

        // Set options for Anthony's pie chart.
        var options = {
            title: 'title',
            width: 610,
            height: 260,
            backgroundColor: { fill: 'transparent' },
            is3D: true,
            legend: {
                textStyle: {
                    color: 'white'
                }
            }
        };

        // Instantiate and draw the chart for Anthony's pizza.
        var chart = new google.visualization.PieChart(document.getElementById('Anthony_chart_div'));
        chart.draw(data, options);
    }
}