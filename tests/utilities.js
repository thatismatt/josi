var assert = require('assert');
var utilities = require('josi/utilities');

this.name = 'Utilities Tests';

this.tests = {
  'Extension is stripped': function() {
    var result = utilities.stripExtension('index.html');
    assert.equal(result, 'index');
  },
  'Extensionless filename is unchanged': function() {
    var result = utilities.stripExtension('index');
    assert.equal(result, 'index');
  },
  'Trailing dot is stripped': function() {
    var result = utilities.stripExtension('index.');
    assert.equal(result, 'index');
  },
  'Other dots in file ignored': function() {
    var result = utilities.stripExtension('index.2.html');
    assert.equal(result, 'index.2');
  }
};
