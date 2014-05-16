(function() {
  function controller($q, $scope, google, storage, projectService) {
    
    var user = $scope.user = {
      name: "Your Name",
      currentProject: null
    };

    $scope.projects = projectService.collection;
    $scope.addProject = projectService.add;
    // $scope.tasks = taskService.collection;

    // Populate basic user data.
    storage.get('user').then(function(result) {
      user = $scope.user = results.user || user;
    });
  }
  oleo.controller('MainController', [
    '$q',
    '$scope',
    'googleService',
    'storageService',
    'projectService',
    controller
  ]);
})();
