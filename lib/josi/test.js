var sys = require('sys');
var path = require('path');

require('josi/class');

var red   = function(str) { return "\033[31m" + str + "\033[39m"; };
var green = function(str) { return "\033[32m" + str + "\033[39m"; };
var bold  = function(str) { return "\033[1m"  + str + "\033[22m"; };

var putsResults = function(passes, fails) {
  sys.puts('passes: ' + green(passes) + ' fails: ' + red(fails));
};

this.Runner = Class.extend({
  init: function(suites) {
    this.suites = suites;
  },
  run: function() {
    var totalPasses = 0;
    var totalFails = 0;
    var failDetails = [];

    this.suites.forEach(function(suiteFilename) {
      var suite = require(suiteFilename);
      sys.print('Suite: ' + suite.name + ' ');
      var passes = 0;
      var fails = 0;
      for (var testName in suite.tests) {
        var test = suite.tests[testName];
        try {
          test();
          passes++;
        } catch (e){
          fails++;
          failDetails.push({ suite: suite.name, test: testName, error: e });
        }
        sys.print('.');
      }
      sys.puts('');
      putsResults(passes, fails);
  
      totalPasses += passes;
      totalFails += fails;
    });

    sys.puts('Totals');
    putsResults(totalPasses, totalFails);

    if (totalFails) {
      failDetails.forEach(function(fd) {
        sys.puts(fd.suite + ' - ' + fd.test);
        sys.puts(fd.error.stack);
      });
    }
  }
});
