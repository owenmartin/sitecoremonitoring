sitecoremonitoring
==================
#Overview
The purpose of this mini dashboard is to provide statistical information on the current state of sitecore websites.  Currently this includes rendering and cache statistics, but could easily be extended to include extra information (publishing schedules, agent status, event queue messages etc).

#Implementation
There are two parts to the dashboard - a selection of html/css/js files for the dashboard website, and a handful of aspx files that can be dropped into a sitecore website to provide JSON data.  The server side files have inline code, so they can be dropped directly into a running website with no nasty recycling effects.

#To Do List
* Refactor the individual pages to allow easy access to their functions (graph creation, data table population etc)
* Create the dashboard page
* Show alerts when cache levels drop in quick succession (useful for cache tuning)
* Create page to view Event Queue data
* Create page to view database statistics
* Many more..