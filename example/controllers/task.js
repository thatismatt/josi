var actionresults = require('josi/actionresults');
var view = actionresults.view;
var redirect = actionresults.redirect;

var tasks = require('../models/task')

this.index = function() {
  return view({ title: 'Tasks', tasks: tasks.all() });
};

this.details = function() {
  var id = this.route[0];
  return view(tasks.get(id));
};

this.create = function() {
  tasks.save({ title: 'A Task' });
  return redirect('/task/');
};
