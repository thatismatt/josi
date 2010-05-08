var sys = require('sys');
var package = require('josi/package');

this.task = {
  name: 'help',
  doc: "print this message",
  execute: function(opts, tasks) {
    sys.puts('josi ' + package.version + ' by ' + package.author);
    sys.puts('Usage:\tjosi task [opts]');
    sys.puts(      '\tjosi app_name [opts]');
    sys.puts('Where task is one of the following: ');
    tasks.forEach(function(task) {
      sys.puts('\t' + task.name + (task.doc ? '\t\t' + task.doc : ''));
      if (task.opts) {
        sys.puts('\t\t' + task.opts);
      }
    });
  }
};
