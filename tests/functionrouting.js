var assert = require('assert');

var test = require('josi/test');
var utilities = require('josi/utilities');
var FunctionRouter = require('josi/routing').FunctionRouter;

this.name = 'Function Router Tests';

var createRouter = function() {
  var router = new FunctionRouter();
  router.add(/^(a)(route)$/, test.createMockFunction('route a'));
  router.add(/^broute$/, test.createMockFunction('route b'));
  return router;
};

this.tests = {
  'Result is a RouteResult': function() {
    var router = createRouter();
    var result = router.route('aroute');
    assert.ok(result instanceof RouteResult);
  },
  'Route function is not evaluated': function() {
    var router = createRouter();
    var result = router.route('aroute');
    assert.ok(!result.action.isCalled());
  },
  'Result\'s action is correct': function() {
    var router = createRouter();
    var aResult = router.route('aroute');
    assert.equal('route a', aResult.action.getName());
  },
  'Result\'s action is correct with multiple routes': function() {
    var router = createRouter();
    var aResult = router.route('aroute');
    var bResult = router.route('broute');
    assert.equal('route a', aResult.action.getName());
    assert.equal('route b', bResult.action.getName());
  },
  'Result\'s route data is correct': function() {
    var router = createRouter();
    var result = router.route('aroute');
    assert.ok(result.route.contains('a'));
    assert.ok(result.route.contains('route'));
  },
  'When no matching route result is a RouteResult': function() {
    var router = createRouter();
    var result = router.route('notaroute');
    assert.ok(result instanceof RouteResult);
  },
  'When no matching route result is a MissingRouteResult': function() {
    var router = createRouter();
    var result = router.route('notaroute');
    assert.ok(result instanceof MissingRouteResult);
  },
  'When no matching route result has no action': function() {
    var router = createRouter();
    var result = router.route('notaroute');
    assert.ok(!result.action);
  },
};
