
// The óleo module.
var oleo = angular.module("oleo", []);

// App properties.
oleo.value('identity', chrome.identity || {});
oleo.value('storage', chrome.storage ? chrome.storage.sync : localStorage);
oleo.value('appName', "óleo");
