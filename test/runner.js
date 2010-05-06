var sys = require('sys');
var path = require('path');

try {
  var utilities = require('josi/utilities');
}
catch(err) {
  // if that isn't on the path then assume the script being run is
  // in the source, so add the directory of the script to the path.
  if(err.message == "Cannot find module 'josi/utilities'") {
    require.paths.push(path.normalize(path.dirname(__filename) + '/..'));
    var utilities = require('josi/utilities');
  }
}

var testsuites = [ 'routing', 'results' ];

var totalpasses = 0;
var totalfails = 0;
var failDetails = [];

testsuites.forEach(function(suitename) {
  sys.print('Suite: ' + suitename + ' ');
  var suite = require('./' + suitename);
  var passes = 0;
  var fails = 0;
  for (var testname in suite.tests) {
    var test = suite.tests[testname];
    try {
      test();
      passes++;
    } catch (e){
      fails++;
      failDetails.push({ suite: suitename, test: testname, error: e });
    }
    sys.print('.');
  }
  sys.puts('');
  sys.puts('passes: ' + passes + ' fails: ' + fails);
  
  totalpasses += passes;
  totalfails += fails;
});

sys.puts('Totals');
sys.puts('passes: ' + totalpasses + ' fails: ' + totalfails);

if (totalfails) {
  failDetails.forEach(function(fd) {
    sys.puts(fd.suite + ' - ' + fd.test);
    sys.puts(fd.error.stack);
  });
}
