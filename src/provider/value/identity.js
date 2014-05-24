oleo.value('identity', chrome.identity || {});

if (!chrome.identity) {
  console.warn("Chrome Identity API was not found.");
}
