var results = require('josi/results');
var utilities = require('josi/utilities');

FunctionRouter = function(routes) {
  var routes = routes || [];
  this.add = function(pattern, action) {
    routes[routes.length] = [pattern, action];
  };
  this.route = function(url) {
    for (var r in routes) {
      var pattern = routes[r][0];
      var action = routes[r][1];
      if (pattern instanceof RegExp) {
        var match = pattern.exec(url);
        if (match) {
          var result = action.apply({}, match.slice(1));
          if (result instanceof results.Result) {
            return result;
          } else if (result instanceof Object) {
            return results.json(JSON.stringify(result));
          } else if (typeof result === 'string') {
            return results.raw(result);
          }
        }
      }
    }
    return results.notFound('No route matched the url: ' + url);
  }
};

ControllerRouter = function(dir) {
  var router = new FunctionRouter();
  this.add = function(pattern, defaults) {
    router.add(
      pattern,
      function(controller, action) {
        if (!controller && !defaults.controller) {
          return results.notFound('No controller was matched in the url and there was no default controller specified.');
        }
        controller = controller || defaults.controller;
        var moduleDir = dir + '/controllers/' + controller;
        try {
          var controllerModule = require(moduleDir);
          action = action || defaults.action;
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
  };
  this.route = router.route;
};

this.FunctionRouter = FunctionRouter;
this.ControllerRouter = ControllerRouter;
