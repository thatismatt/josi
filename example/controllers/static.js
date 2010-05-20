var content = require('josi/actionresults').content;

this.css = function() { return content('static/style.css'); };
this.jquery = function() { return content('static/jquery-1.4.2.min.js'); };
this.myjs = function() { return content('static/my.js'); };
this.favicon = function() { return content('static/favicon.png'); };
