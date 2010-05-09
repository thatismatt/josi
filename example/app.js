this.init = function() {
  this.router.add(
    /^\/(?:(\w+)\/?)?(?:(\w+)\/?)?(?:(\w+)\/?)?$/,
    { controller: 'home', action: 'index' }
  );
};
