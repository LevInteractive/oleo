var expect = chai.expect;
var assert = chai.assert;

// Basic ajax loader for dummy content.
var _load = function(url, cb) {
  'use strict';
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
  'use strict';
  var spreadsheet;
  var withWorksheet;
  var withWorksheet0;
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
    withWorksheet0 = "https://docs.google.com/a/lev-interactive.com/spreadsheets/d/15lLlaf9DdGr-4SkwB-8Yvd7OcKQ4/edit#gid=0";
    noWorksheet = "https://docs.google.com/a/lev-interactive.com/spreadsheets/d/15lLlaaxkwB-8Yvd7OcKL5BFaY4/edit";
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("should convert a spreadsheet title to a proper column and row", function() {
    var coords = spreadsheet.titleCoord("A1");
    expect(coords.col).to.equal(1);
    expect(coords.row).to.equal(1);
    coords = spreadsheet.titleCoord("G6");
    expect(coords.col).to.equal(7);
    expect(coords.row).to.equal(6);
    coords = spreadsheet.titleCoord("GG66");
    expect(coords.col).to.equal(33);
    expect(coords.row).to.equal(66);
    coords = spreadsheet.titleCoord("AA66");
    expect(coords.col).to.equal(27);
    expect(coords.row).to.equal(66);
    coords = spreadsheet.titleCoord("AAA6600");
    expect(coords.col).to.equal(53);
    expect(coords.row).to.equal(6600);
  });

  it("should properly parse a google spreadsheet url", function() {
    var badFunc = function() {
      spreadsheet.parseUrl("http://blah.com");
    };
    var r = expect(badFunc).to.throw(Error, "Invalid url.");

    r = expect(spreadsheet.parseUrl(withWorksheet)).to.deep.equal({
      key: "15lLlaf9DdGr-4SkwB-8Yvd7OcKQ4",
      worksheet: "123456"
    });

    r = expect(spreadsheet.parseUrl(noWorksheet)).to.deep.equal({
      key: "15lLlaaxkwB-8Yvd7OcKL5BFaY4",
      worksheet: "od6"
    });

    // The gid=0 should also default to either 1 or od6. No longer does it work.
    // http://stackoverflow.com/questions/24531351/retrieve-google-spreadsheet-worksheet-json
    r = expect(spreadsheet.parseUrl(withWorksheet0)).to.deep.equal({
      key: "15lLlaf9DdGr-4SkwB-8Yvd7OcKQ4",
      worksheet: "od6"
    });
  });
});
