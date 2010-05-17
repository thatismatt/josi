require('josi/class');
var results = require('josi/results');
var utilities = require('josi/utilities');

this.FunctionRouter = FunctionRouter = Class.extend({
  init: function() {
    this.routes = [];
  },
  add: function(pattern, action, remap) {
    this.routes.push({ pattern: pattern, action: action, remap: remap || false });
  },
  route: function(url) {
    for (var i in this.routes) {
      var route = this.routes[i];
      if (route.pattern instanceof RegExp) {
        var match = route.pattern.exec(url);
        if (match) {
          var context = match.slice(1);
          if (route.remap) {
            var mappingResult = route.action(context);
            if (mappingResult instanceof results.RouteResult) {
              return mappingResult;
            } else {
              return new results.RouteResult(mappingResult.action, mappingResult.context);
            }
          } else {
            return new results.RouteResult(route.action, context);
          }
        }
      }
    }
    return results.missingRoute();
  }
});

this.ControllerRouter = ControllerRouter = FunctionRouter.extend({
  init: function(factory) {
    this.factory = factory;
    this._super();
  },
  add: function(pattern, defaults) {
    var factory = this.factory;
    this._super(
      pattern,
      function(context) {
        var controller = context[0] || defaults.controller;
        var action = context[1] || defaults.action;
        if (!controller) {
          return results.missingRoute('No controller was matched in the url and there was no default controller specified.');
        }
        var controllerObj = factory.getController(controller);
        if (!controllerObj) {
          return results.missingRoute('The "' + controller + '" controller is missing.');
        }
        if (controllerObj[action]) {
          var result = controllerObj[action];
          var context = context.slice(2);
          context.controller = controller;
          context.action = action;
          return {
            action: result,
            context: context
          };
        } else {
          return results.missingRoute('The "' + controller + '" controller doesn\'t have an action called "' + action + '"');
        }
      },
      true // remap
    );
  }
});

this.ControllerFactory = ControllerFactory = Class.extend();

this.ModuleControllerFactory = ModuleControllerFactory = ControllerFactory.extend({
  init: function(dir) {
    this.dir = dir;
  },
  getController: function(controller) {
    var moduleDir = this.dir + '/controllers/' + controller;
    try {
      return require(moduleDir);
    } catch (e) {
      if (e.message && e.message == "Cannot find module '" + moduleDir + "'") {
        return;
      } else {
        throw e;
      }
    }
  }
});
