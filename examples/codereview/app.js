this.init = function() {
  this.router.add(
    /^\/(?:(\w+)\/?)?(?:(\w+)\/?)?(?:([0-9]+)\/?)?$/,
    { controller: 'home', action: 'index' }
  );
  this.router.addStatic('static');
};
