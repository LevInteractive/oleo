var expect = chai.expect;
var assert = chai.assert;

describe("project service", function() {

  var storageService;
  var projectService;
  var projectFactory;
  var storage;
  var $rootScope;

  beforeEach(function() {
    module('oleo');
    module(function($provide) {
      $provide.value("storage", null); // The swap.
      $provide.value("storage", window.chromeStorageMock()); // The swap.
    });
  });

  beforeEach(inject(function(_storage_, _projectFactory_, _projectService_, _storageService_, $q, _$rootScope_) {
    storage = _storage_;
    projectService = _projectService_;
    projectFactory = _projectFactory_;
    storageService = _storageService_;
    $rootScope = _$rootScope_;
  }));

  it("should be able to create thousands of unqiue ids", function() {
    var i = 10000, c = {}, _i = i;
    while(i--) {
      c[projectFactory().id] = i;
    }
    expect(Object.keys(c)).to.have.length(_i);
  });

  it("should properly populate projects from storage", function(done) {
    var e = expect(projectService.collection).to.be.empty;
    storageService.put("projects", [projectFactory(), projectFactory(), projectFactory()]);
    projectService.load().then(
      function(projects) {
        expect(projects).to.have.length(3);
        done();
      },
      function() {
        throw new Error("Rejected");
      }
    );
    $rootScope.$apply();
  });

  it("should properly add a new project and save to storage", function(done) {
    var e = expect(projectService.collection).to.be.empty;
    projectService.add({}).then(function() {
      expect(projectService.collection).to.have.length(1);
      done();
    },
    function(err) {
      throw err;
    });
    $rootScope.$apply();
  });

  it("should delete from storage and collection by id", function(done) {
    var proj = projectFactory({id: "123"});
    var proj2 = projectFactory({id: "1234"});
    projectService.collection.push(proj, proj2);

    projectService.save().then(function() {
      projectService.remove(proj).then(checkForDeletion1);
      setTimeout(function() {
        projectService.remove(proj2).then(checkForDeletion2);
        $rootScope.$apply();
      }, 10);
    });
    $rootScope.$apply();

    function checkForDeletion1() {
      projectService.load().then(function() {
        expect(projectService.collection).to.have.length(1);
        expect(projectService.collection[0].id).to.equal(proj2.id);
      });
    }
    function checkForDeletion2() {
      projectService.load().then(function(projects) {
        var e = expect(projects).to.be.empty;
        done();
      });
    }
  });
});
