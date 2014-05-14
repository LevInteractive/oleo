oleo.factory("Task", ['Model', function(Model) {
  function Task(opts) {
    Model.apply(this, opts);
    if (!opts || !this._args.projectId) {
      throw new Error("A projectId is required to create a task.");
    }
    this.set("projectId",  this._args.projectId);
    this.set("running", this._args.running || false);
    this.set("initialStart", this._args.initialStart || null);
    this.set("start", this._args.start || null);
    this.set("stop", this._args.stop || null);
  }
  Task.prototype = Object.create(Model.prototype);
  return Task;
}]);
