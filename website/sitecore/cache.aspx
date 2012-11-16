<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Import Namespace="Sitecore.Caching" %>
<%@ Import Namespace="Sitecore.Diagnostics" %>
<%@ Import Namespace="Sitecore.Web" %>
<%@ Import Namespace="Sitecore" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="Newtonsoft.Json"%>
<%@ Import Namespace="Newtonsoft.Json.Converters"%>
<%@ Import Namespace="System.Text"%>
<%@ Import Namespace="System.IO"%>

    <script type="text/C#" runat="server">
        // Methods

        protected override void OnInit(EventArgs arguments)
        {
            Assert.ArgumentNotNull(arguments, "arguments");
            base.OnInit(arguments);
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            this.ResetCacheList();
        }

        private void ResetCacheList()
        {
            var allCaches = CacheManager.GetAllCaches();

            var data = allCaches.Select(x => new {
                    Count = x.Count,
                    Name = x.Name,
                    CurrentSize = (x.Size),
                    MaxSize = (x.MaxSize)
                });
            StringWriter textWriter = new StringWriter();
            using (var writer2 = new JsonTextWriter(textWriter))
            {
                writer2.Formatting = Newtonsoft.Json.Formatting.Indented;
                JsonSerializer serializer = new JsonSerializer();
                serializer.Converters.Add(new XmlNodeConverter());
                serializer.Serialize(writer2, data);
            }
            Response.ContentType = "application/json";
            Response.Headers.Add("Access-Control-Allow-Origin","*");
            string qs = HttpContext.Current.Request.QueryString["callback"];
            HttpContext.Current.Response.Write(qs + textWriter.ToString());
            
            return;
            Array.Sort(allCaches, new CacheComparer());
            var table = HtmlUtil.CreateTable(0, 0);
            table.Border = 1;
            table.CellPadding = 4;
            HtmlUtil.AddRow(table, new[] { "Name", "Count", "Size", "MaxSize" });
            foreach (var cache in allCaches)
            {
                var count = cache.Count;
                var size = cache.Size;
                var maxSize = cache.MaxSize;
                var row = HtmlUtil.AddRow(table,
                                          new[]
                                          {
                                              cache.Name, count.ToString(), StringUtil.GetSizeString(size), StringUtil.GetSizeString(maxSize)
                                          });
            }
            if (this.c_caches.Controls.Count > 0)
            {
                this.c_caches.Controls.RemoveAt(0);
            }
            this.c_caches.Controls.Add(table);
        }

    </script>

    <asp:PlaceHolder ID="c_caches" runat="server"></asp:PlaceHolder>
