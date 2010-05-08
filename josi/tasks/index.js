var help = require('josi/tasks/help');
var newapp = require('josi/tasks/new');
var run = require('josi/tasks/run');
var test = require('josi/tasks/test');
var version = require('josi/tasks/version');

var tasks = [
  help.task,
  newapp.task,
  run.task,
  test.task,
  version.task
];

var getAllMatching = function(name) {
  var r = new RegExp('^' + name);
  return tasks
    .filter(function(t) {
      return r.test(t.name);
    });
};

var getFirstMatching = function(name) {
  return getAllMatching(name)[0];
};

this.tasks = tasks;
this.getAllMatching = getAllMatching;
this.getFirstMatching = getFirstMatching;
