oleo.filter('rate', function() {
  return function(secs, rate) {
    return (secs / 3600) * rate;
  };
});
