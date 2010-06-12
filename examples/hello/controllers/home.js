var actionresults = require('josi/actionresults');
var redirect = actionresults.redirect;
var view = actionresults.view;

this.index = function() {
  return view({
    title: 'A Title',
    details: 'Some details'
  });
};

this.another = function() {
  return view({
    title: 'Another Title',
    details: 'A different action, using the same view.'
  }, 'index');
};

this.redir = function() {
  return redirect('/product/details/1');
};
