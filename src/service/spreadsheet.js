// https://developers.google.com/google-apps/spreadsheets/
oleo.service('spreadsheetService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {

  // For returning spreadsheet data.
  // GET
  this.cellsEndpoint = function(urlObj) {
    return "https://spreadsheets.google.com/feeds/cells/"+
        urlObj.key+"/"+urlObj.worksheet+"/public/basic"+
        "?alt=json-in-script&callback=JSON_CALLBACK";
  };

  // For updating and inserting a row.
  // POST
  this.feedEndpoint = function(urlObj) {
    return "https://spreadsheets.google.com/feeds/list/"+
        urlObj.key+"/"+urlObj.worksheet+"/public/values";
  };

  // Parse a google spreadsheet url and return a "url object".
  // Returns false if not a propery spreadsheet url.
  // https://developers.google.com/gdata/samples/spreadsheet_sample
  this.parseUrl = function(url) {
    var matches = [],
        urlObj = {};
    if (typeof url !== "string") {
      throw new Error("Invalid url.");
    }
    matches = url.match(/^https:\/\/.*google.com.*\/d\/([^/]+).*$/i);
    if (!matches || matches.length < 2) {
      throw new Error("Invalid url.");
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

  // Append row to spreadsheet.
  // https://developers.google.com/google-apps/spreadsheets/#adding_a_list_row
  this.append = function(urlObj, data) {
    if (!data) {
      throw new Error("Data is required to add a row.");
    }
    var deferred = $q.defer();
    var promise = deferred.promise;
    var dataXml = '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">' + "\n";
    data.forEach(function(cell) {
      dataXml += '<gsx:'+xmlSafeColumnName(cell)+'>'+xmlSafeValue(cell)+'</gsx:'+xmlSafeColumnName(cell)+'>'+"\n";
    });
    dataXml += '</entry>';
    
    function onSuccess(res) {
      deferred.resolve(dataXml);
    }
    function onError(err) {
      deferred.reject(new Error("There was an error with adding a row to the spreadsheet: "+JSON.stringify(err)));
    }
    $http.post(this.feedEndpoint(urlObj), dataXml, { headers: { "content-type": "application/atom+xml" } })
      .success(onSuccess).error(onError);

    return promise;
  };

  // Request and parse all cell data for a sheet. This will return
  // a promise that will resove a collection of arrays which represents
  // the spreadsheet.
  this.cells = function(urlObj) {
    var deferred = $q.defer();
    var promise = deferred.promise;
    var collection = [];
    var onSuccess = function(res, status) {
      var feed = res.feed;
      var entries = feed.entry || [];
      var entry = null;
      var cells = [];
      var row = null;
      var col = null;
      var pRow = null;
      for (var i = 0; i < entries.length; ++i) {
        entry = entries[i];
        row = parseInt(entry.title.$t.replace(/[a-z]*/i, ''), 10) - 1;
        col = entry.title.$t.replace(/[0-9]*/i);
        if (pRow !== row) {
          cells[row] = [];
        }
        cells[row].push({
          pos: entry.title.$t,
          content: entry.content.$t
        });
        pRow = row;
      }
      deferred.resolve(cells);
    };
    var onError = function(res, status) {
      deferred.reject(new Error("Invalid response: "+res));
    };
    $http({
      url: this.cellsEndpoint(urlObj),
      method: "JSONP"
    }).success(onSuccess).error(onError);
    return promise;
  };

  // A few helpers for formatting.
  function xmlSafeValue(val){
    if (!val) {
      return '';
    }
    return String(val).replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function xmlSafeColumnName(val){
    if (!val) {
      return '';
    }
    return String(val).replace(/\s+/g, '').toLowerCase();
  }
}]);
