(function() {
  function controller($q, $scope, $rootScope, storageService, projectService, taskService, i18n) {

    // Tasks
    // -------------------------------------------------
    $scope.tasks = taskService.collection;

    $scope.addTask = function() {
      taskService.add({
        projectId: projectService.currentProject.id
      });
    };

    // Projects
    // -------------------------------------------------
    $scope.displayProjects = false;
    $scope.projects        = projectService.collection;
    $scope.addProject      = projectService.add.bind(projectService);
    $scope.saveProjects    = projectService.save.bind(projectService);
    $scope.currentProject  = null;
    $scope.hideProjects = function() {
      $scope.displayProjects = false;
    };
    $scope.$watch(
      function() {
        return projectService.currentProject;
      },
      function() {
        $scope.currentProject = projectService.currentProject;
      }
    );

    // User
    // -------------------------------------------------
    $rootScope.user = { // Defaults.
      name: "",
      rate: 45
    };

    // Populate basic user data.
    storageService.get('user').then(function(result) {
      if (result && result.user) {
        $rootScope.user = result.user;
      }
    });

    // Expose method for saving user data.
    $scope.saveUser = function() {
      console.log("user saved");
      storageService.put("user", $rootScope.user);
    };


    // Application
    // -------------------------------------------------
    $rootScope.GOOD_CONNECTION = "Connected";
    $rootScope.BAD_CONNECTION = "Problem Connecting";
    $rootScope.NO_SPREADSHEET = "No Spreadsheet";
    $rootScope.ATTEMPTING_TO_CONNECT = "Connecting";
    $rootScope.connectionStatus = $rootScope.NO_SPREADSHEET;

    $rootScope.i18n = i18n;


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
    '$rootScope',
    'storageService',
    'projectService',
    'taskService',
    'i18n',
    controller
  ]);
})();
