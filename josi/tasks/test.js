var sys = require('sys');

this.task = {
  name: 'test',
  execute: function() {
    sys.puts('Test');
    sys.puts(' todo: write tests and run them.')
  }  
};
