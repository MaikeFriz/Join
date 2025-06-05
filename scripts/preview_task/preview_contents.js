/**
 * Retrieves the task content based on the provided taskId.
 * @param {string} taskId - The ID of the task.
 * @param {Object} kanbanData - The Kanban data object.
 * @returns {Object|null} The task content object or null if not found.
 */
function getTaskContent(taskId, kanbanData) {
  const taskContent = kanbanData.tasks?.[taskId];
  if (!taskContent) {
    return null;
  }
  return taskContent;
}

/**
 * Structures the task data for display.
 * @param {Object} taskContent - The task content object.
 * @returns {Object} The structured task data.
 */
function getTaskData(taskContent) {
  return {
    label: getTaskLabel(taskContent),
    fitLabelForCSS: getTaskLabel(taskContent).toLowerCase().replace(/\s+/g, "-"),
    title: getTaskTitle(taskContent),
    description: getTaskDescription(taskContent),
    subtasks: taskContent.subtasks || {},
    totalSubtasks: taskContent.totalSubtasks || 0,
    completedSubtasks: taskContent.completedSubtasks || 0,
    progressPercentage: taskContent.subtaskProgress || 0,
    showProgress: taskContent.showProgress || false,
    priority: taskContent.priority || "no-priority",
    taskId: taskContent.taskId,
    createAt: taskContent.createdAt,
  };
}

/**
 * Returns the label of the task or a default value.
 * @param {Object} taskContent - The task content object.
 * @returns {string} The label of the task.
 */
function getTaskLabel(taskContent) {
  return taskContent.label || "No Category";
}

/**
 * Returns the title of the task or a default value.
 * @param {Object} taskContent - The task content object.
 * @returns {string} The title of the task.
 */
function getTaskTitle(taskContent) {
  return taskContent.title || "No Title";
}

/**
 * Returns the description of the task or a default value.
 * @param {Object} taskContent - The task content object.
 * @returns {string} The description of the task.
 */
function getTaskDescription(taskContent) {
  return taskContent.description || "No Description";
}

/**
 * Processes a task and fetches relevant data, including subtasks.
 * @param {string} taskId - The ID of the task.
 * @param {Object} kanbanData - The Kanban data object.
 * @returns {Promise<Object|null>} The processed task object or null if not found.
 */
async function processTasks(taskId, kanbanData) {
  const taskContent = getTaskContent(taskId, kanbanData);
  if (!taskContent) return null;

  const processedTask = processTaskDetails(taskContent, taskId, kanbanData);
  const subtaskData = await processSubtaskDetails(taskId, kanbanData);

  processedTask.subtaskProgress = subtaskData.subtaskProgress;
  processedTask.showProgress = subtaskData.showProgress;
  processedTask.totalSubtasks = subtaskData.totalSubtasks;
  processedTask.completedSubtasks = subtaskData.completedSubtasks;

  return processedTask;
}

/**
 * Processes task details and prepares them for display.
 * @param {Object} taskContent - The task content object.
 * @param {string} taskId - The ID of the task.
 * @param {Object} kanbanData - The Kanban data object.
 * @returns {Object} The processed task content object.
 */
function processTaskDetails(taskContent, taskId, kanbanData) {
  taskContent.taskId = taskId;
  taskContent.assignedUserName = kanbanData.users[taskContent.assignedTo]?.name || "Unbekannter Benutzer";
  taskContent.label = taskContent.label || "Keine Kategorie";
  taskContent.priority = taskContent.priority || "niedrig";
  taskContent.title = taskContent.title || "Kein Titel";
  taskContent.description = taskContent.description || "Keine Beschreibung";
  taskContent.assignees = taskContent.assignees || {};
  taskContent.assigneesNames = getAssigneesNames(taskContent.assignees, kanbanData);
  return taskContent;
}


