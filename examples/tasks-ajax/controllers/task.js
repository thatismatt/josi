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
  if (this.params.title) {
    tasks.save({ title: this.params.title, description: this.params.description || 'No description.' });    
    return redirect('/task/');
  } else {
    return view({ title: 'New Task' });
  }
};

this.done = function() {
  if (this.params.id) {
    tasks.update(this.params.id, { completed: true });
    return { success: true };
  } else {
    return { success: false, error: 'Argument "id" missing.' };
  }
};

this.undone = function() {
  if (this.params.id) {
    tasks.update(this.params.id, { completed: false });
    return { success: true };
  } else {
    return { success: false, error: 'Argument "id" missing.' };
  }
};
