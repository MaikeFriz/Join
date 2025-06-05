// Function to process tasks for each status and generate HTML strings
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

// Helper function to initialize the status HTML map
function initializeStatusHTMLMap() {
  return {
    toDo: "",
    inProgress: "",
    awaitingFeedback: "",
    done: "",
  };
}

// Function to process tasks for a specific status and return HTML string
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

// Function to assign the generated HTML strings to their respective status containers
function assignStatusHTMLToContainers(statusHTMLMap) {
  document.getElementById("toDoCardsColumn").innerHTML = statusHTMLMap.toDo;
  document.getElementById("inProgressCardsColumn").innerHTML =
    statusHTMLMap.inProgress;
  document.getElementById("awaitFeedbackCardsColumn").innerHTML =
    statusHTMLMap.awaitingFeedback;
  document.getElementById("doneCardsColumn").innerHTML = statusHTMLMap.done;
}
