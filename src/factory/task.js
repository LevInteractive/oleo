oleo.factory("Task", function(Project) {
  function Task(opts) {
    this.id = Math.random().toString(36).substring(10);
    this.projectId = opts.projectId;
    this.name = opts.name;
    this.weight = opts.weight || 0;
    this.running = false;
    this.creationDate = new Date();
    this.initialStart = null;
    this.lastStart = null;
  }
  Task.build = function(obj) {
    return new Task(obj);
  };
  return Task;
});
