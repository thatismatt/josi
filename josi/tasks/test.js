var sys = require('sys');
var fs = require('fs');
var path = require('path');

var utilities = require('josi/utilities');
var Runner = require('josi/test').Runner;

this.task = {
  name: 'test',
  doc: 'run the app\'s tests',
  execute: function() {
    if (!utilities.fileOrDirectoryExists('tests')) {
      sys.puts('This josi app contains no tests.')
      return;
    }
    var cwd = process.cwd();
    var tests = fs.readdirSync('tests')
      .map(function(t) { return path.join(cwd, 'tests', utilities.stripExtension(t)); });
    var runner = new Runner(tests);
    runner.run();
  }
};
