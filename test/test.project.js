var expect = chai.expect;
var assert = chai.assert;

describe("project model", function() {
  beforeEach(module('oleo'));

  var ProjectFactory;

  beforeEach(inject(function(Project) {
    ProjectFactory = Project;
  }));

  it("should be able to create thousands of unqiue ids", function() {
    var i = 10000, c = {}, _i = i;
    while(i--) {
      c[new ProjectFactory().get("id")] = i;
    }
    expect(Object.keys(c)).to.have.length(_i);
  });
});
