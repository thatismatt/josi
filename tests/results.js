var assert = require('assert');
var results = require('josi/results');

this.name = 'Results Tests';

this.tests = {
  'Content Type of view is HTML': function() {
    var result = results.view({});
    assert.equal(result.headers['Content-Type'], 'text/html');
  },
  'Content Type of json is json': function() {
    var result = results.json({});
    assert.equal(result.headers['Content-Type'], 'application/json');
  },
};
