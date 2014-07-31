oleo.factory("projectFactory", ['i18n', function(i18n) {
  'use strict';
  return function(props) {
    props = props || {};
    return {
      id           : props.id || "#"+Math.random().toString(36).substr(2, 9).toUpperCase(),
      name         : props.name || i18n.getMessage('newProject'),
      weight       : props.weight || 0,
      spreadsheet  : props.spreadsheet || null,
      rate         : props.rate || 0,
      totalTime    : props.totalTime || 0,
      current      : props.current || false,
      creationDate : props.creationDate || Date.now()
    };
  };
}]);
