(function() {
  function Service(storageService, $q, taskFactory, $interval) {
    this.collection = [];
    this.storage = storageService;
    this.taskFactory = taskFactory;
    this.storageKey = "tasks";
    this.$q = $q;
    this.selectedTasks = [];
    this.$interval = $interval;
    this._tick();
  }
  Service.prototype = Object.create(angular.injector(['oleo']).get("crudProto"));
  Service.prototype.constructor = Service;

  // Internal tick for running tasks.
  Service.prototype._tick = function() {
    function tick() {
      this.selectedTasks.forEach(function(task) {
        if (task.running) {
          this.setDiff(task);
          this.setDatespan(task);
        }
      }, this);
      console.log(this.selectedTasks);
    }
    this.$interval(tick.bind(this), 1000);
    return this;
  };

  // Populates selected tasks for a particular project.
  Service.prototype.get = function(project) {
    this.selectedTasks.length = 0;
    if (!project) {
      return this.selectedTasks;
    }
    this.collection.forEach(function(task) {
      if (task.projectId === project.id) {
        this.selectedTasks.push(task);
      }
    }, this);
    return this.selectedTasks;
  };

  // Start a timer.
  Service.prototype.start = function(task) {
    if (!task) {
      throw new Error("A task is needed to start a timer.");
    }
    task.running = true;
    task.start = Date.now();
    if (!task.initialStart) {
      task.initialStart = Date.now();
    }
    return this;
  };

  // Stop a timer.
  Service.prototype.stop = function(task) {
    if (!task) {
      throw new Error("A task is needed to stop a timer.");
    }
    task.stop = Date.now();
    task.running = false;
  };

  // Get the difference in time from now or last stopped.
  // Returns a formatted string e.g. 00:00:00.
  Service.prototype.setDiff = function(task) {
    var stop;
    if (!task) {
      throw new Error("A task is needed to start a timer.");
    }
    if (!task.start) {
      throw new Error("Task needs to be started before setting difference.");
    }
    if (task.running) {
      stop = Date.now();
    } else {
      stop = task.stop;
    }
    task.diff = stop - task.start;
    // task.life = stop - task.initialStart;
    return this;
  };

  oleo.service('taskService', ['storageService', '$q', 'projectFactory', '$interval', Service]);
})();
