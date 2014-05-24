oleo.factory("projectFactory", function() {
  return function(props) {
    props = props || {};
    return {
      id: props.id || "#"+Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: props.name || "New Project",
      weight: props.weight || 0,
      spreadsheet: props.spreadsheet || null,
      rate: props.rate || 0,
      current: props.current || false,
      creationDate: props.creationDate || Date.now()
    };
  };
});
