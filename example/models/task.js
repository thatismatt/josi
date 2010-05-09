var Task = function(title) {
  this.due = new Date();
  this.title = title || 'New Task';
  this.complete = false;
  this.done = function() {
    this.complete = true;
  };
};

Task.fromJSON = function(json) {
  var task = new Task(json.title);
  task.due = json.due;
  task.complete = json.complete;
};

this.Task = Task;
