// Simple JavaScript Templating
// by John Resig - http://ejohn.org/ - MIT Licensed
// http://ejohn.org/blog/javascript-micro-templating/

var fs = require("fs");

var cache = {};
  
this.simple = simple = function (str, data) {
  // Figure out if we're getting a template, or if we need to
  // load the template - and be sure to cache the result.
  var fn = !/[\t\r\n% ]/.test(str) ?
    cache[str] = cache[str] ||
    // read the template from the file specified
    simple(fs.readFileSync(str)) :

    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    new Function("obj",
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
  // Provide some basic currying to the user
  return data ? fn( data ) : fn;
};
