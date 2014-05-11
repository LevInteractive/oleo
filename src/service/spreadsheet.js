oleo.service('spreadsheetService', function($http) {

  // Parse a google spreadsheet url and return a "url object".
  // Returns false if not a propery spreadsheet url.
  // https://developers.google.com/gdata/samples/spreadsheet_sample
  this.parseUrl = function(url) {
    var matches = [],
        urlObj = {};

    if (typeof url !== "string") {
      return false;
    }
    matches = url.match(/^https:\/\/.*google.com.*\/d\/([^/]+).*$/i);
    if (!matches || matches.length < 2) {
      return false;
    }
    urlObj.key = matches[1];
    matches = url.match(/gid=([^/]+)/i);
    if (matches && matches.length > 1) {
      urlObj.worksheet = matches[1];
    } else {
      urlObj.worksheet = "od6"; // First worksheet.
    }
    return urlObj;
  };
  this.cells = function(urlObject) {
    var endpoint = "https://spreadsheets.google.com/feeds/cells/%key%/%worksheet%/public/basic?alt=json-in-script&callback=";
  };
});
