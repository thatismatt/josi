require('josi/class');
var routeresults = require('josi/routeresults');
var actionresults = require('josi/actionresults');
var utilities = require('josi/utilities');

this.FunctionRouter = FunctionRouter = Class.extend({
  init: function() {
    this.routes = [];
  },
  add: function(pattern, action, remap) {
    this.routes.push({ pattern: pattern, action: action, remap: remap || false });
  },
  addStatic: function(dir) {
    this.routes.push({
      pattern: new RegExp("/" + dir + "/([^?]*)(.*)?"),
      action: function() {
        return actionresults.content(dir + "/" + this.route[0]);
      },
      remap: false
    });
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
            if (mappingResult instanceof routeresults.RouteResult) {
              return mappingResult;
            } else {
              return new routeresults.RouteResult(mappingResult.action, mappingResult.context);
            }
          } else {
            return new routeresults.RouteResult(route.action, context);
          }
        }
      }
    }
    return routeresults.missingRoute();
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
          return routeresults.missingRoute('No controller was matched in the url and there was no default controller specified.');
        }
        try {
          var controllerObj = factory.getController(controller);
        } catch (e) {
          if (e.message && e.message === 'Missing Controller') {
            return routeresults.missingRoute('The "' + controller + '" controller is missing.');
          } else {
            return new routeresults.ErrorRouteResult(e);
          }
        }
        if (controllerObj[action]) {
          var result = controllerObj[action];
          context = context.slice(2);
          context.controller = controller;
          context.action = action;
          return {
            action: result,
            context: context
          };
        } else {
          return routeresults.missingRoute('The "' + controller + '" controller doesn\'t have an action called "' + action + '"');
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
      if (e.message && e.message === "Cannot find module '" + moduleDir + "'") {
        throw new Error('Missing Controller');
      } else {
        throw e;
      }
    }
  }
});
