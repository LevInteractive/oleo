(function() {
  function controller($q, $scope, storageService, projectService, taskService) {

    // Tasks
    // -------------------------------------------------
    $scope.tasks   = taskService.selectedTasks;
    $scope.addTask = taskService.add.bind(taskService);

    // Watch currentProject for a change.
    $scope.$watchCollection("user.currentProject", taskService.get.bind(taskService));

    // Projects
    // -------------------------------------------------
    $scope.projects     = projectService.collection;
    $scope.addProject   = projectService.add.bind(projectService);
    $scope.saveProjects = projectService.save.bind(projectService);

    // User
    // -------------------------------------------------
    $scope.user = { // Defaults.
      name: "Your Name",
      currentProject: null,
      projectName: "No project selected."
    };

    // Populate basic user data.
    storageService.get('user').then(function(result) {
      if (result && result.user) {
        $scope.user = result.user;
      }
    });

    // Update user properties in storage.
    $scope.$watch('user', function() {
      console.log('user updated', $scope.user);
      if ($scope.user.currentProject) {
        $scope.user.projectName = $scope.user.currentProject.name;
      }
      storageService.put("user", $scope.user);
    }, true);

    // Load in from storage
    // -------------------------------------------------
    // Loading tasks first so they can watch the projects.
    taskService.load()
      .then(
        projectService.load.bind(projectService)
      );
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
