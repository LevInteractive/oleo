oleo.factory("Project", function() {
  function Project(opts) {
    this.id = Math.random().toString(36).substring(10);
    this.name = opts.name;
    this.weight = opts.weight || 0;
    this.creationDate = new Date();
  }
  Project.build = function(obj) {
    return new Project(obj);
  };
  return Project;
});
