$(document).ready(function() {
    loadSaved();

    $('#btnUrl').click(function() {
        var u = $('#cacheUrl').val();
        localStorage["Url"] = u;
        getCacheNames(u);
        localStorage["Caches"] = undefined;
    });
    var u = $('#cacheUrl').val();
    if (u !== '' && u !== undefined) {
        getCacheNames(u);
    }
});

function loadSaved() {
    var url = localStorage["Url"];
    if (url !== undefined) {
        $('#cacheUrl').val(url);
    }
    var c = localStorage["Caches"];
    if (c !== undefined && c != "undefined") {
        var caches = JSON.parse(c);
        $.each(caches.data, function(i, item) {
            createGraph(item, $('#cacheUrl').val());
        });
    }

}

function removeCache(name) {
    var c = localStorage["Caches"];
    if (c !== undefined && c != "undefined") {
        var caches = JSON.parse(c);
        var temp = [];
        $.each(caches.data, function(i, item) {
            if (item != name) {
                temp.push(item);
            }
        });
        caches.data = temp;
        localStorage["Caches"] = JSON.stringify(caches);
        loadSaved();
    }
}

function getCacheNames(url) {
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        cache: false,
        success: function(json) {
            var names = [];

            jQuery.each(json, function(i, item) {
                names.push(item.Name);
            });
            names.sort(

            function(a, b) {
                if (a.toLowerCase() < b.toLowerCase()) return -1;
                if (a.toLowerCase() > b.toLowerCase()) return 1;
                return 0;
            });
            jQuery.each(names, function(i, name) {
                $('#cacheNames').append('<li><a href="#" class="cacheName">' + name + '</a></li>');
            });
            $('.cacheName').click(function(event) {
                var link = $(this);
                var name = link.text();
                var c = localStorage["Caches"];

                if (c === undefined || c == 'undefined') {
                    c = JSON.stringify({
                        'data': []
                    });
                }
                var caches = JSON.parse(c);
                caches.data.push(name);
                localStorage["Caches"] = JSON.stringify(caches);
                createGraph(name, url);
            });
        }
    });
}

function createGraph(name, url) {
    var divId = "graph_" + name;
    $('#graphContainer').append('<a href="javascript:void(0);" onclick="removeCache(\'' + name + '\')">Remove Graph</a><div id="' + divId + '" style="height: 300px; width:100%;"></div>');
    // $('#graphContainer').append('<div id="' + divId + '"></div>');
    generateGraph(divId, name, url);
}


function generateGraph(container, cacheName, url) {
    var dps = []; // dataPoints
    var maxCache = [];
    var chart = new CanvasJS.Chart(container, {
        title: {
            text: cacheName
        },
        data: [{
            type: "line",
            dataPoints: dps
        }, {
            type:"line",
            dataPoints: maxCache
        }],
        axisX: {
            title: "time",
            gridThickness: 1,
            valueFormatString: "hh:mm:ss TT",
            labelAngle: -20

        },
        axisY: {
            title: "Cache size",
            gridThickness: 1
        }
    });

    var updateChart = function(count) {
        count = count || 1;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            success: function(json) {
                jQuery.each(json, function(i, item) {
                    if (item.Name == cacheName) {
                        dps.push({
                            x: new Date(),
                            y: item.CurrentSize
                        });
                        maxCache.push({
                            x: new Date(),
                            y: item.MaxSize
                        });
                        if (dps.length > 30) {
                            dps.shift();
                            maxCache.shift();
                        }

                    }
                });
                chart.render();
            },
            error: function(xhr, textstatus, errorthrown) {

            }
        });
    };
    setInterval(function() {
        updateChart();
    }, 5000);
}