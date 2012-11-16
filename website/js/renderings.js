$(document).ready(function() {
	getRenderingData();
    $('#refresh').click(function(){
        getRenderingData();
    });

});

function getRenderingData() {
	$.ajax({
                                url: "http://gfixweb12.titantravel.co.uk/sitecore/renderings.aspx",
                                dataType: 'json',
                                type: 'GET',
                                cache: false,
                                success: function (json) {
                                    $('#myTable tbody tr').remove();
                                    jQuery.each(json, function(i, item) {
                                        
                                        $('#myTable tbody').append('<tr><td>'+item.TraceName+
											'</td><td>'+item.RenderCount+
                                            '</td><td>'+item.UsedCache+
                                            '</td><td>'+item.UsedCache / item.RenderCount+
											'</td><td>'+item.TotalItemsAccessed+
											'</td><td>'+item.TotalTime+
											'</td><td>'+item.AverageTime+
											'</td></tr>');
										});
									$("#myTable").dataTable();
                                },
                                error: function(xhr,textstatus,errorthrown) {
                                    alert("err" + errorthrown);
                                }
                            });

}