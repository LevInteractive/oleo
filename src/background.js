chrome.app.runtime.onLaunched.addListener(function() {
  'use strict';
  chrome.app.window.create('app.html', {
    id        : "oleoID",
    minWidth  : 350,
    minHeight : 500,
    frame     : "none"
  });
});
