var sys = require('sys');
var http = require('http');

var results = require('josi/results');
var routing = require('josi/routing');

this.Server = function(dir, port, autoReload) {
  var app = require(dir + '/app')
  if (!app.router) {
    var controllerFactory = new routing.ModuleControllerFactory(dir);
    app.router = new routing.ControllerRouter(controllerFactory);
  }
  app.init.apply(app);
  
  var processActionResult = function(actionResult, context) {
    if (actionResult instanceof results.ActionResult) {
      if (actionResult instanceof results.ViewResult) {
        actionResult.view = 'views/' + context.route.controller + '/' + context.route.action + '.html';
        actionResult.master = 'views/master.html';
      }
      return actionResult;
    } else if (actionResult instanceof Object) {
      return results.json(JSON.stringify(actionResult));
    } else if (typeof actionResult === 'string') {
      return results.raw(actionResult);
    } else {
      // todo: give a better error message
      return results.error('Bad action result.');
    }
  };
  
  this.listen = function() {
    http
      .createServer(function(req, res) {
        try {
          var routeResult = app.router.route(req.url);
          var actionContext = {
            route: routeResult.route,
            // query: todo: process querystring from url
            // form: todo: extract form variables
          }
          if (routeResult instanceof RouteResult) {
            if (routeResult instanceof MissingRouteResult) {
              var actionResult = results.notFound(routeResult.message || 'No route matched the url: ' + req.url);
            } else {
              var actionResult = routeResult.action.apply(actionContext);
            }
          } else {
            // todo: deal with wrong type of routeresult
          }
          actionResult = processActionResult(actionResult, actionContext);
          actionResult.execute(req, res);
        } catch (e) {
          results.error(e).execute(req, res);
        }
      })
      .listen(port);
  };
};
