(function() {
  function controller($q, $scope, storageService, projectService, taskService) {

    // Tasks
    // -------------------------------------------------
    $scope.tasks = taskService.collection;

    $scope.addTask = function() {
      if ($scope.user.currentProject) {
        taskService.add({
          projectId: $scope.user.currentProject.id
        });
      }
    };

    // Projects
    // -------------------------------------------------
    $scope.projects     = projectService.collection;
    $scope.addProject   = projectService.add.bind(projectService);
    $scope.saveProjects = projectService.save.bind(projectService);

    // User
    // -------------------------------------------------
    $scope.user = { // Defaults.
      name: "",
      currentProject: null,
      projectName: "No project selected.", // Used for title.
      projectId: 0                         // Used for filtering tasks.
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
      if ($scope.user.currentProject) {
        $scope.user.projectName = $scope.user.currentProject.name;
        $scope.user.projectId = $scope.user.currentProject.id;
      } else {
        $scope.user.projectName = "No project selected.";
        $scope.user.projectId = 0;
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
