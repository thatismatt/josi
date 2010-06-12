var tasks = [];

this.list = function() {
  return tasks;
};

this.get = function(id) {
  return tasks[id];
};

this.save = function(task) {
  if (!task.id) {
    tasks.push(task);
  } else {
    tasks[task.id] = task;
  }
};

// test data
tasks.push(
  { title: 'Go for a jog', details: 'Run miles, and miles, and miles.' },
  { title: 'Sleep', details: 'I love sleep.' },
  { title: 'Read a book', details: 'Read a book by someone famous.' }
);
