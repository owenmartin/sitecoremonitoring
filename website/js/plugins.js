$(document).ready(function() {
     Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
     loadSaved();

     $('#btnUrl').click(function() {
        var u = $('#cacheUrl').val();
        localStorage["Url"] = u;
        getCacheNames(u);
        localStorage["Caches"] = undefined;
     });
      var u = $('#cacheUrl').val();
     if(u != '' && u != undefined) {
         getCacheNames(u);
     }
});





function loadSaved() {
     var url = localStorage["Url"];
     if(url != undefined) {
        $('#cacheUrl').val(url);
     }
    var c = localStorage["Caches"];
     if(c != undefined) {
         var caches = JSON.parse(c);
         $.each(caches.data, function(i, item) {
            createGraph(item,$('#cacheUrl').val());
         });
     }

}

function getCacheNames(url) {
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        cache: false,
        success: function (json) {
            var names = [];

            jQuery.each(json, function(i, item) {
                names.push([item.Name]);
             });
            jQuery.each(names, function(i, name) {
                $('#cacheNames').append('<li><a href="#" class="cacheName">' + name + '</a></li>');
            });
            $('.cacheName').click(function (event) {
                var link = $(this);
                var name = link.text();
                var c = localStorage["Caches"];
                
                if(c === undefined || c == 'undefined') {
                    c = JSON.stringify({'data':[]});
                }
                var caches = JSON.parse(c);
                caches.data.push(name);
                localStorage["Caches"] = JSON.stringify(caches);
                createGraph(name,url);
            });
        }
    });
}

function createGraph(name, url) {
    var divId = "graph_" + name;
    $('#graphContainer').append('<div id="' + divId + '"></div>');
    generateGraph(divId,name,url);
}


function generateGraph(container, cacheName,url) {
    var chart;
        // define the options
        var options = {
            chart: {
                renderTo: container,
                type: 'spline',
                marginRight: 10,
                events: {
                    load: function() {
                        var series = this.series[0];
                        var max = this.series[1];
                        var c = this;
                        setInterval(function() {
                            $.ajax({
                                url: url,
                                dataType: 'json',
                                type: 'GET',
                                cache: false,
                                success: function (json) {
                                    var allVisits = [];
                                    jQuery.each(json, function(i, item) {
                                        if(item.Name == cacheName)
                                        {
                                            
                                            series.addPoint([new Date().getTime(), item.CurrentSize],true,true);
                                            max.addPoint([new Date().getTime(), item.MaxSize],true,true);
                                        }
                                     });
                           
                                },
                                error: function(xhr,textstatus,errorthrown) {
                                    alert("err" + errorthrown);
                                }
                            });
                        }, 3000);
                    }
                }
            },
            title: {
                text: 'Cache Size ' + cacheName
            },
            xAxis: {
            labels: {
                formatter: function() {
                    return Highcharts.dateFormat('%H:%M:%S', this.value);
                        //return Highcharts.numberFormat(this.value, 0);
                    }
                }
            },
            yAxis: [{ // left y axis
                title: {
                    text: null
                },
                labels: {
                    align: 'left',
                    x: 3,
                    y: 16,
                    formatter: function() {
                        return Highcharts.numberFormat(this.value, 0);
                    }
                },
                showFirstLabel: false
            },
            { // right y axis
                
                gridLineWidth: 0,
                opposite: true,
                title: {
                    text: null
                },
                labels: {
                    align: 'right',
                    x: -3,
                    y: 16,
                    formatter: function() {
                        return Highcharts.numberFormat(this.value, 0);
                    }
                },
                showFirstLabel: false
            }],
            legend: {
                align: 'left',
                verticalAlign: 'top',
                y: 20,
                floating: true,
                borderWidth: 0
            },
    
            tooltip: {
                shared: true,
                crosshairs: true
            },
    
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                hs.htmlExpand(null, {
                                    pageOrigin: {
                                        x: this.pageX,
                                        y: this.pageY
                                    },
                                    headingText: this.series.name,
                                    maincontentText: Highcharts.dateFormat('%H:%M:%S', this.x) +':<br/> '+
                                        this.y +' visits',
                                    width: 200
                                });
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
            },
    
            series: [{
                name: 'Current Size  '+ cacheName,
                lineWidth: 4,
                data: [],
                marker: {
                    radius: 4
                }

            },{
                name: 'Max Size  '+ cacheName,
                lineWidth: 4,
                data: [],
                marker: {
                    radius: 4
                }

            }]
        };
    

        // Load data asynchronously using jQuery. On success, add the data
        // to the options and initiate the chart.
        // This data is obtained by exporting a GA custom report to TSV.
        // http://api.jquery.com/jQuery.get/
        var allVisits = [],maxSize = [];
        for(var i = 0; i < 20; i++) {
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'GET',
                success: function (json) {
                    jQuery.each(json, function(i, item) {
                        
                        if(item.Name == cacheName)
                        {
                            allVisits.push([new Date().getTime(), item.CurrentSize]);
                            maxSize.push([new Date().getTime(), item.MaxSize]);
                        }
                     });
                    options.series[0].data = allVisits;
                    options.series[1].data = maxSize;
                    chart = new Highcharts.Chart(options);
                    
                },
                error: function(xhr,textstatus,errorthrown) {
                    
                }
            });
        }
}