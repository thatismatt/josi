var results = require('josi/results');
var redirect = results.redirect;
var view = results.view;

this.index = function() { return view({ title: 'A Title', name: 'Kate' }); };
this.redir = function() { return redirect('/product/details/1'); }
