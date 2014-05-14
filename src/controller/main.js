(function() {
  function controller($q, $scope, google, storage, Project) {
    
    // Data.
    var projects = $scope.projects = [];
    var tasks    = $scope.tasks = [];
    var user     = $scope.user = {
      name: "Your Name",
      currentProject: null
    };

    function save() {
      storage.put("projects", projects.map(function(model) {
        return model.get();
      }));
    }

    $scope.addProject = function() {
      projects.push(new Project());
      save();
    };

    // Load all of the data from storage.
    $q.all([
      storage.get('projects'),
      storage.get('tasks'),
      storage.get('user')
    ]).then(function(results) {
      console.log("returned results: ",results);

      // Populate basic user data.
      user = $scope.user = results[2].user || user;

      // Populate initial projects.
      if (results[0].projects) {
        results[0].projects.forEach(function(props, index) {
          projects[index] = $scope.projects[index] = new Project(props);
        });
      }

      // Populate initial tasks.
      tasks = $scope.tasks = results[1].tasks || [];
    });
  }
  oleo.controller('MainController', [
    '$q',
    '$scope',
    'googleService',
    'storageService',
    'Project',
    controller
  ]);
})();
