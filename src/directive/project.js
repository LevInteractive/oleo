oleo.directive("project", ['projectService', '$rootScope', function(projectService, $rootScope) {
  function link(scope, el, attrs) {

    // When false confirmation box shows.
    scope.hideDelete = true;

    // Bind methods from service.
    scope.remove = projectService.remove.bind(projectService);
    scope.select = projectService.select.bind(projectService);    
    scope.save = projectService.save.bind(projectService);

    // When the rate is changed update the user's default rate for future projects.
    scope.$watch("project.rate", function() {
      $rootScope.user.rate = scope.project.rate;
      scope.$parent.saveUser();
    });
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
