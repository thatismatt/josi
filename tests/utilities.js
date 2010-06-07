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
  },
  'First argument is task': function() {
    var processed = utilities.processARGV(['', '', 'atask']);
    assert.equal(processed.task, 'atask');
  },
  'Dashes are ignored': function() {
    var processed = utilities.processARGV(['', '', 'atask', '-a=b']);
    assert.equal(processed.opts.a, 'b');
  },
  'Double dashes are ignored': function() {
    var processed = utilities.processARGV(['', '', 'atask', '--a=b']);
    assert.equal(processed.opts.a, 'b');
  },
  'Dashes not required': function() {
    var processed = utilities.processARGV(['', '', 'atask', 'a=b']);
    assert.equal(processed.opts.a, 'b');
  },
  'If not key value pair then it is an arg': function() {
    var processed = utilities.processARGV(['', '', 'atask', 'arg']);
    assert.equal(processed.args[0], 'arg');
  },
  'Opt keys are case insensitive': function() {
    var processed = utilities.processARGV(['', '', 'atask', 'CaMel=b', 'c=HumPs', 'third=alongerthing']);
    assert.equal(processed.opts.camel, 'b');
    assert.equal(processed.opts.c, 'HumPs');
    assert.equal(processed.opts.third, 'alongerthing');
  },
  'Opt values are case sensitive': function() {
    var processed = utilities.processARGV(['', '', 'atask', 'CaMel=b']);
    assert.equal(processed.opts.camel, 'b');
  },
  'Args are case sensitive': function() {
    var processed = utilities.processARGV(['', '', 'atask', 'HumPs']);
    assert.equal(processed.args[0], 'HumPs');
  },
  'Multiple opts work': function() {
    var processed = utilities.processARGV(['', '', 'atask', 'a=b', 'c=100', 'third=alongerthing']);
    assert.equal(processed.opts.a, 'b');
    assert.equal(processed.opts.c, '100');
    assert.equal(processed.opts.third, 'alongerthing');
  },
  'Multiple args work': function() {
    var processed = utilities.processARGV(['', '', 'atask', 'arg1', 'arg2', 'arg3']);
    assert.equal(processed.args[0], 'arg1');
    assert.equal(processed.args[1], 'arg2');
    assert.equal(processed.args[2], 'arg3');
  }
};
