
var data_cleaned = [];
var mapchart;
var Cont_data = [];

Highcharts.ajax({
    url: "./dataset.csv",
    dataType: "csv",

    success: function(csv) {
        console.log("YES! WOOOOOOT")
        
        csv = csv.split(/\n/);
        /*csv.slice(0).forEach(element=> {
            element = element.split(',');
            days.push([getCountry(element[0]), element.slice(1)])
        })*/
        csv.slice(1).forEach(element => {
            element = element.split(',');
            data_cleaned.push([
                getCountry(element[0]),
                element[element.length - 1]
                ])
        
            /*console.log(days)*/
            
        })

        csv.slice(1).forEach(element => {
            element = element.split(',');
            Cont_data.push([
                getCountry(element[0]),
                element.slice(1)
                ])
                        
        })

        console.log(Cont_data)

        /*function CSVtoArray(text) {
            return text.replace(/^"/, '')
                .replace(/",$/, '')
                .split('","');
        }

        csv.slice(0).forEach(function (line) {
            var row = CSVtoArray(line),
                Cont_data = row.slice(1);

            Cont_data.forEach(function (val, i) {
                val = val.replace(quoteRegex, '');
                if (numRegex.test(val)) {
                    val = parseInt(val, 10);
                } else if (!val || lastCommaRegex.test(val)) {
                    val = null;
                }
                Cont_data[i] = val;
            });

            countries[row[1]] = {
                name: row[0],
                code3: row[1],
                data: Cont_data
            }

            console.log(countries)
        });*/

       /* csv.slice(1).forEach(element => {
            element = element.split(',');
            days.push([
                getCountry(element[0]),
                element[1]
                ])
        })*/
        

        mapchart = Highcharts.mapChart('container', {
            chart: {
                map: 'custom/world'
            },

            title: {
                text: 'Total COVID-19 cases by country'
            },
    
            subtitle: {
                text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Robinson projection, medium resolution</a>'
            },
        
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
    
            colorAxis: {
                min: 100,
                max: 100000,
                /*maxColor: '#c70000',
                minColor: '#ffdbdb'*/
            },

            tooltip: {
                footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
            },
    
            series: [{
                data: data_cleaned,
                name: 'Total COVID-19 Cases',
                allowPointSelect: true,
                cursor: 'pointer',
                states: {
                    select: {
                        color: '#a4edba',
                        borderColor: 'black',
                        dashStyle: 'shortdot'
                    },
                    hover: {
                        color: '#25E8E8'
                    }
                },

                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }]     
        })
    }
})
