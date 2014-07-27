if (!chrome.identity) {
  console.log("Chrome i18n API was not found.");
}

oleo.value('i18n', chrome.i18n || {});
