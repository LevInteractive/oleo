var expect = chai.expect;
var assert = chai.assert;

describe("project model", function() {
  beforeEach(module('oleo'));
  var $httpBackend;
  var $injector;
  var ProjectFactory;

  beforeEach(inject(function(Project, _$injector_) {
    $injector = _$injector_;
    ProjectFactory = Project;
  }));

  it("should be able to create thousands of unqiue ids", function() {
    var i = 10000, c = {}, _i = i;
    while(i--) {
      c[(new ProjectFactory()).get("id")] = i;
    }
    expect(Object.keys(c)).to.have.length(_i);
  });
});
