var http = require('http');

var results = require('josi/results');
var ControllerRouter = require('josi/routing').ControllerRouter;

this.Server = function(dir, port, autoReload) {
  var app = require(dir + '/app')
  if (!app.router) {
    app.router = new ControllerRouter(dir);
  }
  app.init.apply(app);
  
  var processActionResult = function(actionResult) {
    if (actionResult instanceof results.ActionResult) {
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
          if (routeResult.action) {
            // fixme: passing the route values in as an argument to the action
            //        is a temporary hack to keep the ControllerRouter working
            var actionResult = routeResult.action.apply(actionContext, routeResult.route);
          } else {
            var actionResult = results.notFound('No route matched the url: ' + req.url);
          }
          actionResult = processActionResult(actionResult);
          actionResult.execute(req, res);
        } catch (e) {
          results.error(e).execute(req, res);
        }
      })
      .listen(port);
  };
};
