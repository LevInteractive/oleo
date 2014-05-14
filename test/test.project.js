var expect = chai.expect;
var assert = chai.assert;

describe("project model", function() {
  beforeEach(module('oleo'));

  var ProjectFactory;

  beforeEach(inject(function(Project) {
    ProjectFactory = Project;
  }));

  // These are really tests for the parent Model class.
  it("should be able to create thousands of unqiue ids", function() {
    var i = 10000, c = {}, _i = i;
    while(i--) {
      c[new ProjectFactory().get("id")] = i;
    }
    expect(Object.keys(c)).to.have.length(_i);
  });
  it("get should work as expected", function() {
    var p = new ProjectFactory();
    expect(p.get("name")).to.be.a("null");
    var o = new ProjectFactory({ name: "foo" });
    expect(o.get("name")).to.equal("foo");
  });
  it("set should work as expected", function() {
    var p = new ProjectFactory();
    p.set("name", "peter");
    expect(p.get("name")).to.equal("peter");
  });
});
