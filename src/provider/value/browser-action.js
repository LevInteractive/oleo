oleo.value('browserAction', chrome.browserAction || {});

if (!chrome.browserAction) {
  console.warn("Chrome browserAction API was not found.");
}

