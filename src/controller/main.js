oleo.controller('MainController', ['$q', '$scope', 'googleService', 'storageService', function($q, $scope, google, storage) {
  
  // Data.
  var projects = $scope.projects = [];
  var tasks    = $scope.tasks = [];
  var user     = $scope.user = {
    name: "Your Name",
    currentProject: null
  };

  // Projects.
  $scope.addProject = function() {
    projects.push({});
    storage.put("projects", projects);
    console.log(projects);
  };

  // Load all of the data from storage.
  $q.all([
    storage.get('projects'),
    storage.get('tasks'),
    storage.get('user')
  ]).then(function(results) {
    console.log("returned results: ",results);
    projects = $scope.projects = results[0].projects || [];
    tasks = $scope.tasks = results[1].tasks || [];
    user = $scope.user = results[2].user || user;
  });
}]);
