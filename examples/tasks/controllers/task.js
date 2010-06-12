var actionresults = require('josi/actionresults');
var view = actionresults.view;
var redirect = actionresults.redirect;
var tasks = require('../models/tasks');

this.index = function() {
  return view({
    title: 'All Tasks',
    tasks: tasks.list()
  });
};

this.details = function() {
  var task = tasks.get(this.route[0]);
  return view({
    title: 'Task Details',
    task: task
  });
};

this.create = function() {
  if (this.form.title) {
    tasks.save({
      title: this.form.title,
      details: this.form.details || 'No details.'
    });
    return redirect('/task/');
  } else {
    return view({ title: 'Create Task' });
  }
};
