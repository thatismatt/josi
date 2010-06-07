var fs = require("fs");
require('josi/class');

var TemplatingEngine = Class.extend({
  init: function() {
    var cache = {};
    var self = this;
    this.load = function(path, cb) {
      if (cache[path]) {
        cb(cache[path]);
      } else {
        fs.readFile(path, 'utf8', function(err, data) {
          if (err) {
            // todo: deal with error when loading view
            throw err;
          }
          cache[path] = self.compile(data);
          cb(cache[path]);
        });
      }
    };
  },
  compile: function(str) {
    throw new Error('Not implemented error. To use extend this class and implement the compile method.');
  },
  render: function(data, callback, view, master) {
    var self = this;
    this.load(view, function(template) {
      var rendered = template(data);
      if (master) {
        // fixme: don't clobber users' data
        data.main = rendered;
          self.load(master, function(masterTemplate) {
          var rendered = masterTemplate(data);
          callback(rendered);
        });
      } else {
        callback(rendered);
      }
    });
  }
});

// JavaScript Micro-Templating
// by John Resig - http://ejohn.org/ - MIT Licensed
// http://ejohn.org/blog/javascript-micro-templating/
this.MicroTemplatingEngine = TemplatingEngine.extend({
  compile: function(str) {
    return new Function("obj",
      "var __=[];" +

      // Introduce the data as local variables using with(){}
      "with(obj){__.push('" +

      // Convert the template into pure JavaScript
      str
        .replace(/[\r\n\t]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("__.push('")
        .split("\r").join("\\'")
      + "');}return __.join('');"
    );
  }
});

// Adapted from jQuery Templating Plugin
// Copyright 2010, John Resig
// Dual licensed under the MIT or GPL Version 2 licenses.
// http://github.com/jquery/jquery-tmpl/
this.jQueryTemplatingEngine = TemplatingEngine.extend({
  compile: function(str) {
    var tmplcmd = {
  		'each': {
  			_default: [null, "$i"],
  			prefix: "$1.forEach(function($2){with(this){",
  			suffix: "}});"
  		},
  		'if': {
  			prefix: "if($1){",
  			suffix: "}"
  		},
  		'else': {
  			prefix: "}else{"
  		},
  		'html': {
  			prefix: "_.push(typeof $1==='function'?$1.call(this):$1);"
  		},
  		'=': {
  			_default: ["this"],
  			prefix: "_.push(typeof $1==='function'?$1.call(this):$1);"
        // prefix: "_.push($.encode(typeof $1==='function'?$1.call(this):$1));"
  		}
  	};
  	var fn = new Function("$data",
  		"var _=[];_.data=$data;" +

  		// Introduce the data as local variables using with(){}
  		"with($data){_.push('" +

  		// Convert the template into pure JavaScript
  		str
  			.replace(/[\r\t\n]/g, " ")
  			.replace(/\${([^}]*)}/g, "{{= $1}}")
  			.replace(/{{(\/?)(\w+|.)(?:\((.*?)\))?(?: (.*?))?}}/g, function(all, slash, type, fnargs, args) {
  				var tmpl = tmplcmd[type];

  				if (!tmpl) {
  					throw "Template command not found: " + type;
  				}

  				var def = tmpl._default;

  				return "');" + tmpl[slash ? "suffix" : "prefix"]
  					.split("$1").join(args || (def ? def[0] : ''))
  					.split("$2").join(fnargs || (def ? def[1] : '')) + "_.push('";
  			})
  		+ "');}return _.join('');");
  	return fn;
  }
});
