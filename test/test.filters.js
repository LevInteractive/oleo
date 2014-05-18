var expect = chai.expect;
var assert = chai.assert;

describe("filters", function() {

  beforeEach(function() {
    module('oleo');
  });

  describe("timespan", function() {

    var timespan;

    beforeEach(inject(function($filter) {
      timespan = $filter("timespan");
    }));


    it("should properly get the difference between stopped and started", function() {
      expect(timespan(3600)).to.equal("01:00:00");
      expect(timespan(3601)).to.equal("01:00:01");
      expect(timespan(3661)).to.equal("01:01:01");
    });
  });

  describe("lifeSpan", function() {
    var lifeSpan;

    beforeEach(inject(function($filter) {
      lifeSpan = $filter("lifeSpan");
    }));

    it("should take a date array and display the date(s)", function(){
      var start = new Date(2014, 0, 20, 1);

    });
  });
});
