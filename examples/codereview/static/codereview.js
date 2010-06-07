$('form').submit(function() {
  var msg = $('#msg');
  $.ajax({
    url: '/home/send',
    type: 'POST',
    data: { msg: msg.val() },
    error: function() {
      // todo: deal with error sending message
    }
  });
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
