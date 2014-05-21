oleo.filter('lifespan', ['$filter', function($filter) {
  return function(start, last) {
    var date = $filter("date");
    var FORMAT_SINGLE = "MMM. d - ";
    var FORMAT = "MMM. d, yyyy";
    var startDate;
    var endDate;
    var str = "";
    if (!start) {
      str = date(Date.now(), FORMAT);
      return str;
    }
    startDate = start;
    endDate = last;
    if (date(startDate, FORMAT) === date(endDate, FORMAT)) {
      str += date(startDate, FORMAT);
    } else {
      str += date(startDate, FORMAT_SINGLE) + date(startDate, FROMAT);
    }
    return str;
  };
}]);
