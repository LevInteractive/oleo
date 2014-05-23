(function() {
  function Service(storageService, $q, projectFactory, auth, spreadsheet) {
    this.collection = [];
    this.storage = storageService;
    this.factory = projectFactory;
    this.storageKey = "projects";
    this.auth = auth;
    this.spreadsheet = spreadsheet;
    this.$q = $q;
    this.current = {}; // The currently selected project. e.g. { project: {} }
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
    this.connectToGoogle();
    
    return this.save();
  };

  Service.prototype.unselectAll = function() {
    this.current.project = null;
    this.collection.forEach(function(proj) {
      proj.current = false;
    });
    return this.save();
  };

  Service.prototype.getById = function(id) {
    var project = null;
    this.collection.forEach(function(proj) {
      if (proj.id === id) {
        project = proj;
        return false;
      }
    });
    return project;
  };

  // If the project has a properly formatted spreadsheet assigned to it
  // then attempt to get the token.
  Service.prototype.connectToGoogle = function(action) {
    var deferred = this.$q.defer();
    var urlObj;
    try {
      urlObj = this.spreadsheet.parseUrl(this.current.project.spreadsheet);
    } catch(e) {
      deferred.reject();
      return;
    }
    this.auth.authorize(true);
    return deferred.promise;
  };

  Service.prototype.reverseSync = function(){};
  Service.prototype.sync = function(){};

  oleo.service('projectService', [
    'storageService', 
    '$q',
    'projectFactory',
    'authService',
    'spreadsheetService', 
    Service
  ]);
})();
