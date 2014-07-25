oleo.factory("taskFactory", ['i18n', function(i18n) {
  return function(props) {
    if (!props || !props.projectId) {
      throw new Error("A projectId is required to create a task.");
    }
    return {
      id: props.id || "#"+Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: props.name || i18n.getMessage('newTask'),
      weight: props.weight || 0,
      creationDate: props.creationDate || Date.now(),
      projectId: props.projectId,
      running: props.running || false,
      initialStart: props.initialStart || null,

      // A Unix timestamp for every increment. How we can find our placement
      // in time and space.
      secondsEpoch: props.secondsEpoch || null,

      // Total amount of seconds a timer has been run.
      seconds: props.seconds || 0
    };
  };
}]);
