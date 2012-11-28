$(document).ready(function() {
    preFill();
    $('#refresh').click(function(){
        loadStoredData();
        getRenderingData();
    });
    $('#btnUrl').click(function() {
        var u = $('#renderingURL').val();
        localStorage["RenderingUrl"] = u;
        getRenderingData(u);
     });    
});

function preFill() {
    var url = localStorage["RenderingUrl"];
    $('#renderingURL').val(url);
}

function loadStoredData() {
    var url = localStorage["RenderingUrl"];
    if(url === undefined) {
        alert('URL must be entered into text box');
        return;
    }
    $('#renderingURL').val(url);
    getRenderingData(url);
}

function getRenderingData(url) {
	$.ajax({
                                url: url,
                                dataType: 'json',
                                type: 'GET',
                                cache: false,
                                success: function (json) {
                                    var isDataTable = $(".dataTable").length > 0;
                                    $('#myTable tbody tr').remove();
                                    jQuery.each(json, function(i, item) {
                                        if(!isDataTable) {
                                            $('#myTable tbody').append('<tr><td>'+item.TraceName+
    											'</td><td>'+item.RenderCount+
                                                '</td><td>'+item.UsedCache+
                                                '</td><td>'+item.UsedCache / item.RenderCount+
    											'</td><td>'+item.TotalItemsAccessed+
    											'</td><td>'+item.TotalTime+
    											'</td><td>'+item.AverageTime+
    											'</td></tr>');
                                        } else {
                                            $('#myTable').dataTable().fnAddData([item.TraceName,item.RenderCount,item.UsedCache,item.UsedCache/item.RenderCount,item.TotalItemsAccessed,item.TotalTime,item.AverageTime]);
                                        }
									});
                                    if(!isDataTable) {
                                        $('#myTable').dataTable();
                                    }
                                }
                            });

}