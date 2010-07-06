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

this.cookie = function() {
  var aCookie = this.cookie.get('a') === 'red' ? 'blue' : 'red';
  var bCookie = (parseInt(this.cookie.get('b'), 10) || 0) + 1;
  this.cookie.set('a', aCookie);
  this.cookie.set('b', bCookie);
  return view({
    title: 'Cookies',
    a: aCookie,
    b: bCookie
  });
};
