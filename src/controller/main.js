oleo.controller('MainController', ['$q', '$scope', 'googleService', 'storageService', function($q, $scope, google, storage) {

  // Init user data.
  $scope.user = {};
  $scope.user.name = "Unnamed";
  $scope.user.currentProject = "No project selected.";



  // Load all of the data from storage.
  $q.all([
    storage.get('projects'),
    storage.get('tasks'),
    storage.get('user')
  ]).then(function(results) {
    $scope.projects = results[0];
    $scope.tasks = results[1];
    $scope.user = results[2];
  });
}]);
