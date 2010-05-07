var sys = require('sys');
var utilities = require('josi/utilities');
var Runner = require('josi/test').Runner;

this.task = {
  name: 'test',
  execute: function() {
    if (utilities.cwdContainsApp()) {
      sys.puts('Test');
      sys.puts(' todo: run this josi app\'s tests.');
    } else {
      var runner = new Runner([ '../tests/routing', '../tests/results' ]);
      runner.run();      
    }
  }
};
