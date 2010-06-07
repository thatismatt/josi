this.init = function() {
  this.router.addStatic('static');
  this.router.add(
    /^\/(?:(\w+)\/?)?(?:(\w+)\/?)?(?:(\w+)\/?)?$/,
    { controller: 'home', action: 'index' }
  );
};
