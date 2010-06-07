var fs = require('fs');

require('josi/class');
var utilities = require('josi/utilities');

this.ActionResult = ActionResult = Class.extend({
  init: function(body, headers, statusCode) {
    this.statusCode = statusCode || 200;
    this.headers = headers || { 'Content-Type': 'text/html' };
    this.body = body;
  },
  execute: function(req, res) {
    res.writeHead(this.statusCode, this.headers);
    res.write(this.body);
    res.end();
  }
});

this.ViewResult = ViewResult = ActionResult.extend({
  init: function(data, view, master) {
    this._super();
    this.data = data;
    this.view = view;
    this.master = master;
  },
  execute: function(req, res, app) {
    var viewResult = this;
    var execute = this._super;
    app.templater.render(
      this.data,
      function(rendered) {
        viewResult.body = rendered;
        execute.apply(viewResult, [req, res]);
      },
      this.view,
      this.master
    );
  }
});

this.ContentResult = ContentResult = ActionResult.extend({
  init: function(filename) {
    this._super();
    this.filename = filename;
  },
  execute: function(req, res) {
    var contentType = utilities.mime.lookup(utilities.extension(this.filename));
    var encoding = (contentType.slice(0,4) === 'text' ? 'utf8' : 'binary');
    
    var loadResponseData = function(filename, callback, errback) {
      // todo: return an error ActionResult
      fs.readFile(filename, encoding, function (err, data) {
        if (err) {
          errback(err);
          return;
        }
        var headers = {
          'Content-Type': contentType,
          'Content-Length': (encoding === 'utf8')
            ? encodeURIComponent(data).replace(/%../g, 'x').length
            : data.length
        };
        callback(data, headers);
      });
    };
    
    var contentResult = this;
    var execute = this._super
    
    loadResponseData(this.filename, function(body, headers) {
      contentResult.body = body;
      contentResult.headers = headers;
      execute.apply(contentResult, [req, res]);
    }, function(err) {
      if (err.message && err.message == 'ENOENT, No such file or directory') {
        error('The static file "' + contentResult.filename + '" is missing.')
          .execute(req, res);
      }
    });
  }
});

this.AsyncResult = AsyncResult = ActionResult.extend({
  init: function(func) {
    this._super();
    this.func = func;
  },
  execute: function(req, res) {
    res.writeHead(this.statusCode, this.headers);
    this.func(req, res);
  }
});

this.async = function(func) {
  return new AsyncResult(func);
};

this.view = function(data) {
  return new ViewResult(data);
};

this.redirect = function(url) {
  return new ActionResult('Redirecting...', { 'Content-Type': 'text/html',  'Location': url }, 301);
};

this.notFound = function(msg) {
  return new ActionResult(msg || 'Not found.', { 'Content-Type': 'text/html' }, 404);
};

this.error = error = function(err) {
  if (err instanceof Error) {
    var msg = err.message + '\r\n' + err.stack;
  } else {
    var msg = err;
  }
  return new ActionResult(msg, { 'Content-Type': 'text/plain' }, 500);
};

this.raw = function(data) {
  return new ActionResult(data, { 'Content-Type': 'text/plain' });
};

this.json = function(data) {
  return new ActionResult(data, { 'Content-Type': 'application/json' });
};

this.content = function(filename) {
  return new ContentResult(filename);
};
