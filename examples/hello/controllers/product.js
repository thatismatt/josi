var view = require('josi/actionresults').view;

var products = {
  '1': { name: 'Raspberry Jam', price: '$1.99' },
  '2': { name: 'Marmalade', price: '$2.99' },
  '3': { name: 'Lemon Curd', price: '$2.49' },
  '4': { name: 'Chocolate Spread', price: '$1.99' }
};

exports.index = function() {
  return view({ title: 'List of products', products: products });
};

exports.details = function() {
  var id = this.route[0];
  return products[id];
};
