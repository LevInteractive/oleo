
// This is an abstract object for tasks and projects containing
// basic CRUD methods which interface the storage system.
// This actually gets assigned to a value instead of a service
// since it's just an object that will be extended by services.
//
// Dependency Injection:
//  - storageKey
//  - storage
//  - collection
//  - factory
//

(function(CRUD) {
  'use strict';

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
    var factory = this.factory(frag || {});
    this.collection.push(factory);
    this.collection.sort(function(m1, m2) {
      return m1.weight > m2.weight;
    });
    if (this._onAdd) {
      this._onAdd(factory);
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
      this.collection.splice(index, 1);
      if (this._onRemove) {
        this._onRemove(p[0], index);
      }
    }
    return this.save(); // return promise.
  };

  // Save the current collection to storage.
  CRUD.save = function() {
    if (this._onSave) {
      this._onSave();
    }
    return this.storage.put(this.storageKey, this.collection);
  };

  // Get by ID.
  // @TODO - memoize this.
  CRUD.byId = function(id) {
    var col = this.collection;
    var model = null;
    for (var i = 0, len = col.length; i < len; i++) {
      if (id === col[i].id) {
        model = col[i];
        break;
      }
    }
    return model;
  };

  oleo.value('crudProto', CRUD);
})({});
