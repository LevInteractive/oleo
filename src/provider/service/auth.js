oleo.service('authService', ['$http', '$q', 'identity', 'storageService', function($http, $q, identity, storageService) {
  'use strict';
  this.accessToken = null;

  this.authorize = function(interactive) {
    var deferred = $q.defer();
    try {
      identity.getAuthToken({
        interactive: interactive
      }, function(token) {
        if (token) {
          this.accessToken = token;
          deferred.resolve(token);
        } else {
          this.accessToken = null;
          deferred.reject("No token.");
        }
      }.bind(this));
    } catch(e) {
      this.accessToken = null;
      console.error(e);
      deferred.reject(e);
    }
    return deferred.promise;
  };

  this.setUserData = function() {
    var deferred = $q.defer();
    $q.all([this.authorize(true), storageService.get('user')]).then(function(result, userdata) {
      var token = result[0];
      var user = result && result[1] && result[1].user ? result[1].user : {};
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
        xhr.setRequestHeader("Authorization", "Bearer "+token);
        xhr.send();
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            try {
              var data = JSON.parse(xhr.responseText);
              if (data.name) {
                user.name = data.name;
                storageService.put("user", user).then(function() {
                  deferred.resolve(user);
                });
              } else {
                deferred.resolve(user);
              }
            } catch(e) {
              deferred.resolve(user);
            }
          } else if (xhr.readyState === 4) {
            deferred.resolve(user);
          }
        };
      } else {
        deferred.resolve(user);
      }
    });
    return deferred.promise;
  };

  this.revokeToken = function() {
    var deferred = $q.defer();
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
    return deferred.promise;
  };
}]);
