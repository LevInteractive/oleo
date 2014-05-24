oleo.filter('rate', function() {
  return function(secs, rate) {
    if (!secs || !rate) {
      secs = 0;
      rate = 0;
    }
    return (secs / 3600) * rate;
  };
});
