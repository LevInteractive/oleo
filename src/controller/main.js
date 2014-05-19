(function() {
  function controller($q, $scope, storageService, projectService, taskService) {

    // Tasks
    // -------------------------------------------------
    $scope.tasks = taskService.collection;

    $scope.addTask = function() {
      taskService.add({
        projectId: projectService.current.project.id
      });
    };

    // Projects
    // -------------------------------------------------
    $scope.projects       = projectService.collection;
    $scope.addProject     = projectService.add.bind(projectService);
    $scope.saveProjects   = projectService.save.bind(projectService);
    $scope.current        = projectService.current;

    // User
    // -------------------------------------------------
    $scope.user = { // Defaults.
      name: "",
      rate: 45
    };

    // Populate basic user data.
    storageService.get('user').then(function(result) {
      if (result && result.user) {
        $scope.user = result.user;
      }
    });

    // Update user properties in storage.
    $scope.$watch('user', function() {
      console.info('user updated', $scope.user);
      storageService.put("user", $scope.user);
    }, true);

    // Load in from storage
    // -------------------------------------------------
    // Loading tasks first so they can watch the projects.
    taskService.load()
      .then(
        projectService.load.bind(projectService)
      )
    ;
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
