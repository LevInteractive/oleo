(function() {
  function Service(storageService, $q, projectFactory) {
    this.collection = [];
    this.storage = storageService;
    this.projectFactory = projectFactory;
    this.$q = $q;
  }

  // Load projects from storage.
  Service.prototype.load = function() {
    var deferred = this.$q.defer();
    this.storage.get('projects').then(function(result) {
      this.collection = []; // Reset collection.
      if (result.projects) {
        result.projects.forEach(function(props, index) {
          this.collection.push(
            this.projectFactory(props) // Factory a fresh object.
          );
        }.bind(this));
      }
      deferred.resolve(this.collection);
    }.bind(this), deferred.reject);
    return deferred.promise;
  };

  // Factory & add a project into the collection.
  Service.prototype.add = function(frag) {
    this.collection.push(
      this.projectFactory(frag)
    );
    this.save();
  };

  // Remove a project from storage and collection.
  Service.prototype.remove = function(project) {
    var index = 0;
    var p = this.collection.filter(function(proj, i) {
      if (proj.id === project.id) {
        index = i;
        return true;
      }
      return false;
    });
    if (p[0]) {
      this.collection.splice(index, 1);
      this.save();
    }
  };

  // Save the current collection to storage.
  Service.prototype.save = function() {
    return this.storage.put("projects", this.collection);
  };

  oleo.service('projectService', ['storageService', '$q', 'projectFactory', Service]);
})();
