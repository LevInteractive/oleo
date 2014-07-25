var expect = chai.expect;
var assert = chai.assert;

describe("task service", function() {
  'use strict';

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

  // it("should stop timer on a task", function() {
  //   var task = taskService.collection[0];
  //   expect(task.secondsEpoch).to.equal(null);
  //   taskService.start(task);
  //   taskService.stop(task);
  //   var e = expect(task.running).to.be.false;
  //   expect(task.secondsEpoch).to.be.closeTo(Date.now(), 5);
  //   expect(task.secondsEpoch).to.be.closeTo(Date.now(), 5);
  // });
  //
  // it("should properly add and remove internal Tickers", function() {
  //   var task = taskService.collection[0];
  //   taskService.start(task);
  //   var e = expect(taskService._tickerMap[task.id]).to.exist;
  //   taskService.remove(task);
  //   e = expect(taskService._tickerMap[task.id]).to.not.exist;
  // });
});


