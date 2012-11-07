// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

$(document).ready(function() {
     Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
     getCacheNames();
     var c = localStorage["Caches"];
     if(c != undefined) {
         var caches = JSON.parse(c);
         $.each(caches.data, function(i, item) {
            createGraph(item);
         });
     }
});

function getCacheNames(url) {
    $.ajax({
        url: 'http://gfixweb12.travel.saga.co.uk/sitecore/cache.aspx',
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
                
                if(c == undefined ) {
                    c = JSON.stringify({'data':[]});
                }
                var caches = JSON.parse(c);
                caches.data.push(name);
                localStorage["Caches"] = JSON.stringify(caches);
                createGraph(name);
            });
        },
        error: function(xhr,textstatus,errorthrown) {
            alert("err" + errorthrown);
        }
    });
}

function createGraph(name) {
    var divId = "graph_" + name;
    $('#graphContainer').append('<div id="' + divId + '"></div>');
    generateGraph(divId,name);
}


function generateGraph(container, cacheName) {
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
                                url: "http://gfixweb12.travel.saga.co.uk/sitecore/cache.aspx",
                                dataType: 'json',
                                type: 'GET',
                                cache: false,
                                success: function (json) {
                                        var lines = [],
                                        listen = false,
                                        date,
                            
                                        // set up the two data series
                                        allVisits = [];
                            
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
         legend: {
                enabled: false
            },
            exporting: {
                enabled: false
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
        var lines = [],
                        listen = false,
                        date,
            
                        // set up the two data series
                        allVisits = [],
                        maxSize = [];
        for(var i = 0; i < 20; i++) {
            $.ajax({
                url: "http://gfixweb12.travel.saga.co.uk/sitecore/cache.aspx",
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
                    alert("err" + errorthrown);
                }
            });
        }
}