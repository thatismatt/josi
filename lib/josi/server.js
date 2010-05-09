var fs = require('fs');
var sys = require('sys');
var http = require('http');
var path = require('path');
var utilities = require('josi/utilities');
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

  this.listen = function() {
    http
      .createServer(function(req, res) {
        var result = app.router.route(req.url);
        result.execute(req, res);
      })
      .listen(port);
  };
};
