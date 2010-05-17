var sys = require('sys');
var fs = require('fs');
var path = require('path');

var utilities = require('josi/utilities');
var Runner = require('josi/test').Runner;

this.task = {
  name: 'test',
  doc: 'run the app\'s tests',
  opts: 'suite - the suite to run',
  execute: function(opts) {
    if (!utilities.fileOrDirectoryExists('tests')) {
      sys.puts('This josi app contains no tests.')
      return;
    }
    var cwd = process.cwd();
    var tests = fs.readdirSync('tests')
      .map(function(t) { return utilities.stripExtension(t); });
    if (opts.suite) {
      tests = tests.filter(function(t) { return t == opts.suite; });
    }
    tests = tests.map(function(t) { return path.join(cwd, 'tests', t); });
    var runner = new Runner(tests);
    runner.run();
  }
};
