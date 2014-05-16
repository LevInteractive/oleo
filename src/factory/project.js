oleo.factory("projectFactory", function() {
  return function(props) {
    props = props || {};
    return {
      id: props.id || Math.random().toString(36).substr(2, 6),
      name: props.name || "",
      weight: props.weight || 0,
      creationDate: props.creationDate || new Date()
    };
  };
});
