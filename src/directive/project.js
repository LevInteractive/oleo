oleo.directive("project", function() {
  return {
    restrict: "E",
    scope: {
      project: "="
    },
    templateUrl: "../partial/project.html"
  };
});
