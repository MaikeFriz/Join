// Function to process tasks for each status and generate HTML strings
async function processAssignedStatuses(currentAssignedStatus, kanbanData) {
  const statusHTMLMap = {
    toDo: "",
    inProgress: "",
    awaitingFeedback: "",
    done: "",
  };

  for (let status in currentAssignedStatus) {
    if (currentAssignedStatus.hasOwnProperty(status)) {
      const tasks = currentAssignedStatus[status];
      const taskIds = Object.keys(tasks);
      statusHTMLMap[status] = await processTasksByStatus(
        taskIds,
        status,
        kanbanData
      );
    }
  }
  return statusHTMLMap;
}

// Function to process tasks for a specific status and return HTML string
async function processTasksByStatus(taskIds, status, kanbanData) {
  let statusHTML = "";

  for (let taskId of taskIds) {
    const processedTask = await processTasks(taskId, kanbanData);

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
