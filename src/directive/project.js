oleo.directive("project", ['projectService', function(projectService) {
  function link(scope, el, attrs) {
    scope.remove = function(proj) {
      // Need to make custom confirmation box instead of this...
      var confirmed = confirm("Are you sure you want to remove this project and all of the tasks associated with it?");
      if (confirmed) {
        projectService.remove(proj);
      }
    };
    scope.save = projectService.save.bind(projectService);
  }
  return {
    link: link,
    restrict: "E",
    scope: {
      project: "="
    },
    templateUrl: "../partial/project.html"
  };
}]);
