var assert = require('assert');
var actionresults = require('josi/actionresults');

this.name = 'Results Tests';

var getHeader = function(headers, key) {
  for (var i in headers) {
    var header = headers[i];
    if (header[0] === key) {
      return header[1];
    }
  }
};

this.tests = {
  'Content Type of view is HTML': function() {
    var result = actionresults.view({});
    assert.equal(getHeader(result.headers, 'Content-Type'), 'text/html');
  },
  'Content Type of json is json': function() {
    var result = actionresults.json({});
    assert.equal(getHeader(result.headers, 'Content-Type'), 'application/json');
  },
  'Content Type of raw is plain text': function() {
    var result = actionresults.raw({});
    assert.equal(getHeader(result.headers, 'Content-Type'), 'text/plain');
  },
  'Content Type of error is plain text': function() {
    var result = actionresults.error({});
    assert.equal(getHeader(result.headers, 'Content-Type'), 'text/plain');
  },
};
