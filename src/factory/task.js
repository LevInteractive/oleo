oleo.factory("taskFactory", function() {
  return function(props) {
    if (!props || !props.projectId) {
      throw new Error("A projectId is required to create a task.");
    }
    return {

      // Unique ID for task.
      id: props.id || Math.random().toString(36).substr(2, 6),

      // Name/comment for task.
      name: props.name || "",

      // Order of task.
      weight: props.weight || 0,

      // When the task was created.
      creationDate: props.creationDate || Date.now(),

      // The projectID to which this task belongs to.
      projectId: props.projectId,

      // An optional currency rate.
      rate: props.rate || 0,

      // Boolean for when the timer is running or not.
      running: props.running || false,

      // Set the first time the timer is ever started.
      initialStart: props.initialStart || null,

      // Epoch time when start is clicked.
      start: props.start || null,

      // Epoch time when pause is clicked.
      stop: props.stop || null,

      // Total amount of seconds a timer has been run.
      seconds: props.seconds || 0,

      // Set to the amount of seconds there are when start is clicked.
      // Used to reset the time and re-calculate when coming back from
      // an idle state.
      startSeconds: props.startSeconds || 0
    };
  };
});
