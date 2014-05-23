oleo.factory("projectFactory", function() {
  return function(props) {
    props = props || {};
    return {
      id: props.id || Math.random().toString(36).substr(2, 6),
      name: props.name || "New Project",
      weight: props.weight || 0,
      spreadsheet: props.spreadsheet || null,
      rate: props.rate || 0,
      rates: props.rates || false,
      connected: props.connected || null,
      current: props.current || false,
      creationDate: props.creationDate || Date.now()
    };
  };
});
