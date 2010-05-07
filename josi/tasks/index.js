var help = require('josi/tasks/help');
var newapp = require('josi/tasks/new');
var run = require('josi/tasks/run');
var test = require('josi/tasks/test');
var version = require('josi/tasks/version');

this.tasks = tasks = [
  help.task,
  newapp.task,
  run.task,
  test.task,
  version.task
];
