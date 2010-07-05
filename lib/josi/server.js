var http = require('http');
var url = require('url');
var querystring = require('querystring');

var actionresults = require('josi/actionresults');
var routing = require('josi/routing');
var templating = require('josi/templating');
var utilities = require('josi/utilities');
var multipart = require('multipart-js/multipart');

this.Server = function(dir) {
  var app = require(dir + '/app');
  if (!app.router) {
    var controllerFactory = new routing.ModuleControllerFactory(dir);
    app.router = new routing.ControllerRouter(controllerFactory);
  }
  if (!app.templater) {
    app.templater = new templating.MicroTemplatingEngine();
  }
  app.init();
  
  var processActionResult = function(actionResult, context) {
    if (actionResult instanceof actionresults.ActionResult) {
      if (actionResult instanceof actionresults.ViewResult) {
        actionResult.view = 'views/' + (actionResult.context.controller || context.route.controller) +
          '/' + (actionResult.context.action || context.route.action) + '.html';
        actionResult.master = 'views/master.html';
      }
      return actionResult;
    } else if (actionResult instanceof Object) {
      return actionresults.json(actionResult);
    } else if (typeof actionResult === 'string') {
      return actionresults.raw(actionResult);
    } else {
      // todo: better error message when action result not instance of ActionResult
      return actionresults.error('Bad action result.');
    }
  };
  
  var server = http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url);
    var routeResult = app.router.route(parsedUrl.pathname);
    var actionContext = {
      route: routeResult.route || {},
      query: querystring.parse(parsedUrl.query),
      form: {},
      files: {}
    };
    var callback = function() {
      actionContext.params = utilities.merge(actionContext.query, actionContext.form);
      if (actionContext.route.controller) {
        actionContext.params.controller = actionContext.route.controller;
      }
      if (actionContext.route.action) {
        actionContext.params.action = actionContext.route.action;
      }
      try {
        var actionResult;
        if (routeResult instanceof RouteResult) {
          if (routeResult instanceof MissingRouteResult) {
            actionResult = actionresults.notFound(routeResult.message || 'No route matched the url: ' + parsedUrl.pathname);
          } else if (routeResult instanceof ErrorRouteResult) {
            actionResult = actionresults.error(routeResult.error);
          } else {
            actionResult = routeResult.action.apply(actionContext);
          }
        } else {
          throw new Error('Result from router not an instance of RouteResult.');
        }
        actionResult = processActionResult(actionResult, actionContext);
        actionResult.execute(req, res, app);
      } catch (e) {
        actionresults.error(e).execute(req, res);
      }
    };
    var contentType = req.headers['content-type'] || req.headers['Content-Type'];
    if (contentType && /multipart\/form-data/.test(contentType)) {
      var currentPart;
      var parser = multipart.parser();
      parser.headers = req.headers;
      parser.onPartBegin = function(part) {
        currentPart = {
          name: part.name,
          filename: part.filename,
          data: ''
        };
      };
      parser.onPartEnd = function(part) {
        if (part) {
          if (currentPart.filename) {
            actionContext.files[currentPart.name] = currentPart;
          } else {
            actionContext.form[currentPart.name] = currentPart.data;
          }
        }
      };
      parser.onData = function(data) {
        // todo: write to tmp file, rather than buffering
        currentPart.data += data;
      };
      req.addListener('data', function(chunk) {
        parser.write(chunk);
      });
      req.addListener('end', function() {
        parser.close();
        callback();
      });
    } else {
      var postedBody = '';
      req.addListener('data', function(chunk) {
        postedBody += chunk;
      });
      req.addListener('end', function() {
        actionContext.form = querystring.parse(postedBody);
        callback();
      });
    }
    req.addListener('error', function(error) {
      // todo: deal with request error
    });
  });
  
  this.listen = function(port) {
    server.listen(port);
  };
};
