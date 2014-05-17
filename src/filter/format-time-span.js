oleo.filter('timeSpan', function() {
  return function(diff) {
    var delta = Math.abs(diff) / 1000;
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    var seconds = String(delta % 60);
    return ((hours > 9) ? hours : "0" + hours) +
        ":"+ ((minutes > 9) ? minutes : "0" + minutes) +
        ":"+ ((seconds > 9) ? seconds : "0" + seconds);
  };
});
