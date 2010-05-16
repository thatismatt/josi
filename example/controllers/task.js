var results = require('josi/results');
var view = results.view;
var redirect = results.redirect;

var tasks = require('../models/task')

this.index = function() {
  return view({ title: 'Tasks', tasks: tasks.all() });
};

this.details = function() {
  var id = this.route[2];
  return view(tasks.get(id));
};

this.create = function() {
  tasks.save({ title: 'A Task' });
  return redirect('/task/');
};
