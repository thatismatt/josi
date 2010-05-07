var run = require('josi/tasks/run');


this.tasks = tasks = [
  {
    name: 'new',
    execute: function(opts) {
      var appName = opts.name;
      if (utilities.fileOrDirectoryExists(appName)) {
        sys.puts('Can\'t create a new Josi app with the name "' + appName + '",' +
          ' as a file or directory with that name already exists.');
        return;
      }
      sys.puts('Creating Josi app...');
      fs.mkdirSync(appName, 511);
      fs.mkdirSync(appName + '/controllers', 511);
      fs.mkdirSync(appName + '/views', 511);
      fs.mkdirSync(appName + '/views/home', 511);
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
      fs.writeFileSync(appName + '/controllers/home.js',
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
      fs.writeFileSync(appName + '/views/home/index.html',
        [
          '<p>App name: <b><%= name %></b></p>', ''
        ].join('\r\n')
      );
      sys.puts('Josi app created. Type "cd ' + appName + '; josi run" to start the web server.');
    },
  },
  {
    name: 'help',
    execute: function() {
      sys.puts('Help');
      sys.puts(' todo: write help message.')
    }  
  },
  run.task,
  {
    name: 'test',
    execute: function() {
      sys.puts('Test');
      sys.puts(' todo: write tests and run them.')
    }  
  },
  {
    name: 'version',
    execute: function() {
      sys.puts(version);
    }
  }
];
