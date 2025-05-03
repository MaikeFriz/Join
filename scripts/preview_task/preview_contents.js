// Function to retrieve task content based on taskId
function getTaskContent(taskId, kanbanData) {
  const taskContent = kanbanData.tasks?.[taskId];
  if (!taskContent) {
    return null;
  }
  return taskContent;
}

// Function to structure task data for display
function getTaskData(taskContent) {
  const taskData = {
    label: taskContent.label || "Keine Kategorie",
    fitLabelForCSS: (taskContent.label || "Keine Kategorie")
      .toLowerCase()
      .replace(/\s+/g, "-"),
    title: taskContent.title || "Ohne Titel",
    description: taskContent.description || "Keine Beschreibung",
    subtasks: taskContent.subtasks || {},
    totalSubtasks: taskContent.totalSubtasks || 0,
    completedSubtasks: taskContent.completedSubtasks || 0,
    progressPercentage: taskContent.subtaskProgress || 0,
    showProgress: taskContent.showProgress || false,
    priority: taskContent.priority || "keine-priorität",
    taskId: taskContent.taskId,
    createAt: taskContent.createdAt,
  };
  return taskData;
}

// Function to process a task and fetch relevant data
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

// Function to process task details and prepare it for display
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


