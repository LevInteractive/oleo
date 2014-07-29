if (!chrome.idle) {
  console.log("Chrome idle API was not found.");
}

oleo.value('idle', chrome.idle || false);
