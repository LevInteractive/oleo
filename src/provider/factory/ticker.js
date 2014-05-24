// A Ticker is created for every class. This handles the internal
// progression of time.
oleo.factory('tickerFactory', ['$interval', function($interval) {
  function Ticker(task, save) {
    if (!task || !save) {
      throw new Error("Both a task and save method are required for Ticker!");
    }
    this.task = task;
    this.save = save;
    this.promise = null; // Angular's interval promise.
  }
  Ticker.prototype.start = function() {
    if (null === this.promise) { // If not already running.
      this.task.running = true;
      this._tick(); // For instant satisfaction.
      this.promise = $interval(this._tick.bind(this), 1000);
    }
    return this;
  };
  Ticker.prototype.stop = function() {
    if (null !== this.promise) { // If not already stopped.
      $interval.cancel(this.promise);
      this.promise = null;
    }
    return this;
  };
  Ticker.prototype._tick = function() {
    this.task.seconds++;
    this.task.secondsEpoch = Date.now();
    this.save();
    return this;
  };
  return {
    create: function(task, save) {
      return new Ticker(task, save);
    }
  };
}]);
