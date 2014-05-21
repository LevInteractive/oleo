oleo.service('googleService', ['$http', '$q', 'identity', function($http, $q, identity) {
  this.accessToken = null;

  this.auth = function(interactive) {
    var deferred = $q.defer();
    var promise = deferred.promise;
    try {
      identity.getAuthToken({interactive: interactive}, function(token) {
        if (token) {
          this.accessToken = token;
          deferred.resolve(token);
        } else {
          this.accessToken = null;
        }
      }.bind(this));
    } catch(e) {
      this.accessToken = null;
      deferred.reject(e);
    }
    return promise;
  };

  this.revokeToken = function() {
    var deferred = $q.defer();
    var promise = deferred.promise;
    var token = this.accessToken;
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token='+token);
      xhr.send();
      this.accessToken = null;
      identity.removeCachedAuthToken({ 
        token: token
      }, function() {
        deferred.resolve(token);
      });
    }
    return promise;
  };
}]);
