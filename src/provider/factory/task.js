oleo.factory("taskFactory", function() {
  return function(props) {
    if (!props || !props.projectId) {
      throw new Error("A projectId is required to create a task.");
    }
    return {

      // Unique ID for task.
      id: props.id || "#"+Math.random().toString(36).substr(2, 9).toUpperCase(),

      // Name/comment for task.
      name: props.name || "",

      // Order of task.
      weight: props.weight || 0,

      // When the task was created.
      creationDate: props.creationDate || Date.now(),

      // The projectID to which this task belongs to.
      projectId: props.projectId,

      // Boolean for when the timer is running or not.
      running: props.running || false,

      // Set the first time the timer is ever started.
      initialStart: props.initialStart || null,

      // A Unix timestamp for every increment. How we can find our placement
      // in time and space.
      secondsEpoch: props.secondsEpoch || null,

      // Total amount of seconds a timer has been run.
      seconds: props.seconds || 0
    };
  };
});
