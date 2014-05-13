oleo.factory("Project", function() {
  function Project(opts) {
    this.id = opts.id || Math.random().toString(36).substring(10);
    this.name = opts.name || "";
    this.weight = opts.weight || 0;
    this.creationDate = new Date();
    this.active = false;
  }
  Project.prototype.isActive = function() {
    return this.active;
  };
  Project.build = function(obj) {
    return new Project(obj);
  };
  return Project;
});
