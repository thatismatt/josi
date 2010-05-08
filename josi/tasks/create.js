var sys = require('sys');
var fs = require('fs');

var utilities = require('josi/utilities');

this.task = {
  name: 'create',
  doc: 'create a new josi app',
  execute: function(opts) {
    var appName = opts.name;
    if (utilities.fileOrDirectoryExists(appName)) {
      sys.puts('Can\'t create a new Josi app with the name "' + appName + '",' +
        ' as a file or directory with that name already exists.');
      return;
    }
    sys.puts('Creating Josi app...');
    createApp(appName);
    sys.puts('Josi app created. Type "cd ' + appName + '; josi run" to start the web server.');
  },
}

var createApp = function(appName) {
  fs.mkdirSync(appName, 511);
  fs.writeFileSync(appName + '/app.js',
    [
      'this.init = function() {',
      '  this.router.add(',
      '    // this route matches: /<controller>/<action>/<id>',
      '    /^\\/(?:(\\w+)\\/?)?(?:(\\w+)\\/?)?(?:([0-9]+)\\/?)?$/,',
      '    { controller: \'home\', action: \'index\' }',
      '  );',
      '};', ''
    ].join('\r\n')
  );
  createController(appName, 'home');
  fs.mkdirSync(appName + '/views', 511);
  fs.writeFileSync(appName + '/views/master.html',
    [
      '<html>',
      '  <head><title><%= title %></title></head>',
      '  <body>',
      '    <h1><%= title %></h1>',
      '    <%= main %>',
      '  </body>',
      '</html>', ''
    ].join('\r\n')
  );
  createView(appName, 'home', 'index');
};

var createController = function(appName, controllerName) {
  var controllersDir = appName + '/controllers';
  if (!utilities.fileOrDirectoryExists(controllersDir)) {
    fs.mkdirSync(controllersDir, 511);
  }
  fs.writeFileSync(appName + '/controllers/' + controllerName + '.js',
    [
      'var view = require(\'josi/results\').view;',
      '',
      'this.index = function() {',
      '  return view({',
      '    title: \'' + appName + ' - A Josi App\',',
      '    name: \'' + appName + '\'',
      '  });',
      '};', ''
    ].join('\r\n')
  );
};

var createView = function(appName, controllerName, viewName) {
  var viewsDir = appName + '/views';
  if (!utilities.fileOrDirectoryExists(viewsDir)) {
    fs.mkdirSync(viewsDir, 511);
  }
  viewsDir = viewsDir + '/' + controllerName;
  if (!utilities.fileOrDirectoryExists(viewsDir)) {
    fs.mkdirSync(viewsDir, 511);
  }
  fs.writeFileSync(appName + '/views/' + controllerName + '/' + viewName + '.html',
    [
      '<p>App name: <b><%= name %></b></p>', ''
    ].join('\r\n')
  );
};
