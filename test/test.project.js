var expect = chai.expect;
var assert = chai.assert;

describe("projects", function() {

  var storageService;
  var projectService;
  var projectFactory;
  var $rootScope;

  beforeEach(function() {
    module('oleo');
    module(function($provide) {
      $provide.value("storage", window.chromeStorageMock()); // The swap.
    });
  });

  beforeEach(inject(function(storage,_projectFactory_, _projectService_, _storageService_, $q, _$rootScope_) {
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
});
