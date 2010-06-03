var sys = require('sys');
var Server = require('josi/server').Server;

this.task = {
  name: 'run',
  doc: 'start the josi web server',
  opts: 'port - port number for the server to listen on',
  appOnly: true,
  execute: function(opts) {
    var port = parseInt(opts.port) || 8080;
    var server = new Server(process.cwd());
    server.listen(port);
    sys.puts('josi server started on http://localhost:' + port + '/.');
    sys.puts('ctrl-c to stop.');
  }
};
