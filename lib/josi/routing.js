require('josi/class');
var results = require('josi/results');
var utilities = require('josi/utilities');

this.FunctionRouter = FunctionRouter = Class.extend({
  init: function() {
    this.routes = [];
  },
  add: function(pattern, action) {
    this.routes.push([pattern, action]);
  },
  route: function(url) {
    for (var r in this.routes) {
      var pattern = this.routes[r][0];
      var action = this.routes[r][1];
      if (pattern instanceof RegExp) {
        var match = pattern.exec(url);
        if (match) {
          return new results.RouteResult(action, match.slice(1));
        }
      }
    }
    return new results.RouteResult();
  }
});

this.ControllerRouter = ControllerRouter = FunctionRouter.extend({
  init: function(dir) {
    this.dir = dir;
    this._super();
  },
  add: function(pattern, defaults) {
    var dir = this.dir;
    this._super(
      pattern,
      function(controller, action) {
        if (!controller && !defaults.controller) {
          return results.notFound('No controller was matched in the url and there was no default controller specified.');
        }
        controller = controller || defaults.controller;
        action = action || defaults.action;
        var moduleDir = dir + '/controllers/' + controller;
        try {
          var controllerModule = require(moduleDir);
          if (controllerModule[action]) {
            var result = controllerModule[action](utilities.argumentsToArray(arguments).slice(2));
            if (result instanceof results.ViewResult) {
              result.view = 'views/' + controller + '/' + action + '.html';
              result.master = 'views/master.html';
            }
            return result;
          } else {
            return results.notFound('The "' + controller + '" controller doesn\'t have an action called "' + action + '"');
          }
        } catch (e) {
          if (e.message && e.message == "Cannot find module '" + moduleDir + "'") {
            return results.notFound('The "' + controller + '" controller is missing.');
          } else {
            throw e;
          }
        }
      }
    );
  }
});
