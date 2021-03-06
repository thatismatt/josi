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
  app.settings = utilities.merge(
    {
      maxContentLength: 100 * 1024 // 100KB
    },
    app.settings
  );
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
  
  var parseCookies = function(header) {
    var cookies = {};
    if (header) {
      header
        .split(';')
        .forEach(function(cookie) {
          var pair = cookie.split('=');
          pair = pair.map(function(p) { return p.trim(); });
          pair.length === 1 ?
            cookies[''] = pair[0] :
            cookies[pair[0]] = pair[1];
        });
    }
    return cookies;
  };
  
  var server = http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url);
    var cookie = (function() {
      var reqCookies = parseCookies(req.headers['cookie']);
      var resCookies = {};
      return {
        get: function(key) {
          return reqCookies[key];
        },
        // todo: enable cookie expiry, domain, path & secure
        set: function(key, value) {
          resCookies[key] = value;
        },
        toHeaders: function() {
          var cookies = [];
          for (var key in resCookies) {
            cookies.push(key + '=' + resCookies[key] + '; path=/;');
          }
          return cookies;
        }
        // todo: enable cookie removal
      };
    })();
    var routeResult = app.router.route(parsedUrl.pathname);
    var actionContext = {
      route: routeResult.route || {},
      query: querystring.parse(parsedUrl.query),
      form: {},
      files: {},
      cookie: cookie
    };
    var callback = function(err) {
      if (err) {
        actionresults.error(err, 413).execute(req, res);
        return;
      }
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
        var cookieHeaders = cookie.toHeaders();
        if (cookieHeaders) {
          cookieHeaders.forEach(function(header) {
            actionResult.headers.push(['Set-Cookie', header]);
          });
        }
        actionResult.execute(req, res, app);
      } catch (e) {
        actionresults.error(e).execute(req, res);
      }
    };
    var contentType = req.headers['content-type'] || req.headers['Content-Type'];
    var contentLength = parseInt(req.headers['content-length'] || req.headers['Content-Length'], 10);
    if (contentLength > app.settings.maxContentLength) {
      callback(new Error('Max content length exceeded'));
      return;
    }
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
