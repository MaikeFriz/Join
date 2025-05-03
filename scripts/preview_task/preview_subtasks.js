// Function to process subtask details and return relevant data
async function processSubtaskDetails(taskId, kanbanData) {
    const subtaskData = await processSubtasks(taskId, kanbanData);
    return {
      subtaskProgress: subtaskData.progressPercentage,
      showProgress: subtaskData.showProgress,
      totalSubtasks: subtaskData.totalSubtasks,
      completedSubtasks: subtaskData.completedSubtasks
    };
  }
  
  // Function to process subtasks related to a task
  async function processSubtasks(taskId, kanbanData) {
    const subtasks = kanbanData.subtasks || {};
    const taskSubtasks = getTaskSubtasks(taskId, subtasks);
  
    if (taskSubtasks.length === 0) {
      return createNoSubtasksData();
    }
  
    logSubtaskCompletionStatus(taskId, taskSubtasks, subtasks);
    const completedSubtasks = countCompletedSubtasks(taskSubtasks, subtasks);
    const progressPercentage = calculateProgressPercentage(taskSubtasks, completedSubtasks);
  
    return createSubtaskData(taskSubtasks, completedSubtasks, progressPercentage);
  }
  
  // Function to retrieve subtasks for a task based on taskId
  function getTaskSubtasks(taskId, subtasks) {
    return Object.keys(subtasks).filter(subtaskId => subtasks[subtaskId][taskId]);
  }
  
  // Function to handle cases where no subtasks exist and return default data
  function createNoSubtasksData() {
    console.log("Task hat keine Subtasks.");
    return {
      totalSubtasks: 0,
      completedSubtasks: 0,
      progressPercentage: 0,
      showProgress: false
    };
  }
  
  // Function to log subtask completion status for each task subtask
  function logSubtaskCompletionStatus(taskId, taskSubtasks, subtasks) {
    taskSubtasks.forEach(subtaskId => {
      const subtask = subtasks[subtaskId];
      const isCompleted = subtask.completed;
      console.log(`Task ID: ${taskId} -> Subtask ID: ${subtaskId} | Completed: ${isCompleted}`);
    });
  }
  
  // Function to count the number of completed subtasks for a task
  function countCompletedSubtasks(taskSubtasks, subtasks) {
    return taskSubtasks.filter(subtaskId => subtasks[subtaskId].completed).length;
  }
  
  // Function to calculate the progress percentage of a task based on its subtasks
  function calculateProgressPercentage(taskSubtasks, completedSubtasks) {
    return (taskSubtasks.length > 0) 
      ? (completedSubtasks / taskSubtasks.length) * 100 
      : 0;
  }
  
  // Function to create and return the subtask data for a task
  function createSubtaskData(taskSubtasks, completedSubtasks, progressPercentage) {
    return {
      totalSubtasks: taskSubtasks.length,
      completedSubtasks: completedSubtasks,
      progressPercentage: progressPercentage,
      showProgress: true
    };
  }
