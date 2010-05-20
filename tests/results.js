var assert = require('assert');
var actionresults = require('josi/actionresults');

this.name = 'Results Tests';

this.tests = {
  'Content Type of view is HTML': function() {
    var result = actionresults.view({});
    assert.equal(result.headers['Content-Type'], 'text/html');
  },
  'Content Type of json is json': function() {
    var result = actionresults.json({});
    assert.equal(result.headers['Content-Type'], 'application/json');
  },
};
