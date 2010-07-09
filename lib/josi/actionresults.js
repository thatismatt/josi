var fs = require('fs');

require('josi/class');
var utilities = require('josi/utilities');

this.ActionResult = ActionResult = Class.extend({
  init: function(body, headers, statusCode) {
    this.statusCode = statusCode || 200;
    this.headers = headers || [ ['Content-Type', 'text/html'] ];
    this.body = body;
  },
  execute: function(req, res) {
    res.writeHead(this.statusCode, this.headers);
    if (this.body) {
      res.write(this.body);
    }
    res.end();
  }
});

this.ViewResult = ViewResult = ActionResult.extend({
  init: function(data, action, controller) {
    this._super();
    this.data = data;
    this.context = {
      controller: controller,
      action: action
    };
  },
  execute: function(req, res, app) {
    var viewResult = this;
    var execute = this._super;
    app.templater.render(
      this.data,
      function(err, rendered) {
        if (err) {
          error(err).execute(req, res);
          return;
        }
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
    this._super(null, []);
    this.filename = filename;
  },
  execute: function(req, res) {
    var self = this;
    var filename = this.filename;
    fs.stat(filename, function(err, stat) {
      if (err) {
        if (err.errno && err.errno === 2) {
          notFound('Static content not found.').execute(req, res);
          return;
        }
      }
      var etag = Number(stat.mtime);
      if (req.headers['if-none-match'] &&
          req.headers['if-none-match'] == etag) {
        notModified().execute(req, res);
        return;
      }
      self.headers.push(['Content-Length', stat.size]);
      self.headers.push(['ETag', etag]);
      var first = true;
      var stream = fs.createReadStream(filename);
      stream
        .addListener('error', function(err) {
          if (first) {
            return error(err).execute(req, res);
          }
          stream.destroy();
          req.end();
        })
        .addListener('data', function(data){
          if (first) {
            first = false;
            var contentType = utilities.mime.lookup(utilities.extension(filename));
            self.headers.push(['Transfer-Encoding', 'chunked']);
            self.headers.push(['Content-Type', contentType]);
            res.writeHead(200, self.headers);
          }
          res.write(data, 'binary');
        })
        .addListener('end', function() {
          res.end();
        });
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

this.view = function(data, action, controller) {
  return new ViewResult(data, action, controller);
};

this.redirect = function(url) {
  return new ActionResult('Redirecting...', [ ['Content-Type', 'text/html'], ['Location', url] ], 301);
};

this.notFound = notFound = function(msg) {
  return new ActionResult(msg || 'Not found.', [ ['Content-Type', 'text/html'] ], 404);
};

this.notModified = notModified = function() {
  return new ActionResult(null, [], 304);
};

this.error = error = function(err, httpStatusCode) {
  var msg = err instanceof Error ? err.message + '\r\n' + err.stack : err;
  return new ActionResult(msg, [ ['Content-Type', 'text/plain'] ], httpStatusCode || 500);
};

this.raw = function(data) {
  return new ActionResult(data, [ ['Content-Type', 'text/plain'] ]);
};

this.json = function(data) {
  return new ActionResult(JSON.stringify(data), [ ['Content-Type', 'application/json'] ]);
};

this.content = function(filename) {
  return new ContentResult(filename);
};
