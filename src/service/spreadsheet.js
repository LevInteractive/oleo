// https://developers.google.com/google-apps/spreadsheets/
oleo.service('spreadsheetService', ['$http', '$q', 'identity', 'googleService', function($http, $q, identity, googleAuth) {

  // For returning spreadsheet data.
  // GET
  this.cellsEndpoint = function(urlObj) {
    return "https://spreadsheets.google.com/feeds/cells/"+
        urlObj.key+"/"+urlObj.worksheet+"/public/basic"+
        "?alt=json-in-script&callback=JSON_CALLBACK";
  };

  // For updating and inserting a row. Requires auth.
  // POST
  this.feedEndpoint = function(urlObj) {
    return "https://spreadsheets.google.com/feeds/list/"+
        urlObj.key+"/"+urlObj.worksheet+"/private/full";
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
    if (!googleAuth.accessToken) {
      throw new Error("Access token required.");
    }
    var deferred = $q.defer();
    var dataXml = '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">' + "\n";
    data.forEach(function(cell) {
      dataXml += '<gsx:'+xmlSafeColumnName(cell)+'>'+xmlSafeValue(cell)+'</gsx:'+xmlSafeColumnName(cell)+'>'+"\n";
    });
    dataXml += '</entry>';
    this.request({
      headers: {
        "content-type": "application/atom+xml"
      },
      url: this.feedEndpoint(urlObj),
      token: googleAuth.accessToken,
      data: data,
      method: "POST"
    })
    .success(function(res) {
      deferred.resolve(dataXml);
    })
    .error(function(err) {
      deferred.reject(new Error("There was an error with adding a row to the spreadsheet: "+JSON.stringify(err)));
    });
    return deferred.promise;
  };

  // Request and parse all cell data for a sheet. This will return
  // a promise that will resove a collection of arrays which represents
  // the spreadsheet.
  this.cells = function(urlObj) {
    var deferred = $q.defer();
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
    this.request({
      url: this.cellsEndpoint(urlObj),
      method: "JSONP"
    })
    .success(onSuccess)
    .error(function(res, status) {
      deferred.reject(new Error("Invalid response: "+res));
    });
    return deferred.promise;
  };

  // Request the api.
  this.request = function(opts) {
    var deferred = $q.defer();
    var config = {
      url: opts.url,
      method: opts.method,
    };
    if (opts.token) {
      config.headers = {
        Authorization: "Bearer "+opts.token
      };
    }
    if (opts.headers) {
      config.headers = opts.headers;
    }
    return $http(config)
      .success(deferred.resolve)
      .error(deferred.reject);
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
