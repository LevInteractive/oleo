(function() {
  
  // A Ticker is created for every class. This handles the internal
  // progression of time. The constructor is private but instances
  // are maintained in the Service.
  function Ticker(task, interval, save) {
    if (!task || !interval) {
      throw new Error("Both a task and interval method are required for Ticker!");
    }
    this.task = task;
    this.save = save;
    this.interval = interval;
    this.promise = null; // Angular's interval promise.
  }
  Ticker.prototype.start = function() {
    if (null === this.promise) { // If not already running.
      this.promise = this.interval(this._tick.bind(this), 1000);
    }
    return this;
  };
  Ticker.prototype.stop = function() {
    if (null !== this.promise) { // If not already stopped.
      this.interval.cancel(this.promise);
      this.promise = null;
    }
    return this;
  };
  Ticker.prototype._tick = function() {
    this.task.seconds++;
    thsi.task.secondsEpoch = Date.now();
    this.save();
    return this;
  };

  // The Angular service.
  function Service(storageService, $q, taskFactory, $interval, $timeout) {
    this.collection = [];
    this.storage = storageService;
    this.storageKey = "tasks";
    this.factory = taskFactory;
    this.$q = $q;
    this.$interval = $interval;
    this.$timeout = $timeout;
  }
  Service.prototype = Object.create(angular.injector(['oleo']).get("crudProto"));
  Service.prototype.constructor = Service;

  // Instances of the Ticker will be cached here.
  Service.prototype._tickerMap = {};

  // When tasks are initially loaded from storage start timers
  // that are currently running. Called internally by curd-proto.
  Service.prototype._onLoad = function() {
    this.collection.forEach(function(task) {
      if (task.running) {
        
        // If this was a running task the difference needs to be added
        // from the last epoch timestamp and now.
        task.seconds = task.seconds + Math.floor(Math.abs(task.secondsEpoch - Date.now()) / 1000); // Get total span.
        this.start(task, true); // Passing true so task.start isn't set.
      }
    }, this);
  };

  // When a task is removed, delete the instance of a ticker associated
  // to it to avoid a memory leak. Called internally by crud-proto.
  Service.prototype._onRemove = function(task) {
    if (this._tickerMap[task.id]) {
      delete this._tickerMap[task.id];
    }
  };

  // Start a timer.
  // @param resuming  this is set to true when the tasks are loaded from
  //                  from storage and picking up where left off.
  Service.prototype.start = function(task, resuming) {
    if (!task) {
      throw new Error("A task is needed to start a timer.");
    }

    if (!resuming) { // Start was manually pressed.
      task.running = true;
      task.secondsEpoch = Date.now(); // Used for resuming from an idle state.
      task.seconds++; // Do first tick for instant satisfaction.
    }

    if (!task.initialStart) {
      task.initialStart = Date.now(); // First time ever.
    }

    // Init Ticker.
    if (this._tickerMap[task.id]) {
      this._tickerMap[task.id].start();
    } else {
      this._tickerMap[task.id] = new Ticker(task, this.$interval, this.save.bind(this));
      this._tickerMap[task.id].start();
    }
    return this;
  };

  // Stop a timer.
  Service.prototype.stop = function(task) {
    if (!task) {
      throw new Error("A task is needed to stop a timer.");
    }
    task.running = false;
    
    // Stop the Ticker.
    this._tickerMap[task.id].stop();
  };

  oleo.service('taskService', [
    'storageService',
    '$q',
    'taskFactory',
    '$interval',
    '$timeout',
    Service
  ]);
})();
