if (!chrome.identity) {
  console.log("Chrome Identity API was not found.");
}

oleo.value('identity', chrome.identity || {});
