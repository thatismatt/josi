var sys = require('sys');

var package = require('josi/package');

this.task = {
  name: 'version',
  execute: function() {
    sys.puts(package.version);
  }
};
