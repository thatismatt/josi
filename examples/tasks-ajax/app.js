this.init = function() {
  this.router.add(
    /^\/(?:(\w+)\/?)?(?:(\w+)\/?)?(?:(\w+)\/?)?$/,
    { controller: 'task', action: 'index' }
  );
  this.router.addStatic('static');
};
