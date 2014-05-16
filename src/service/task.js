(function() {
  function Service(storageService, $q, taskFactory) {
    this.collection = [];
    this.storage = storageService;
    this.taskFactory = taskFactory;
    this.storageKey = "tasks";
    this.$q = $q;
  }
  Service.prototype = Object.create(angular.injector(['oleo']).get("crudProto"));
  Service.prototype.constructor = Service;


  oleo.service('taskService', ['storageService', '$q', 'projectFactory', Service]);
})();
