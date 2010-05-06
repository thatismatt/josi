//var sys = require('sys');

var assert = require('assert');
var results = require('josi/results');

this.tests = {
  'Content Type of view is HTML': function() {
    var result = results.view({});
    assert.equal(result.headers['Content-type'], 'text/html');
  },
  'Content Type of json is json': function() {
    var result = results.json({});
    assert.equal(result.headers['Content-type'], 'application/json');
  },
}
