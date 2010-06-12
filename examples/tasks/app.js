this.init = function() {
  this.router.add(
    // this route matches: /<controller>/<action>/<id>
    /^\/(?:(\w+)\/?)?(?:(\w+)\/?)?(?:([0-9]+)\/?)?$/,
    { controller: 'home', action: 'index' }
  );
};
