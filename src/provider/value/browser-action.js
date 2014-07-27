if (!chrome.browserAction) {
  console.log("Chrome browserAction API was not found.");
}

oleo.value('browserAction', chrome.browserAction || {});
