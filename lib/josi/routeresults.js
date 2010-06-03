require('josi/class');

this.RouteResult = RouteResult = Class.extend({
  init: function(action, route) {
    this.action = action;
    this.route = route;
  }
});

this.MissingRouteResult = MissingRouteResult = RouteResult.extend({
  init: function(msg) {
    this.message = msg || 'No route was matched.';
  }
});

this.ErrorRouteResult = ErrorRouteResult = RouteResult.extend({
  init: function(error) {
    this.error = error;
  }
});

this.missingRoute = function(msg) {
  return new MissingRouteResult(msg);
};
