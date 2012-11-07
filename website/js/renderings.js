$(document).ready(function() {
	getRenderingData();

});

function getRenderingData() {
	$.ajax({
                                url: "http://gfixweb12.travel.saga.co.uk/sitecore/renderings.aspx",
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
                                        
                                        $('#myTable tbody').append('<tr><td>'+item.TraceName+
											'</td><td>'+item.RenderCount+
											'</td><td>'+item.TotalItemsAccessed+
											'</td><td>'+item.TotalTime+
											'</td><td>'+item.CacheHitRatio+
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