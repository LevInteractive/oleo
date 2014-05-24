(function() {
  function Service(storageService, $q, projectFactory, auth, spreadsheetService, taskService, $filter, $rootScope, $interval) {
    this.collection = [];
    this.storage = storageService;
    this.taskService = taskService;
    this.spreadsheetService = spreadsheetService;
    this.factory = projectFactory;
    this.storageKey = "projects";
    this.auth = auth;
    this.$q = $q;
    this.$filter = $filter;
    this.$rootScope = $rootScope;
    this.currentProject = null;

    // Always try to sync if on a current project with a spreadsheet.
    $interval(function() {
      if (this.currentProject && this.currentProject.spreadsheet) {
        this.upsync(this.currentProject);
      }
    }.bind(this), 55000);
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
    proj.rate = this.$rootScope.user.rate; // Inject the project with the user's default rate.
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
    this.currentProject = proj;
    proj.current = true;
    this.connectToGoogle(true).then(function() {
      this.upsync(proj); // Sync from google.
    }.bind(this));

    return this.save();
  };

  Service.prototype.unselectAll = function() {
    this.currentProject = null;
    this.collection.forEach(function(proj) {
      proj.current = false;
    });
    return this.save();
  };

  Service.prototype.connectToGoogle = function(interactive) {
    var deferred = this.$q.defer();
    var urlObj;
    this.$rootScope.connectionStatus = this.$rootScope.ATTEMPTING_TO_CONNECT;
    if (!this.currentProject.spreadsheet) {
      this.$rootScope.connectionStatus = this.$rootScope.NO_SPREADSHEET;
      deferred.reject();
    } else {
      try {
        urlObj = this.spreadsheetService.parseUrl(this.currentProject.spreadsheet);
        this.auth.authorize(interactive).then(
          function() {
            this.$rootScope.connectionStatus = this.$rootScope.GOOD_CONNECTION;
            deferred.resolve();
          }.bind(this),
          function() {
            this.$rootScope.connectionStatus = this.$rootScope.BAD_CONNECTION;
            deferred.reject();
          }.bind(this)
        );
      } catch(e) {
        this.$rootScope.connectionStatus = this.$rootScope.BAD_CONNECTION;
        deferred.reject();
      }
    }
    return deferred.promise;
  };

  Service.prototype.formatTaskRow = function(task, project, row) {
    var col = 0;
    var name = this.$rootScope.user.name || "No Name";
    var timespan = this.$filter("timespan");
    var rate = this.$filter("rate");
    var lifespan = this.$filter("lifespan");
    var currency = this.$filter("currency");
    return [
      { content: task.id },
      { content: name },
      { content: project.name || "Project "+project.id },
      { content: task.name || "Task "+task.id },
      { content: timespan(task.seconds) },
      { content: lifespan(task.initialStart, task.timeEpoch) },
      { content: currency(rate(task.seconds, project.rates)) }
    ].map(function(obj) {
      obj.row = row;
      obj.col = ++col;
      return obj;
    });
  };

  // Map tasks to spreadsheetService cells. Used for both
  // downsyncing and upsyncing.
  Service.prototype.createSpread = function(cells, project) {
    var taskRowMap = {};
    var spread = [];
    var idTest = /^#[0-9a-z]{1,20}$/i; // Good enough.
    var i, n, len;
    var lastRow = cells && cells.length ? cells[cells.length-1].row : 0;
    this.taskService.collection.forEach(function(task) { // Loop through all tasks.
      if (task.projectId === project.id) { // Check if task is relevant.
        for (i = 0, len = cells.length; i < len; i++) { // Loop through all cells.
          if (1 === cells[i].col && idTest.test(cells[i].content)) { // If first column and looks like a ID.
            if (cells[i].content === task.id) {
              taskRowMap[task.id] = cells[i].row; // Assign this row to this task.
            }
          }
        }
      }
    }, this);
    this.taskService.collection.forEach(function(task) { // Loop through all tasks.
      if (taskRowMap[task.id]) {
        spread.push(this.formatTaskRow(task, project, taskRowMap[task.id]));
      } else {
        spread.push(this.formatTaskRow(task, project, ++lastRow));
      }
    }, this);
    return spread;
  };

  // Sync to Google.
  Service.prototype.upsync = function(project) {
    this.auth.authorize(false).then(
      function() {
        var bad = function() {
          this.$rootScope.connectionStatus = this.$rootScope.BAD_CONNECTION;
        }.bind(this);

        var onPut = function() {
          this.$rootScope.connectionStatus = this.$rootScope.GOOD_CONNECTION;
        }.bind(this);

        var onRetrieve = function(cells) {
          var spread = this.createSpread(cells, project);
          if (spread) {
            this.spreadsheetService.put(project.spreadsheet, spread).then(onPut, bad);
          }
        }.bind(this);

        this.spreadsheetService.retrieve(project.spreadsheet).then(onRetrieve, bad);

      }.bind(this),
      function() {
        this.$rootScope.connectionStatus = this.$rootScope.BAD_CONNECTION;
      }.bind(this)
    );
  };

  // Sync from Google to local. This only happens once.
  Service.prototype.downsync = function() {}; // Not implemented. This may not be desired.

  oleo.service('projectService', [
    'storageService', 
    '$q',
    'projectFactory',
    'authService',
    'spreadsheetService', 
    'taskService',
    '$filter',
    '$rootScope',
    '$interval',
    Service
  ]);
})();
