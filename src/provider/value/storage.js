oleo.value('storage', chrome.storage && chrome.storage.local ? chrome.storage.local : null);

if (!chrome.storage) {
  console.warn("Chrome Sync API was not found.");
}
