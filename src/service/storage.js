oleo.factory('storageService', ['storage', '$q', function (storage, $q) {
  var STORAGE_ID = '__oleo__';

  return {
    get: function (key) {
      var deferred = $q.defer();
      storage.get(key, function(data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    },
    put: function (key, data) {
      var deferred = $q.defer();
      var _data = {};
      data[key] = data;
      storage.set(data, deferred.resolve);
      return deferred.promise;
    }
  };
}]);
