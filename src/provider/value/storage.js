// There seems to be a bug with chrome.storage that won't allow information
// to clear sometimes. Will just use localStorage for now. localStorage is
// just a lot more stable.
//
// oleo.value('storage', chrome.storage && chrome.storage.local ? chrome.storage.local : null);
oleo.value('storage', localStorage);
