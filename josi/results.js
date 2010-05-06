require('josi/class');
var templating = require('josi/templating');
var utilities = require('josi/utilities');

this.Result = Result = Class.extend();

this.ActionResult = ActionResult = Result.extend({
  init: function(body, headers, statusCode) {
    this.statusCode = statusCode || 200;
    this.headers = headers || { 'Content-type': 'text/html' };
    this.body = body;
  },
  execute: function(req, res) {
    res.writeHead(this.statusCode, this.headers);
    res.write(this.body);
    res.end();
  },
});

this.ViewResult = ViewResult = ActionResult.extend({
  init: function(data, view, master) {
    this._super();
    this.data = data;
    this.view = view;
    this.master = master;
  },
  execute: function(req, res) {
    this.body = templating.simple(this.view, this.data);
    if (this.master) {
      // fixme: shouldn't really clobber the users' data
      this.data.main = this.body;
      this.body = templating.simple(this.master, this.data);
    }
    this._super(req, res);
  },
});

this.ContentResult = ContentResult = Result.extend({
  init: function(filename) {
    this.filename = filename;
  },
  execute: function(req, res) {
    utilities.serveFile(req, res, this.filename);
  }
});

this.view = function(data) {
  return new ViewResult(data);
};

this.redirect = function(url) {
  return new ActionResult('Redirecting...', { 'Content-type': 'text/html',  'Location': url }, 301);
};

this.notFound = function(msg) {
  return new ActionResult(msg || 'Not found.', { 'Content-type': 'text/html' }, 404);
};

this.error = function(err) {
  if (err instanceof Error) {
    var msg = err.message + '\r\n' + err.stack;
  } else {
    var msg = err;
  }
  return new ActionResult(msg, { 'Content-type': 'text/plain' }, 500);
};

this.raw = function(data) {
  return new ActionResult(data, { 'Content-type': 'text/plain' });
};

this.json = function(data) {
  return new ActionResult(JSON.stringify(data), { 'Content-type': 'application/json' });
};

this.content = function(filename) {
  return new ContentResult(filename);
};
