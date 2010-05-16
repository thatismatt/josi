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
  init: function(factory) {
    this.factory = factory;
    this._super();
  },
  add: function(pattern, defaults) {
    var factory = this.factory;
    this._super(
      pattern,
      function() {
        var controller = this.route[0] || defaults.controller;
        var action = this.route[1] || defaults.action;
        if (!controller) {
          return results.notFound('No controller was matched in the url and there was no default controller specified.');
        }
        var controllerObj = factory.getController(controller);
        if (!controllerObj) {
          return results.notFound('The "' + controller + '" controller is missing.');
        }
        if (controllerObj[action]) {
          var result = controllerObj[action].apply(this);
          if (result instanceof results.ViewResult) {
            result.view = 'views/' + controller + '/' + action + '.html';
            result.master = 'views/master.html';
          }
          return result;
        } else {
          return results.notFound('The "' + controller + '" controller doesn\'t have an action called "' + action + '"');
        }
      }
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
