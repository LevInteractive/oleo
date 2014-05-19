oleo.directive("project", ['projectService', function(projectService) {
  function link(scope, el, attrs) {

    // When false confirmation box shows.
    scope.hideDelete = true;

    // Bind methods from service.
    scope.remove = projectService.remove.bind(projectService);
    scope.select = projectService.select.bind(projectService);    
    scope.save = projectService.save.bind(projectService);
  }
  return {
    link: link,
    restrict: "A",
    scope: {
      project: "="
    },
    templateUrl: "../partial/project.html"
  };
}]);
