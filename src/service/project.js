(function() {
  function Service(storageService, $q, projectFactory, auth, spreadsheet, taskService) {
    this.collection = [];
    this.storage = storageService;
    this.factory = projectFactory;
    this.storageKey = "projects";
    this.auth = auth;
    this.spreadsheet = spreadsheet;
    this.$q = $q;
    this.taskService = taskService;
    this.connectedToGoogle = false;
    this.current = {}; // The currently selected project. e.g. { project: {} }
  }
  
  Service.prototype = Object.create(angular.injector(['oleo']).get("crudProto"));
  Service.prototype.constructor = Service;

  Service.prototype._onLoad = function() {
    this.collection.forEach(function(proj) {
      if (proj.current) {
        this.select(proj);
      }
    }, this);
  };

  Service.prototype._onAdd = function(proj) {
    this.select(proj);
  };

  Service.prototype._onRemove = function(proj, index) {
    this.unselectAll();
    index = index > 0 ? --index : index; // Select the next project.
    if (this.collection[index]) {
      return this.select(this.collection[index]);
    } else {
      return this.unselectAll();
    }
  };

  Service.prototype.select = function(proj) {
    this.unselectAll();
    this.current.project = proj;
    proj.current = true;

    this.connectToGoogle(true).then(function() {
      this.downsync(); // Sync from google.
    }.bind(this));

    return this.save();
  };

  Service.prototype.unselectAll = function() {
    this.current.project = null;
    this.collection.forEach(function(proj) {
      proj.current = false;
    });
    return this.save();
  };

  // If the project has a properly formatted spreadsheet assigned to it
  // then attempt to get the token.
  Service.prototype.connectToGoogle = function(interactive) {
    var deferred = this.$q.defer();
    this.connectedToGoogle = false;
    var urlObj;
    try {
      urlObj = this.spreadsheet.parseUrl(this.current.project.spreadsheet);
    } catch(e) {
      deferred.reject();
      return;
    }
    this.auth.authorize(interactive).then(
      function() {
        this.connectedToGoogle = true;
        deferred.resolve();
      }.bind(this),
      deferred.reject
    );
    return deferred.promise;
  };

  // Sync from Google to local. This only happens once.
  Service.prototype.downsync = function() {
    var url = this.current.project.spreadsheet;
    var taskService = this.taskService;
    var idTest = /^#[0-9a-z]{1,20}$/i; // Good enough.
    var proj = this.current.project;
    var matches;
    this.spreadsheet.retrieve(url).then(function(cells) {
      var updateMap = cells.map(function(cell) {
        if (1 === cell.col && idTest.test(cell.content)) { // If first column and looks like an ID.
          return taskService.collection.reduce(function(task) { // Make sure the task belongs to this project.
            return task.projectId === proj.id && cell.content === task.id;
          }).length;
        }
      });
    });
    // var url = "https://docs.google.com/a/lev-interactive.com/spreadsheets/d/15lLlaf9DdGr-4SY8n8saxkwB-8Yvd7OcKQhgL5BFaY4/edit#gid=0";
    // this.spreadsheet.put(url, [
    //   [{content:'i'},{content:'am'}],
    //   [{content:'dynamic'}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'yea'}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'yea'}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'i am first mother fucker', col: 1, row: 1}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'yea'}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'yea'}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'yea'}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'yea'}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'yea'}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'yea'}],
    //   [{content:'dynamic'}, {content:'fuck'}, {content:'yea'}, {content:'im last'}]
    // ]).then(function(res) {
    //   console.log('down synced.');
    // });
  };


  oleo.service('projectService', [
    'storageService', 
    '$q',
    'projectFactory',
    'authService',
    'spreadsheetService', 
    'taskService',
    Service
  ]);
})();
