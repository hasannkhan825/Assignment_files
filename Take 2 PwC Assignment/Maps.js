Highcharts.ajax({
    url: './dataset.csv',
    dataType: 'csv',
    success: function (csv) {


        // Very simple and case-specific CSV string splitting
        function CSVtoArray(text) {
            return text.split(",")
        }

        csv = csv.split(/\n/);

        var countries = {},
            mapChart,
            countryChart,
            numRegex = /^[0-9\.]+$/,
            lastCommaRegex = /,\s$/,
            quoteRegex = /\"/g,
            categories = CSVtoArray(csv[0].slice(10));
            console.log(categories)
            console.log("Complete")


        // Parse the CSV into arrays, one array each country
            csv.slice(1).forEach(function (line) {
            var row = CSVtoArray(line),
                data = row.slice(1);

            data.forEach(function (val, i) {
                val = val.replace(quoteRegex, '');
                if (numRegex.test(val)) {
                    val = parseInt(val, 10);
                } else if (!val || lastCommaRegex.test(val)) {
                    val = null;
                }
                data[i] = val;
            });

            countries[row[0]] = {
                name: row[0],
                data: data
            }
            
        });
        console.log(countries['Algeria']) //this works
        


        // For each country, use the latest value for current population
        var data = [];
        for (var name in countries) {
            if (Object.hasOwnProperty.call(countries, name)) {
                var value = null,
                    year,
                    itemData = countries[name].data,
                    i = itemData.length;
                    

                while (i--) {
                    if (typeof itemData[i] === 'number') {
                        value = itemData[i];
                        year = categories[i];
                        break; //this exits the loop as soon as the first number from the back (ie latest) year is obtained
                    }
                }
                data.push({
                    name: countries[name].name,
                    //code3: code3,
                    value: value,
                    day: year
                });
            }
        }
        //console.log(data)


        var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
        mapData.forEach(function (country) {
            country.id = country.properties['name'];
        });

        // Wrap point.select to get to the total selected points
        Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

            proceed.apply(this, Array.prototype.slice.call(arguments, 1));

            var points = mapChart.getSelectedPoints(); 

            //console.log(points[0].value)
            if(countries.hasOwnProperty.call(countries, points[0].name)){
                        var country_selector = countries[points[0].name];

                        document.querySelector('#day1 .date').innerHTML = categories[country_selector.data.length - 1];
                        document.querySelector('#day1 .cases').innerHTML = country_selector.data[country_selector.data.length - 1];
                         document.querySelector('#day1 .increase').innerHTML = (country_selector.data[country_selector.data.length - 1]
                        - country_selector.data[country_selector.data.length - 2])/country_selector.data[country_selector.data.length - 2] *100 + '%';


                        document.querySelector('#day2 .date').innerHTML = categories[country_selector.data.length - 2];
                        document.querySelector('#day2 .cases').innerHTML = country_selector.data[country_selector.data.length - 2];
                         document.querySelector('#day2 .increase').innerHTML = (country_selector.data[country_selector.data.length - 2]
                        - country_selector.data[country_selector.data.length - 3])/country_selector.data[country_selector.data.length - 3] *100 + '%';


                        document.querySelector('#day3 .date').innerHTML = categories[country_selector.data.length - 3];
                        document.querySelector('#day3 .cases').innerHTML = country_selector.data[country_selector.data.length - 3];
                         document.querySelector('#day3 .increase').innerHTML = (country_selector.data[country_selector.data.length - 3]
                        - country_selector.data[country_selector.data.length - 4])/country_selector.data[country_selector.data.length - 4] *100 + '%';


                        document.querySelector('#day4 .date').innerHTML = categories[country_selector.data.length - 4];
                        document.querySelector('#day4 .cases').innerHTML = country_selector.data[country_selector.data.length - 4];
                         document.querySelector('#day4 .increase').innerHTML = (country_selector.data[country_selector.data.length - 4]
                        - country_selector.data[country_selector.data.length - 5])/country_selector.data[country_selector.data.length - 5] *100 + '%';
                    }



            if (points.length) {
                if (points.length === 1) {
                    document.querySelector('#info #flag')
                        //.className = 'flag ' + points[0].flag;
                    document.querySelector('#info h2').innerHTML = points[0].name;
                    

                    


                    //document.querySelector('#day1 .day').innerHTML = points[0].name;
                    //document.querySelector('#day1 .cases').innerHTML = points[0].value;
                    //console.log(points[0])
                } else {
                    document.querySelector('#info #flag')
                        //.className = 'flag';
                    document.querySelector('#info h2').innerHTML = 'Comparing countries';

                }
                document.querySelector('#info .subheader')
                    .innerHTML = '<h4>Historical population</h4><small><em>Shift + Click on map to compare countries</em></small>';

                if (!countryChart) {
                    countryChart = Highcharts.chart('country-chart', {
                        chart: {
                            height: 250,
                            spacingLeft: 0,
                            backgroundColor: {
                                linearGradient: [0, 0, 500, 500],
                                stops: [
                                    [0, 'rgb(15,32,39)'],
                                    // [1, 'rgb(32,58,67)'],
                                    [2, 'rgb(44,83,100)']
                                ]
                                
                            },
                            borderRadius: '3px'
                        
                        },

                        legend:{
                            backgroundColor: 'white',
                            borderRadius: '3px'
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: null
                        },
                        subtitle: {
                            text: null
                        },
                        xAxis: {
                            tickPixelInterval: 50,
                            crosshair: true,
                            lineColor: 'white',
                            minorGridLineColor: 'white',
                            labels: {
                                style: {
                                    color: 'white'
                                }
                            }
                        },
                        yAxis: {
                            title: null,
                            opposite: true,
                            labels: {
                                style: {
                                    color: 'white'
                                }
                            }
                        },
                        tooltip: {
                            split: true
                        },
                        plotOptions: {
                            series: {
                                //color: '#FF0000', 
                                animation: {
                                    duration: 500
                                },
                                marker: {
                                    enabled: false
                                },
                                threshold: 0,
                                pointStart: parseInt(categories[0], 10)
                            }
                        }
                    });
                }

                countryChart.series.slice(0).forEach(function (s) {
                    s.remove(false);
                });
                points.forEach(function (p) {
                    countryChart.addSeries({
                        name: p.name,
                        data: countries[p.name].data,
                        type: points.length > 1 ? 'line' : 'area'
                    }, false);
                });
                countryChart.redraw();

            } else {
                document.querySelector('#info #flag').className = '';
                document.querySelector('#info h2').innerHTML = '';
                document.querySelector('#info .subheader').innerHTML = '';
                if (countryChart) {
                    countryChart = countryChart.destroy();
                }
            }



        })

        //console.log(mapData)

        mapChart = Highcharts.mapChart('container', {

            chart: {
                //backgroundColor: '#1F2739'
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgb(15,32,39)'],
                        // [1, 'rgb(32,58,67)'],
                        [2, 'rgb(44,83,100)']
                    ]
                    
                },
                borderRadius: '10px'
            },

            title: {
                text: 'COVID-19 Cases History',
                style: {
                    color: '#ffffff'
                }
            },

            subtitle: {
              text: 'Source: Dataset provided by PwC',
              style:{
                  color:'#ededed'
              }
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 50000,
                max: 100000,
                minColor: '#8c5656',
                maxColor: '#FF0000',
                labels: {
                    style: {
                        color: 'white'
                    }
                }
            },

            tooltip: {
                footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
            },


            series: [{
                data: data,
                mapData: mapData,
                joinBy: ['id', 'name'],
                name: 'Current population infected',
                allowPointSelect: true,
                cursor: 'pointer',
                style:{
                    color:'white'
                },
                states: {
                    select: {
                        color: '#089c85',
                        borderColor: 'black',
                        dashStyle: 'shortdot'
                    }
                },
                borderWidth: 0.5,
                //dataLabels: {
                  //  enabled: true,
                    //format: '{point.name}'
                //}
            }]

            
        });
        mapChart.get('United States of America').select();





    }

})


