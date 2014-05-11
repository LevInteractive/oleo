var expect = chai.expect;
var assert = chai.assert;

describe("services", function() {
  beforeEach(module('oleo'));
  describe("spreadsheets", function() {

    var spreadsheet;

    beforeEach(inject(function(spreadsheetService) {
      spreadsheet = spreadsheetService;
    }));

    it("should properly parse a google spreadsheet url", function() {
      var withWorksheet = "https://docs.google.com/a/lev-interactive.com/spreadsheets/d/15lLlaf9DdGr-4SkwB-8Yvd7OcKQ4/edit#gid=123456";
      var noWorksheet = "https://docs.google.com/a/lev-interactive.com/spreadsheets/d/15lLlaaxkwB-8Yvd7OcKL5BFaY4/edit";
      var justBad = "http://blah";

      var r = expect(spreadsheet.parseUrl(justBad)).to.be.false;

      r = expect(spreadsheet.parseUrl(withWorksheet)).to.deep.equal({
        key: "15lLlaf9DdGr-4SkwB-8Yvd7OcKQ4",
        worksheet: "123456"
      }, "parsed out the worksheet gid");

      r = expect(spreadsheet.parseUrl(noWorksheet)).to.deep.equal({
        key: "15lLlaaxkwB-8Yvd7OcKL5BFaY4",
        worksheet: "od6"
      }, "worksheet defaults to od6.. the first.");
    });
    it("should retrieve a basic spreadsheet from google (real http request)", function() {});
    it("should be able to write to a google spreadsheet", function() {});
    it("should be able to fetch a specifc row by id", function() {});
    it("should be able fetch the spreadsheet's title", function() {});
  });

});
