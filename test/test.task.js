var expect = chai.expect;
var assert = chai.assert;

describe("task service", function() {

  var projectService;
  var taskService;
  var projectFactory;
  var taskFactory;
  var $rootScope;

  function populate() {
    projectService.collection.push(
      projectFactory({name: "project 1"}),
      projectFactory({name: "project 2"}),
      projectFactory({name: "project 3"}),
      projectFactory({name: "project 4"}),
      projectFactory({name: "project 5"})
    );
    taskService.collection.push(
      taskFactory({projectId: projectService.collection[0].id}),
      taskFactory({projectId: projectService.collection[0].id}),
      taskFactory({projectId: projectService.collection[0].id}),
      taskFactory({projectId: projectService.collection[1].id}),
      taskFactory({projectId: projectService.collection[1].id}),
      taskFactory({projectId: projectService.collection[3].id}),
      taskFactory({projectId: projectService.collection[3].id}),
      taskFactory({projectId: projectService.collection[3].id})
    );
    projectService.save();
    taskService.save();
    $rootScope.$apply();
  }

  beforeEach(function() {
    module('oleo');
    module(function($provide) {
      $provide.value("storage", window.chromeStorageMock());
    });
  });

  beforeEach(inject(function(_taskService_, _taskFactory_, _projectFactory_, _projectService_, $q, _$rootScope_) {
    projectService = _projectService_;
    taskService = _taskService_;
    projectFactory = _projectFactory_;
    taskFactory = _taskFactory_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(populate);

  it("should provide all tasks for a given project", function() {
    var e = expect(taskService.selectedTasks).to.be.empty;
    taskService.get(projectService.collection[0]);
    expect(taskService.selectedTasks).to.have.length(3);
    taskService.get(projectService.collection[1]);
    expect(taskService.selectedTasks).to.have.length(2);
    expect(taskService.get(projectService.collection[3])).to.have.length(3);
  });

  it("should start and timer on a task and set initial start", function() {
    var task = taskService.collection[0];
    expect(task.start).to.equal(null);
    taskService.start(task);
    var e = expect(task.running).to.be.true;
    expect(task.start).to.be.closeTo(Date.now(), 5);
  });

  it("should stop timer on a task", function() {
    var task = taskService.collection[0];
    expect(task.start).to.equal(null);
    taskService.start(task);
    taskService.stop(task);
    var e = expect(task.running).to.be.false;
    expect(task.start).to.be.closeTo(Date.now(), 5);
    expect(task.initialStart).to.be.closeTo(Date.now(), 5);
    expect(task.stop).to.be.closeTo(Date.now(), 5);
  });

  it("should properly get the difference between stopped and started", function() {
    var task = taskService.collection[0];

    task.start = task.initialStart = new Date(2014, 0, 20, 01).getTime();
    task.stop = new Date(2014, 0, 20, 02).getTime(); // One hour later.
    expect(taskService.setDiff(task)).to.equal("01:00:00");

    task.start = task.stop = null;
    expect(taskService.setDiff(task)).to.equal("00:00:00");

    task.start = task.initialStart = new Date(2014, 0, 20, 01).getTime();
    task.stop = new Date(2014, 0, 20, 02, 5, 23).getTime(); // One hour and 5 minutes and 20 seconds later.
    expect(taskService.setDiff(task)).to.equal("01:05:23");
  });
});


