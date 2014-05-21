(function() {
  function Service(storageService, $q, projectFactory, google, spreadsheet) {
    this.collection = [];
    this.storage = storageService;
    this.factory = projectFactory;
    this.storageKey = "projects";
    this.google = google;
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
    this.getSpreadsheetToken();
    
    return this.save();
  };

  // If the project has a properly formatted spreadsheet assigned to it
  // then attempt to get the token.
  Service.prototype.getSpreadsheetToken = function() {
    var urlObj;
    try {
      urlObj = this.spreadsheet.parseUrl(project.spreadsheet);
    } catch(e) {
      // console.error("Problem parsing spreadsheet URL.", e);
      return;
    }
    this.google.auth(true).then(function() {
      console.log(this.google.accessToken);
    }.bind(this),
    function(err) {
      console.error('fail', err);
    });
  };

  Service.prototype.unselectAll = function() {
    this.current.project = null;
    this.collection.forEach(function(proj) {
      proj.current = false;
    });
    return this.save();
  };

  oleo.service('projectService', [
    'storageService', 
    '$q',
    'projectFactory',
    'googleService',
    'spreadsheetService', 
    Service
  ]);
})();
