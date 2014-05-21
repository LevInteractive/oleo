oleo.filter('timespan', function() {
  return function(span) {
    var hours = parseInt(span / 3600 );
    var minutes = parseInt(span / 60 ) % 60;
    var seconds = span % 60;

    return ((hours > 9) ? hours : "0" + hours) +
        ":"+ ((minutes > 9) ? minutes : "0" + minutes) +
        ":"+ ((seconds > 9) ? seconds : "0" + seconds);
  };
});
