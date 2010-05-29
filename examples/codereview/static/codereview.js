$('form').submit(function() {
  var msg = $('#msg');
  $.get('/home/send?msg=' + msg.val());
  msg.val('');
  return false;
});

// long poll
var poll = function() {
  $.get('/home/listen/', function(data) {
    $('body').append('<p>' + data + '</p>');
    poll();
  });
};
poll();
