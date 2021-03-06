$('.completed').change(function() {
  var $this = $(this);
  $.ajax({
    url: '/task/' + ($this.attr('checked') ? 'done' : 'undone') + '/',
    data: {
      id: $this.parent().attr('id')
    },
    type: 'POST',
    error: function() {
      // todo: deal with error when changing state of task
    },
    success: function() {
      if ($this.attr('checked')) {
        $this.parent().addClass('done');
      } else {
        $this.parent().removeClass('done');
      }
    }
  })
});
