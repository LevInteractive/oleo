(function() {
  function Service(storageService, $q, projectFactory) {
    this.collection = [];
    this.storage = storageService;
    this.factory = projectFactory;
    this.storageKey = "projects";
    this.$q = $q;
  }
  
  Service.prototype = Object.create(angular.injector(['oleo']).get("crudProto"));
  Service.prototype.constructor = Service;

  oleo.service('projectService', ['storageService', '$q', 'projectFactory', Service]);
})();
