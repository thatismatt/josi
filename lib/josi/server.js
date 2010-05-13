var fs = require('fs');
var sys = require('sys');
var http = require('http');
var path = require('path');
var utilities = require('josi/utilities');
var results = require('josi/results');
var ControllerRouter = require('josi/routing').ControllerRouter;

this.Server = function(dir, port, autoReload) {
  var app;
  var cacheDir = 'cache';
  var appModule = 'app';
  
  if (autoReload) {
    var deleteCache = function() {
      sys.debug('deleteCache');
      if (utilities.fileOrDirectoryExists(path.join(dir, cacheDir))) {
        fs.readdirSync(cacheDir)
          .forEach(function(f) {
            fs.unlinkSync(cacheDir + '/' + f);
          });
        fs.rmdirSync(cacheDir);
      }
    };

    var resetCache = function() {
      deleteCache();
      fs.mkdirSync(cacheDir, 0777);
    };

    var reloadApp = function() {
      sys.debug('reloadApp');
      var id = +(new Date());
      fs.linkSync(appModule + '.js', cacheDir + '/' + appModule + id + '.js');
      app = require(dir + '/' + cacheDir + '/' + appModule + id);
      if (!app.router) {
        app.router = new ControllerRouter(dir);
      }
      app.init.apply(app);
    };

    resetCache();
    reloadApp();

    fs.watchFile(appModule + '.js', function(curr, prev) {
      if (+curr.mtime != +prev.mtime) {
        reloadApp();
      }
    });
  } else {
    app = require(dir + '/app')
    // todo: refactor this duplication of code from reloadApp
    if (!app.router) {
      app.router = new ControllerRouter(dir);
    }
    app.init.apply(app);
  }
  
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
