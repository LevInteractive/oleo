var expect = chai.expect;
var assert = chai.assert;

// Basic ajax loader for dummy content.
var load = function(url, cb) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = loaded;
    httpRequest.open('GET', url);
    httpRequest.send();
    function loaded() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          cb(httpRequest.responseText);
        } else {
          throw new Error("Problem loading content: ", httpRequest);
        }
      }
    }
};

describe("services", function() {
  beforeEach(module('oleo'));
  describe("spreadsheets", function() {

    var spreadsheet;
    var withWorksheet;
    var noWorksheet;
    var $httpBackend;

    // Below is a live & public spreadsheet key.
    var SAMPLE_KEY = "15lLlaf9DdGr-4SY8n8saxkwB-8Yvd7OcKQhgL5BFaY4";

    beforeEach(inject(function(spreadsheetService, $injector) {
      $httpBackend = $injector.get("$httpBackend");
      spreadsheet = spreadsheetService;
      withWorksheet = "https://docs.google.com/a/lev-interactive.com/spreadsheets/d/15lLlaf9DdGr-4SkwB-8Yvd7OcKQ4/edit#gid=123456";
      noWorksheet = "https://docs.google.com/a/lev-interactive.com/spreadsheets/d/15lLlaaxkwB-8Yvd7OcKL5BFaY4/edit";
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("should properly parse a google spreadsheet url", function() {
      var justBad = "http://blah";
      var badFunc = function() {
        spreadsheet.parseUrl(justBad);
      };
      var r = expect(badFunc).to.throw(Error, "Invalid url.");
      r = expect(spreadsheet.parseUrl(withWorksheet)).to.deep.equal({
        key: "15lLlaf9DdGr-4SkwB-8Yvd7OcKQ4",
        worksheet: "123456"
      }, "parsed out the worksheet gid");
      r = expect(spreadsheet.parseUrl(noWorksheet)).to.deep.equal({
        key: "15lLlaaxkwB-8Yvd7OcKL5BFaY4",
        worksheet: "od6"
      }, "worksheet defaults to od6.. the first.");
    });

    it("should properly parse data from google", function(done) {
      var urlObj = { key: "abc", worksheet: "123" };
      var url = spreadsheet.cellsEndpoint(urlObj);

      load("./dummy/cells.json", function(content) {
        $httpBackend.whenJSONP(url).respond(200, JSON.parse(content));
        spreadsheet.cells(urlObj).then(function(res) {
          console.log(res);
          done();
        }, function(err) {
          throw err;
        });
        $httpBackend.flush();
      });
    });
    it("should be able to write to a google spreadsheet", function() {});
    it("should be able to fetch a specifc row by id", function() {});
    it("should be able fetch the spreadsheet's title", function() {});
  });

});
