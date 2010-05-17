var assert = require('assert');

var test = require('josi/test');
var results = require('josi/results');
var ControllerRouter = require('josi/routing').ControllerRouter;

this.name = 'Controller Router Tests';

var createRouter = function(setRouterDefaults) {
  var factory = {
    getController: function(controllerName) {
      if (controllerName == 'missing') {
        return;
      } else {
        return {
          index: test.createMockFunction(controllerName + ' controller, index action')
        };
      }
    }
  };
  var router = new ControllerRouter(factory);
  router.add(
    /^\/(?:(\w+)\/?)?(?:(\w+)\/?)?(?:(\w+)\/?)?$/,
    setRouterDefaults ?
      { controller: 'home', action: 'index' } :
      {}
  );
  // router.add(/^broute$/, test.createMockFunction('route b'));
  return router;
};

this.tests = {
  'Result is a RouteResult': function() {
    var router = createRouter();
    var result = router.route('/');
    assert.ok(result instanceof results.RouteResult);
  },
  'If no controller matched and no default then missing route': function() {
    var router = createRouter();
    var result = router.route('/');
    assert.ok(result instanceof MissingRouteResult);
  },
  'If no controller matched and no default then correct error message': function() {
    var router = createRouter();
    var result = router.route('/');
    assert.equal(result.message, 'No controller was matched in the url and there was no default controller specified.');
  },
  'If no action matched and no default then missing route': function() {
    var router = createRouter();
    var result = router.route('/');
    assert.ok(result instanceof results.MissingRouteResult);
  },
  'If no controller matched fallback to default': function() {
    var router = createRouter(true);
    var result = router.route('/');
    assert.equal(result.action.getName(), 'home controller, index action');
  },
  'If no action matched fallback to default': function() {
    var router = createRouter(true);
    var result = router.route('/product');
    assert.equal(result.action.getName(), 'product controller, index action');
  },
  'If factory doesn\'t return controller then missing route': function() {
    var router = createRouter();
    var result = router.route('/missing');
    assert.ok(result instanceof MissingRouteResult);
  },
  'If factory doesn\'t return controller then correct error message': function() {
    var router = createRouter();
    var result = router.route('/missing');
    assert.equal(result.message, 'The "missing" controller is missing.');
  },
  'If action missing from controller then missing route': function() {
    var router = createRouter();
    var result = router.route('/product/missing');
    assert.ok(result instanceof MissingRouteResult);
  },
  'If action missing from controller then correct error message': function() {
    var router = createRouter();
    var result = router.route('/product/missing');
    assert.equal(result.message, 'The "product" controller doesn\'t have an action called "missing"');
  },
  'Result\'s context has controller set': function() {
    var router = createRouter(true);
    var result = router.route('/');
    assert.equal(result.route.controller, 'home');
  },
  'Result\'s context has action set': function() {
    var router = createRouter(true);
    var result = router.route('/');
    assert.equal(result.route.action, 'index');
  },
};
