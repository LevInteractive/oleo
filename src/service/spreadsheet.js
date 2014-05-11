// https://developers.google.com/google-apps/spreadsheets/
oleo.service('spreadsheetService', function($http, $q, $rootScope) {

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

  this.cellsEndpoint = function(urlObj) {
    return "https://spreadsheets.google.com/feeds/cells/"+
        urlObj.key+"/"+urlObj.worksheet+"/public/basic"+
        "?alt=json-in-script&callback=JSON_CALLBACK";
  };

  // Request and parse all cell data for a sheet. This will return
  // a promise.
  this.cells = function(urlObj) {
    var deferred = $q.defer();
    var promise = deferred.promise;
    var collection = [];
    var onSuccess = function(res, status) {
      var feed = res.feed;
      var entries = feed.entry || [];
      deferred.resolve(res, status);
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
});
