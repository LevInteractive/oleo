oleo.factory("Project", ['Model', function(Model) {
  function Project(opts) {
    Model.apply(this, arguments);
    this.set("active", this._args.active || false);
  }
  Project.prototype = Object.create(Model.prototype);
  return Project;
}]);
