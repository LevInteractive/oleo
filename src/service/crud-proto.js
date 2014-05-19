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
        }, this);
        console.info("loaded ", this.storageKey, this.collection);
        if (this._onLoad) {
          this._onLoad();
        }
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
    console.info("added ", this.storageKey, this.collection[this.collection.length-1]);
    if (this._onAdd) {
      this._onAdd(this.collection[this.collection.length-1]);
    }
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
      console.info("removed ", this.storageKey, p[0]);
      this.collection.splice(index, 1);
      if (this._onRemove) {
        this._onRemove(p[0], index);
      }
    }
    return this.save(); // return promise.
  };

  // Save the current collection to storage.
  CRUD.save = function() {
    console.info("saved ", this.storageKey, this.collection);
    if (this._onSave) {
      this._onSave();
    }
    return this.storage.put(this.storageKey, this.collection);
  };

  oleo.value('crudProto', CRUD);
})({});

