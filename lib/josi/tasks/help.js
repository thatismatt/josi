var sys = require('sys');
var package = require('josi/package');

this.task = {
  name: 'help',
  doc: 'print this message',
  execute: function(opts, args, tasks) {
    sys.puts('josi ' + package.version + ' by ' + package.author);
    sys.puts('Usage:\tjosi task [opts]\tRun the specified task.');
    sys.puts('      \tjosi app_name   \tCreate a josi app called app_name. Alias to "josi create app_name"');
    sys.puts('Where task is one of the following: ');
    tasks.forEach(function(task) {
      sys.puts('\t' + task.name + (task.doc ? '\t\t' + task.doc : ''));
      if (task.opts) {
        sys.puts('\t\t' + task.opts);
      }
    });
  }
};
