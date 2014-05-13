oleo.directive("project", function() {
  return {
    restrict: "E",
    scope: {
      info: "=info"
    },
    templateUrl: "../partial/project.html"
  };
});
