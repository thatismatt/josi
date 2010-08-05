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
setTimeout(function(){poll();},1);//chromium/chrome fix : setTimeout to end the loading state