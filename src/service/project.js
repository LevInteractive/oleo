(function() {
  function Service(storageService, $q, projectFactory) {
    this.collection = [];
    this.storage = storageService;
    this.factory = projectFactory;
    this.storageKey = "projects";
    this.$q = $q;
    this.current = {};
  }
  
  Service.prototype = Object.create(angular.injector(['oleo']).get("crudProto"));
  Service.prototype.constructor = Service;

  Service.prototype._onLoad = function() {
    this.collection.forEach(function(proj) {
      if (proj.current) {
        this.select(proj);
      }
    }, this);
  };

  Service.prototype._onAdd = function(proj) {
    this.select(proj);
  };

  Service.prototype._onRemove = function(proj, index) {
    this.unselectAll();
    index = index > 0 ? --index : index; // Select the next project.
    if (this.collection[index]) {
      return this.select(this.collection[index]);
    } else {
      return this.unselectAll();
    }
  };

  Service.prototype.select = function(proj) {
    this.unselectAll();
    this.current.project = proj;
    proj.current = true;
    return this.save();
  };

  Service.prototype.unselectAll = function() {
    this.current.project = null;
    this.collection.forEach(function(proj) {
      proj.current = false;
    });
    return this.save();
  };

  oleo.service('projectService', ['storageService', '$q', 'projectFactory', Service]);
})();
