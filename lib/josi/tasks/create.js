var sys = require('sys');
var fs = require('fs');

var utilities = require('josi/utilities');

this.task = {
  name: 'create',
  doc: 'create a new josi app or components of an existing josi app',
  execute: function(opts, args) {
    if (args.length < 2) {
      var appName = opts.name || args[0];
      if (!appName) {
        sys.puts('ERROR: When creating a josi app you must specify its name.');
        return;
      }
      if (utilities.fileOrDirectoryExists(appName)) {
        sys.puts('ERROR: Can\'t create a josi app named "' + appName + '",' +
          ' as a file or directory with that name already exists.');
        return;
      }
      sys.puts('Creating app...');
      createApp(appName);
      sys.puts('App created. Type "cd ' + appName + '; josi run" to start the web server.');
    } else {
      if (!utilities.cwdContainsApp()) {
        sys.puts('ERROR: The creation of josi components can only be done within a josi app.');
        return;
      }
      var component = args[0].toLowerCase();
      switch (component) {
        case 'controller':
          sys.puts('Creating controller...');
          createController('.', args[1]);
          createView('.', args[1], 'index');
          sys.puts('Controller created.');
          break;
        case 'action':
          if (args.length != 3) {
            sys.puts('ERROR: The name of the action to be created must be specified.');
            return;
          }
          if (!utilities.fileOrDirectoryExists('controllers/' + args[1] + '.js')) {
            sys.puts('ERROR: The "' + args[1] + '" controller doesn\'t exist.');
            return;
          }
          sys.puts('Creating action...');
          createView('.', args[1], args[2]);
          addActionToController(args[1], args[2]);
          sys.puts('Action created.');
          break;
        // todo: case 'test':
        default:
          sys.puts('ERROR: "' + args[1] + '" is not a valid josi component to create.');
          return;
      }
    }
  },
}

var createApp = function(appName) {
  fs.mkdirSync(appName, 0777);
  fs.writeFileSync(appName + '/app.js',
    [ 'this.init = function() {',
      '  this.router.add(',
      '    // this route matches: /<controller>/<action>/<id>',
      '    /^\\/(?:(\\w+)\\/?)?(?:(\\w+)\\/?)?(?:([0-9]+)\\/?)?$/,',
      '    { controller: \'home\', action: \'index\' }',
      '  );',
      '};', ''
    ].join('\r\n')
  );
  createController(appName, 'home');
  fs.mkdirSync(appName + '/views', 0777);
  createViewMaster(appName);
  createView(appName, 'home', 'index');
};

var createController = function(appName, controllerName) {
  var controllersDir = appName + '/controllers';
  if (!utilities.fileOrDirectoryExists(controllersDir)) {
    fs.mkdirSync(controllersDir, 0777);
  }
  var filename = appName + '/controllers/' + controllerName + '.js';
  if (utilities.fileOrDirectoryExists(filename)) {
    throw new Error('Controller already exists');
  }
  fs.writeFileSync(filename,
    [ 'var view = require(\'josi/actionresults\').view;',
      '',
      'this.index = function() {',
      '  return view({',
      '    title: \'' + (appName == '.' ? 'A josi app' : appName + ' - a josi app') + '\',',
      '    controller: \'' + controllerName + '\',',
      '    action: \'index\',',
      '    description: \'' + (appName == '.' ? 'This' : appName) + ' is a <a href="http://thatismatt.github.com/josi/">josi</a> app\'',
      '  });',
      '};', ''
    ].join('\r\n')
  );
};

var createView = function(appName, controllerName, viewName) {
  var viewsDir = appName + '/views';
  if (!utilities.fileOrDirectoryExists(viewsDir)) {
    fs.mkdirSync(viewsDir, 0777);
  }
  viewsDir = viewsDir + '/' + controllerName;
  if (!utilities.fileOrDirectoryExists(viewsDir)) {
    fs.mkdirSync(viewsDir, 0777);
  }
  var filename = appName + '/views/' + controllerName + '/' + viewName + '.html';
  if (utilities.fileOrDirectoryExists(filename)) {
    throw new Error('View already exists');
  }
  fs.writeFileSync(filename,
    [ '<p>Controller: <b><%= controller %></b></p>',
      '<p>Action: <b><%= action %></b></p>',
      '<p><%= description %></p>', ''
    ].join('\r\n')
  );
};

var createViewMaster = function(appName) {
  fs.writeFileSync(appName + '/views/master.html',
    [ '<html>',
      '  <head>',
      '    <title><%= title %></title>',
      '  </head>',
      '  <body>',
      '    <h1><%= title %></h1>',
      '    <%= main %>',
      '  </body>',
      '</html>', ''
    ].join('\r\n')
  );
};

var addActionToController = function(controllerName, actionName) {
  var writeStream = fs.createWriteStream('controllers/' + controllerName + '.js', { flags: 'a' });
  writeStream.write(
    [ '',
      'this.' + actionName + ' = function() {',
      '  return view({',
      '    title: \'A josi app\',',
      '    controller: \'' + controllerName + '\',',
      '    action: \'' + actionName + '\',',
      '    description: \'This is a <a href="http://thatismatt.github.com/josi/">josi</a> app\'',
      '  });',
      '};', ''
    ].join('\r\n')
  );
  writeStream.end();
};
