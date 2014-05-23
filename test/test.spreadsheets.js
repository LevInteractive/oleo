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
          throw new Error("Problem loading content: "+JSON.stringify(httpRequest));
        }
      }
    }
};

describe("spreadsheet service", function() {
  var spreadsheet;
  var withWorksheet;
  var noWorksheet;
  var $httpBackend;
  var $injector;

  // Below is a live & public spreadsheet key.
  var SAMPLE_KEY = "15lLlaf9DdGr-4SY8n8saxkwB-8Yvd7OcKQhgL5BFaY4";

  beforeEach(module('oleo'));
  beforeEach(inject(function(spreadsheetService, _$injector_) {
    $injector = _$injector_;
    $injector.get("authService").accessToken = 123;
    $httpBackend = $injector.get("$httpBackend");
    spreadsheet = spreadsheetService;
    withWorksheet = "https://docs.google.com/a/lev-interactive.com/spreadsheets/d/15lLlaf9DdGr-4SkwB-8Yvd7OcKQ4/edit#gid=123456";
    noWorksheet = "https://docs.google.com/a/lev-interactive.com/spreadsheets/d/15lLlaaxkwB-8Yvd7OcKL5BFaY4/edit";
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  // it("should properly parse a google spreadsheet url", function() {
  //   var badFunc = function() {
  //     spreadsheet.parseUrl("http://blah.com");
  //   };
  //   var r = expect(badFunc).to.throw(Error, "Invalid url.");
  //   r = expect(spreadsheet.parseUrl(withWorksheet)).to.deep.equal({
  //     key: "15lLlaf9DdGr-4SkwB-8Yvd7OcKQ4",
  //     worksheet: "123456"
  //   }, "parsed out the worksheet gid");
  //   r = expect(spreadsheet.parseUrl(noWorksheet)).to.deep.equal({
  //     key: "15lLlaaxkwB-8Yvd7OcKL5BFaY4",
  //     worksheet: "od6"
  //   }, "worksheet defaults to od6.. the first.");
  // });

  // it("should properly parse data from google", function(done) {
  //   var urlObj = { key: "abc", worksheet: "123" };
  //   var url = spreadsheet.cellsendpoint(urlobj);

  //   load("./dummy/cells.json", function(content) {
  //     $httpbackend.whenjsonp(url).respond(200, json.parse(content));
  //     spreadsheet.cells(urlobj).then(function(res) {
  //       expect(res).to.have.length(3);
  //       expect(res[0]).to.have.length(4);
  //       done();
  //     }, function(err) {
  //       throw err;
  //     });
  //     $httpbackend.flush();
  //   });
  // });

  // it("should be able to write to a google spreadsheet", function(done) {
  //   function onsuccess(xml) {
  //     expect(xml).to.have.length.above(20);
  //     done();
  //   }
  //   function onerror(err) {
  //     throw err;
  //   }
  //   var url = spreadsheet.feedendpoint({key:sample_key});
  //   $httpbackend.whenpost(url).respond(200);
  //   spreadsheet.append({key:sample_key}, ["foo", "make", "me", "fun"])
  //     .then(onsuccess, onerror);
  //   $httpbackend.flush();
  // });


  it("should be able to fetch a specifc row by id", function() {});
  it("should be able fetch the spreadsheet's title", function() {});
});
