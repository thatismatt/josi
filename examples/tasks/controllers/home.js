var view = require('josi/actionresults').view;

this.index = function() {
  return view({
    title: 'tasks - a josi app',
    controller: 'home',
    action: 'index',
    description: 'tasks is a <a href="http://thatismatt.github.com/josi/">josi</a> app'
  });
};
