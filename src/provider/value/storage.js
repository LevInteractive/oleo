oleo.value('storage', chrome.storage && chrome.storage.sync ? chrome.storage.sync : null);

if (!chrome.storage) {
  console.warn("Chrome Sync API was not found.");
}
