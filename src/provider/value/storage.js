if (!chrome.storage || !chrome.storage.local) {
  console.log("Chrome Storage Local API was not found.");
}

oleo.value('storage', chrome.storage ? chrome.storage.local : localStorage);
