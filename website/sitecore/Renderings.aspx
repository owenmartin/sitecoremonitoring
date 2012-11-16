<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="Newtonsoft.Json.Converters" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="Sitecore.Diagnostics" %>
<%@ Import Namespace="System.IO" %>
<%@Import Namespace="System.Collections.Generic" %>

<script type="text/c#" runat="server">
    protected override void OnLoad(EventArgs e)
    {
        
        var list = new SortedList<string, Statistics.RenderingData>();
        foreach (Statistics.RenderingData data in Statistics.RenderingStatistics)
        {
            if (data.SiteName.Equals("website", StringComparison.OrdinalIgnoreCase))
            {
                list.Add(data.SiteName + 0xff + data.TraceName, data);
            }
        }
        var renderings = list.Values.Select(x => x);
        var textWriter = new StringWriter();
        using (var writer2 = new JsonTextWriter(textWriter))
        {
            writer2.Formatting = Formatting.Indented;
            var serializer = new JsonSerializer();
            serializer.Converters.Add(new XmlNodeConverter());
            serializer.Serialize(writer2, renderings);
        }
        Response.ContentType = "application/json";
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        HttpContext.Current.Response.Write(textWriter.ToString());
    }
</script>

