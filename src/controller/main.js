(function() {
  "use strict";
  function controller($q, $scope, $rootScope, $filter, storageService, projectService, taskService, i18n, dynamicLocale) {

    // Internationalization
    //
    // This will automatically change the Angular locale for things like dates.
    // -------------------------------------------------
    dynamicLocale.set(i18n.getMessage("@@ui_locale").toLowerCase().replace('_', '-'));

    // Tasks
    // -------------------------------------------------
    $scope.tasks = taskService.collection;
    $scope.status = 2;

    $scope.addTask = function() {
      taskService.add({
        weight: $scope.tasks.length,
        projectId: projectService.currentProject.id
      });
      $scope.setTasks();
      $scope.setStatus();
    };

    // Determine if there any tasks for the status flag.
    $scope.setStatus = function() {
      if (!$scope.tasks.length && !$scope.projects.length) {
        $scope.status = 2;
      } else if (!$scope.tasks.length) {
        $scope.status = 1;
      } else {
        $scope.status = 0;
      }
    };

    // Filter the tasks based on the current project.
    $scope.setTasks = function() {
      if ($scope.currentProject) {
        $scope.tasks = $filter('orderBy')(
          $filter("filter")(taskService.collection, {
            projectId: $scope.currentProject.id
          }), 'weight');
      } else {
        $scope.tasks = [];
      }
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
        $scope.setTasks();
        $scope.setStatus();
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
      storageService.put("user", $rootScope.user);
    };

    // Sorting callback actions.
    $scope.sortableOptions = {
      stop: function(e, ui) {
        var index = 0;
        $scope.tasks.forEach(function(task) {
          if (task.projectId === $scope.currentProject.id) {
            task.weight = index++;
          }
        });
        index = 0;
        $scope.projects.forEach(function(project) {
          project.weight = index++;
        });
        projectService.save().then(
          taskService.save.bind(taskService)
        );
      }
    };


    // Application
    // -------------------------------------------------
    $rootScope.GOOD_CONNECTION       = i18n.getMessage('spreadsheetConnected');
    $rootScope.BAD_CONNECTION        = i18n.getMessage('spreadsheetProblem');
    $rootScope.NO_SPREADSHEET        = i18n.getMessage('spreadsheetNone');
    $rootScope.ATTEMPTING_TO_CONNECT = i18n.getMessage('spreadsheetAttempting');
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
    '$filter',
    'storageService',
    'projectService',
    'taskService',
    'i18n',
    'tmhDynamicLocale',
    controller
  ]);
})();
