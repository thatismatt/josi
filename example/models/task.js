var dirty = require('dirty/dirty');

// filename is relative to cwd
var dirtyStore = new dirty.Dirty('store.dirty');

var Task = function(title) {
  this.due = new Date();
  this.title = title || 'New Task';
  this.complete = false;
  this.done = function() {
    this.complete = true;
  };
};

fromJSON = function(json) {
  var task = new Task(json.title);
  task.due = json.due;
  task.complete = json.complete;
};

this.Task = Task;

this.all = function() {
  return dirtyStore.filter(function() { return true; });
};

this.get = function(taskId) {
  return dirtyStore.get(taskId);
};

this.save = function(obj) {
  obj.id = dirty.uuid();
  dirtyStore.set(obj.id, obj);
};
