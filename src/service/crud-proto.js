(function(CRUD) {

  // Load objects from storage.
  CRUD.load = function() {
    var deferred = this.$q.defer();
    this.storage.get(this.storageKey).then(function(result) {
      this.collection.length = 0; // Reset collection.
      if (result[this.storageKey]) {
        result[this.storageKey].forEach(function(props, index) {
          this.collection.push(
            this.factory(props) // Factory a fresh object.
          );
        }.bind(this));
      }
      deferred.resolve(this.collection);
    }.bind(this), deferred.reject);
    return deferred.promise;
  };

  // Factory & add a project into the collection.
  CRUD.add = function(frag) {
    this.collection.push(
      this.factory(frag || {})
    );
    return this.save(); // return promise.
  };

  // Remove a project from storage and collection.
  CRUD.remove = function(obj) {
    var index = 0;
    var p = this.collection.filter(function(_obj, i) {
      if (_obj.id === obj.id) {
        index = i;
        return true;
      }
      return false;
    });
    if (p[0]) {
      this.collection.splice(index, 1);
    }
    return this.save(); // return promise.
  };

  // Save the current collection to storage.
  CRUD.save = function() {
    return this.storage.put(this.storageKey, this.collection);
  };

  oleo.value('crudProto', CRUD);
})({});

