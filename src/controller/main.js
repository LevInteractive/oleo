(function() {
  function controller($q, $scope, storageService, projectService, taskService) {

    // Projects
    // -------------------------------------------------
    $scope.projects     = projectService.collection;
    $scope.addProject   = projectService.add.bind(projectService);
    $scope.saveProjects = projectService.save.bind(projectService);

    projectService.load(); // This will populate the collection from storage.

    // Tasks
    // -------------------------------------------------
    $scope.tasks = taskService.collection;

    // User
    // -------------------------------------------------
    
    $scope.user = {
      name: "Your Name",
      currentProject: null
    };

    // Populate basic user data.
    storageService.get('user').then(function(result) {
      user = $scope.user = result.user || user;
    });

    // Update user properties in storage.
    $scope.$watch('user', function() {
      console.info("User saved.");
      storageService.put("user", $scope.user);
    }, true);
  }

  // Init.
  oleo.controller('MainController', [
    '$q',
    '$scope',
    'storageService',
    'projectService',
    'taskService',
    controller
  ]);
})();
