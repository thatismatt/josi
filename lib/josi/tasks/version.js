var sys = require('sys');

var package = require('josi/package');

this.task = {
  name: 'version',
  doc: 'print the version number',
  execute: function() {
    sys.puts(package.version);
  }
};
