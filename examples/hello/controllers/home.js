var actionresults = require('josi/actionresults');
var redirect = actionresults.redirect;
var view = actionresults.view;

a.fail();

this.index = function() { return view({ title: 'A Title', name: 'Kate' }); };
this.redir = function() { return redirect('/product/details/1'); }
