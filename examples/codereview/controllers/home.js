var actionresults = require('josi/actionresults');
var view = actionresults.view;
var async = actionresults.async;

var clients = [];

this.index = function() {
  return view({
    title: 'Code Review'
  });
};

this.send = function() {
  var msg = this.params.msg;
  var tmp = clients.slice();
  clients = [];
  tmp.forEach(function(c) {
    c.write(msg);
    c.end();
  });
  return { result: 'success' };
};

this.listen = function() {
  return async(function(req, res) {
    clients.push(res);
    res.socket.onend = function() {
      clients.splice(clients.indexOf(res), 1);
    };
  });
};

this.clients = function() {
  return { clients: clients.length };
};
