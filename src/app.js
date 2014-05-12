
// The óleo module.
var oleo = angular.module("oleo", []);

// App properties.
oleo.value('identity', chrome.identity);
oleo.value('storage', chrome.storage.sync);
oleo.value('appName', "óleo");
