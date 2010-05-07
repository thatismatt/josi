var sys = require('sys');
var Server = require('josi/server').Server;

this.task = {
  name: 'run',
  execute: function(opts) {
    var port = parseInt(opts.port) || 8080;
    var server = new Server(process.cwd(), port);
    server.listen();
    sys.puts('Josi server started on http://localhost:' + port + '/.');
    sys.puts('ctrl-c to stop.');
  }
};
