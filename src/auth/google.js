oleo.service('googleAuth', ['$http', '$q', function($http, $q) {
  this.auth = function(interactive) {
    var deferred = $q.defer();
    var promise = deferred.promise;
    try {
      chrome.identity.getAuthToken({interactive: interactive}, function(token) {
        if (token) {
          oleo.value("googleAccessToken", token);
          deferred.resolve(token);
        }
      });
    } catch(e) {
      deferred.reject(e);
    }
    return promise;
  };
}]);
