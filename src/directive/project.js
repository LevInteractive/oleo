oleo.directive("project", function() {
  return {
    restrict: "E",
    scope: {
      customerInfo: "=info"
    },
    templateUrl: "../partial/project.html"
  };
});
