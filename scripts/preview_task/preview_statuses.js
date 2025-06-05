/**
 * Processes tasks for each status and generates HTML strings for each status column.
 * @param {Object} currentAssignedStatus - The assigned tasks grouped by status.
 * @param {Object} kanbanData - The Kanban data object.
 * @returns {Promise<Object>} A map of status keys to their generated HTML strings.
 */
async function processAssignedStatuses(currentAssignedStatus, kanbanData) {
  const statusHTMLMap = initializeStatusHTMLMap();
  const statusKeys = Object.keys(currentAssignedStatus);

  for (let statusIndex = 0; statusIndex < statusKeys.length; statusIndex++) {
    const statusKey = statusKeys[statusIndex];
    const tasks = currentAssignedStatus[statusKey];
    const taskIds = Object.keys(tasks);
    statusHTMLMap[statusKey] = await processTasksByStatus(
      taskIds,
      statusKey,
      kanbanData
    );
  }
  return statusHTMLMap;
}

/**
 * Initializes the status HTML map with empty strings for each status.
 * @returns {Object} An object with status keys and empty string values.
 */
function initializeStatusHTMLMap() {
  return {
    toDo: "",
    inProgress: "",
    awaitingFeedback: "",
    done: "",
  };
}

/**
 * Processes tasks for a specific status and returns the generated HTML string.
 * @param {Array<string>} taskIds - Array of task IDs for the status.
 * @param {string} status - The status key.
 * @param {Object} kanbanData - The Kanban data object.
 * @returns {Promise<string>} The generated HTML string for the status.
 */
async function processTasksByStatus(taskIds, status, kanbanData) {
  let statusHTML = "";

  for (let taskIndex = 0; taskIndex < taskIds.length; taskIndex++) {
    const taskId = taskIds[taskIndex];
    const processedTask = await processTasks(taskId, kanbanData);
    if (!processedTask) continue; // Skip if task is missing (e.g., deleted)
    const taskHTML = previewTaskTemplate(processedTask);
    statusHTML += taskHTML;
  }
  return statusHTML;
}

/**
 * Assigns the generated HTML strings to their respective status containers in the DOM.
 * @param {Object} statusHTMLMap - A map of status keys to their generated HTML strings.
 */
function assignStatusHTMLToContainers(statusHTMLMap) {
  document.getElementById("toDoCardsColumn").innerHTML = statusHTMLMap.toDo;
  document.getElementById("inProgressCardsColumn").innerHTML =
    statusHTMLMap.inProgress;
  document.getElementById("awaitFeedbackCardsColumn").innerHTML =
    statusHTMLMap.awaitingFeedback;
  document.getElementById("doneCardsColumn").innerHTML = statusHTMLMap.done;
}
