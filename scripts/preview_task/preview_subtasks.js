/**
 * Processes subtask details for a given task and returns relevant data.
 * @param {string} taskId - The ID of the task.
 * @param {Object} kanbanData - The Kanban data object.
 * @returns {Promise<Object>} An object containing subtask progress and counts.
 */
async function processSubtaskDetails(taskId, kanbanData) {
  const subtaskData = await processSubtasks(taskId, kanbanData);
  return {
    subtaskProgress: subtaskData.progressPercentage,
    showProgress: subtaskData.showProgress,
    totalSubtasks: subtaskData.totalSubtasks,
    completedSubtasks: subtaskData.completedSubtasks,
  };
}

/**
 * Processes subtasks related to a task and returns subtask data.
 * @param {string} taskId - The ID of the task.
 * @param {Object} kanbanData - The Kanban data object.
 * @returns {Promise<Object>} An object containing subtask data.
 */
async function processSubtasks(taskId, kanbanData) {
  const subtasks = kanbanData.subtasks || {};
  const taskSubtasks = getTaskSubtasks(taskId, subtasks);
  if (taskSubtasks.length === 0) {
    return createNoSubtasksData();
  }
  const completedSubtasks = countCompletedSubtasks(taskSubtasks, subtasks);
  const progressPercentage = calculateProgressPercentage(
    taskSubtasks,
    completedSubtasks
  );
  return createSubtaskData(taskSubtasks, completedSubtasks, progressPercentage);
}

/**
 * Retrieves subtasks for a task based on taskId.
 * @param {string} taskId - The ID of the task.
 * @param {Object} subtasks - The subtasks object.
 * @returns {Array<string>} Array of subtask IDs for the task.
 */
function getTaskSubtasks(taskId, subtasks) {
  return Object.keys(subtasks).filter(
    (subtaskId) => subtasks[subtaskId][taskId]
  );
}

/**
 * Handles cases where no subtasks exist and returns default subtask data.
 * @returns {Object} An object with default subtask data.
 */
function createNoSubtasksData() {
  return {
    totalSubtasks: 0,
    completedSubtasks: 0,
    progressPercentage: 0,
    showProgress: false,
  };
}

/**
 * Counts the number of completed subtasks for a task.
 * @param {Array<string>} taskSubtasks - Array of subtask IDs.
 * @param {Object} subtasks - The subtasks object.
 * @returns {number} The number of completed subtasks.
 */
function countCompletedSubtasks(taskSubtasks, subtasks) {
  return taskSubtasks.filter((subtaskId) => subtasks[subtaskId].completed)
    .length;
}

/**
 * Calculates the progress percentage of a task based on its subtasks.
 * @param {Array<string>} taskSubtasks - Array of subtask IDs.
 * @param {number} completedSubtasks - Number of completed subtasks.
 * @returns {number} The progress percentage.
 */
function calculateProgressPercentage(taskSubtasks, completedSubtasks) {
  return taskSubtasks.length > 0
    ? (completedSubtasks / taskSubtasks.length) * 100
    : 0;
}

/**
 * Creates and returns the subtask data for a task.
 * @param {Array<string>} taskSubtasks - Array of subtask IDs.
 * @param {number} completedSubtasks - Number of completed subtasks.
 * @param {number} progressPercentage - The progress percentage.
 * @returns {Object} The subtask data object.
 */
function createSubtaskData(
  taskSubtasks,
  completedSubtasks,
  progressPercentage
) {
  return {
    totalSubtasks: taskSubtasks.length,
    completedSubtasks: completedSubtasks,
    progressPercentage: progressPercentage,
    showProgress: taskSubtasks.length > 0,
  };
}
