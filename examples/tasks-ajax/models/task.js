var dirty = require('dirty/dirty');
var utilities = require('josi/utilities');

// filename is relative to cwd
var dirtyStore = new dirty.Dirty('models/store.dirty');

this.all = function() {
  return dirtyStore
    .filter(function() { return true; });
};

this.get = function(id) {
  return dirtyStore.get(id);
};

this.save = function(obj) {
  if (!obj.id) {
    obj.id = dirty.uuid();
  }
  dirtyStore.set(obj.id, obj);
};

this.update = function(id, obj) {
  var orig = this.get(id);
  // todo: check obj with that id exists
  var updated = utilities.merge(orig, obj);
  this.save(updated);
};
