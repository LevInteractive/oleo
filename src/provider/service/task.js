(function() {
  "use strict";
  function Service(storageService, $q, taskFactory, tickerFactory, browserAction) {
    this.collection = [];
    this.storage = storageService;
    this.storageKey = "tasks";
    this.factory = taskFactory;
    this.tickerFactory = tickerFactory;
    this.browserAction = browserAction;
    this.$q = $q;
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

    // Set browser icon to active.
    this.browserAction.setIcon({
      path:'style/img/icon-active19.png'
    });
    this.browserAction.setTitle({
      title: "óleo | There are tasks running."
    });
    this.browserAction.setBadgeText({
      text: "ON"
    });

    if (!task.initialStart) {
      task.initialStart = Date.now(); // First time ever.
    }

    // Init Ticker.
    if (this._tickerMap[task.id]) {
      this._tickerMap[task.id].start();
    } else {
      this._tickerMap[task.id] = this.tickerFactory.create(task, this.save.bind(this));
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

    // If no other timers are running, remove active icon.
    var setToDefault = true;
    this.collection.forEach(function(task) {
      if (task.running) {
        setToDefault = false;
      }
    }, this);
    if (setToDefault) {
      this.browserAction.setBadgeText({
        text: ""
      });
      this.browserAction.setTitle({
        title: "óleo | All tasks are paused."
      });
      this.browserAction.setIcon({
        path: 'style/img/icon19.png'
      });
    }
  };

  oleo.service('taskService', [
    'storageService',
    '$q',
    'taskFactory',
    'tickerFactory',
    'browserAction',
    Service
  ]);
})();
