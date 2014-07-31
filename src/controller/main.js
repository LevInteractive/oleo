(function() {
  "use strict";
  function controller($q, $scope, $rootScope, $filter, $timeout, storageService, projectService, taskService, i18n, dynamicLocale, idle, authService) {

    // Internationalization
    //
    // This will automatically change the Angular locale for things like dates.
    // -------------------------------------------------
    dynamicLocale.set(i18n.getMessage("@@ui_locale").toLowerCase().replace('_', '-'));

    // Tasks
    // -------------------------------------------------
    $scope.tasks = []; // Current tasks for a project.
    $scope.status = 2; // 2: no projects or tasks, 1: no tasks, 0: has tasks

    // Add a new task.
    $scope.addTask = function() {
      if (!$scope.newTaskName) {
        return false;
      }
      taskService.add({
        name      : $scope.newTaskName,
        weight    : 0,
        projectId : projectService.currentProject.id
      });
      reIndexLists();
      $scope.setTasks();
      $scope.setStatus();
      $scope.newTaskName = "";
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
          }),
          'weight'
        );
      } else {
        $scope.tasks = [];
      }
    };

    // Projects
    // -------------------------------------------------
    $scope.displayProjects = true;
    $scope.projects        = projectService.collection;
    $scope.saveProjects    = projectService.save.bind(projectService);
    $scope.currentProject  = null;

    $scope.$watch( // Watch the currentProject prop for a change.
      function() {
        return projectService.currentProject;
      },
      function() {
        $scope.currentProject = projectService.currentProject;
        $scope.setTasks();
        $scope.setStatus();
      }
    );

    $scope.addProject = function() {
      if (!$scope.newProjectName) {
        return false;
      }
      projectService.add({
        weight: 0,
        name: $scope.newProjectName
      });
      $scope.newProjectName = "";
      reIndexLists();

      $timeout(function() {
        $scope.displayProjects = false;
      }, 300);
    };

    $scope.hideProjects = function() {
      $scope.displayProjects = false;
    };


    // User
    // -------------------------------------------------
    $rootScope.user = { // Defaults.
      name: "",
      rate: 45
    };

    // Populate basic user data.
    authService.setUserData().then(function(userData) {
      if (userData) {
        $rootScope.user = angular.extend($rootScope.user, userData);
        console.log($rootScope.user);
      }
    });

    // Expose method for saving user data.
    $scope.saveUser = function() {
      storageService.put("user", $rootScope.user);
    };


    // Application
    // -------------------------------------------------
    $scope.minimize                  = chrome.app.window.current().minimize;
    $scope.quit                      = chrome.app.window.current().close.bind(chrome.app.window.current());
    $rootScope.GOOD_CONNECTION       = i18n.getMessage('spreadsheetConnected');
    $rootScope.BAD_CONNECTION        = i18n.getMessage('spreadsheetProblem');
    $rootScope.NO_SPREADSHEET        = i18n.getMessage('spreadsheetNone');
    $rootScope.ATTEMPTING_TO_CONNECT = i18n.getMessage('spreadsheetAttempting');
    $rootScope.connectionStatus      = $rootScope.NO_SPREADSHEET;
    $rootScope.i18n                  = i18n;

    // Set proper weights in both projects and task lists.
    function reIndexLists() {
      var index = 0;
      $scope.tasks.forEach(function(task) {
        if (task.projectId === $scope.currentProject.id) {
          task.weight = ++index;
        }
      });
      index = 0;
      $scope.projects.forEach(function(project) {
        project.weight = ++index;
      });
      projectService.save().then(
        taskService.save.bind(taskService)
      );
    }

    // Sorting callback actions.
    $scope.sortableOptions = {
      stop: function(e, ui) {
        reIndexLists();
      }
    };

    if (idle) {
      idle.onStateChanged.addListener(function(state) {
        if (state !== "active") {
          taskService.stopAll();
          $scope.$apply();
          console.log("All tickers stopped because the OS state is "+state);
        }
      });
    }

    // Load in from storage
    // -------------------------------------------------
    taskService.load()
      .then(
        projectService.load.bind(projectService)
      )
      .then(function() {
        console.log(projectService.collection);
        if (!$scope.projects.length) {
          $scope.displayProjects = true;
        } else {
          $scope.displayProjects = false;
          $scope.setTasks();
        }
      })
    ;
  }

  // Init.
  oleo.controller('MainController', [
    '$q',
    '$scope',
    '$rootScope',
    '$filter',
    '$timeout',
    'storageService',
    'projectService',
    'taskService',
    'i18n',
    'tmhDynamicLocale',
    'idle',
    'authService',
    controller
  ]);
})();
