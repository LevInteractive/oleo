oleo.service('storageService', ['storage', '$q', function (storage, $q) {
  'use strict';
  this.get = function (key) {
    var deferred = $q.defer();
    var result = {};
    if (storage[key]) {
      result[key] = JSON.parse(storage[key]);
    }
    deferred.resolve(result);
    return deferred.promise;
  };
  this.put = function (key, data) {
    var deferred = $q.defer();
    storage[key] = JSON.stringify(data);
    deferred.resolve(storage);
    return deferred.promise;
  };
  // this.get = function (key) {
  //   var deferred = $q.defer();
  //   storage.get(key, function(data) {
  //     deferred.resolve(data);
  //   });
  //   return deferred.promise;
  // };
  // this.put = function (key, data) {
  //   var deferred = $q.defer();
  //   var _data = {};
  //   _data[key] = data;
  //   storage.set(_data, deferred.resolve);
  //   return deferred.promise;
  // };
}]);
