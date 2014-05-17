oleo.directive("task", ['taskService', function(taskService) {
  function link(scope, el, attrs) {

    // When false confirmation box shows.
    scope.hideDelete = true;
    scope.remove = taskService.remove.bind(taskService);

    scope.toggleState = function(task) {
      task.running = !task.running;
      scope.save();
    };
    
    // Pass in a save function.
    scope.save = taskService.save.bind(taskService);
  }
  return {
    link: link,
    restrict: "A",
    scope: {
      project: "="
    },
    templateUrl: "../partial/task.html"
  };
}]);

