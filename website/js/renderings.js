$(document).ready(function() {
	getRenderingData();
	$("#renderingTable").tablesorter(); 
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
                                        
                                        $('#renderingTable tbody').append('<tr><td>'+item.TraceName+'</td><td>'+item.RenderCount+'</td><td>'+item.TotalItemsAccessed+'</td><td>'+item.TotalTime+'</td></tr>');
                                     });
                           
                                },
                                error: function(xhr,textstatus,errorthrown) {
                                    alert("err" + errorthrown);
                                }
                            }); 

}