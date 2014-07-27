oleo.directive("task", ['taskService', '$filter', '$rootScope', function(taskService, $filter, $rootScope) {
  'use strict';

  // Parses a user inputed time string and sets 
  // the task's seconds accordingly.
  var adjustTime = function(timeStr, task) {
    var adjustedSeconds = 0;
    timeStr.split(":").forEach(function(seg, index) {
      switch(index) {
        case 0:
          adjustedSeconds += 3600 * parseInt(seg, 10);
          break;
        case 1:
          adjustedSeconds += 60 * parseInt(seg, 10);
          break;
        case 2:
          adjustedSeconds += parseInt(seg, 10);
          break;
      }
    });
    task.seconds = adjustedSeconds;
    taskService.save();
    $rootScope.$broadcast("taskTick", task); // Manually broadcast a tick.
  };

  function link(scope, el, attrs) {

    // Set to true after a user clicks into the time box to edit.
    // If true then the timer will continue running on input blur.
    var continueAfterEdit = false;

    // Expose adjustTime to the API.
    scope.adjustTime = adjustTime;

    // When false confirmation box shows.
    scope.hideDelete = true;
    scope.remove = function(task) {
      taskService.remove(task);
      scope.$parent.setTasks();
      scope.$parent.setStatus();
    };

    // The click event for pause/play button.
    scope.toggleState = function(task) {
      if (task.running) {
        taskService.stop(task);
      } else {
        taskService.start(task);
      }
      scope.save();
    };

    // When time is clicked pause if running.
    scope.timeFocus = function(task) {
      if (task.running) {
        continueAfterEdit = true;
        taskService.stop(task);
      }
    };

    // When time is blurred, readjust any changes and contnue clock.
    scope.timeBlur = function(task) {
      if (scope.formattedTime) { // If there is a new valid formatted time.
        adjustTime(scope.formattedTime, task);
      }
      if (continueAfterEdit) {
        continueAfterEdit = false; // Reset to false;
        taskService.start(task);
      }
    };

    // As seconds change adjust the formatted time.
    scope.formattedTime = $filter("timespan")(scope.task.seconds);
    scope.$watch("task.seconds", function() {
      scope.formattedTime = $filter("timespan")(scope.task.seconds);
    });

    // A event method for on-enter causing a blur.
    // e.g. ng-keydown($event)
    scope.enterBlur = function(e) {
      if (13 === e.which) {
        setTimeout(function(){ // Need a slight delay for angular to digest since blur causes an event.
          e.target.blur();
        }, 1);
      }
    };

    // Pass in a save function.
    scope.save = taskService.save.bind(taskService);
  }

  return {
    link: link,
    restrict: "A",
    scope: {
      task: "="
    },
    templateUrl: "../partial/task.html"
  };
}]);

