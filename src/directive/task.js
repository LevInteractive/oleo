oleo.directive("task", ['taskService', function(taskService) {
  function link(scope, el, attrs) {

    // When false confirmation box shows.
    scope.hideDelete = true;
    scope.remove = taskService.remove.bind(taskService);

    scope.toggleState = function(task) {
      if (task.running) {
        taskService.stop(task);
        task.running = false;
      } else {
        taskService.start(task);
        task.running = true;
      }
      scope.save();
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

