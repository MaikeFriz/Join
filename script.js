// Function to initialize the user name when the page loads
function onloadFunc() {
  getUserName();
}

// Event listener to check user login and fetch kanban data once the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  const user = checkUserLogin();
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/.json`;
  fetchKanbanData(BASE_URL, user);
});

// Function to check if the user is logged in and redirect to login page if not
function checkUserLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "./log_in.html";
  }
  return user;
}

// Function to retrieve the logged-in user's name and display initials in the header
function getUserName() {
  const loggedInUser = checkUserLogin();
  if (loggedInUser) {
    let userName = loggedInUser.name;
    console.log("User name:", userName);
    getUserInitialForHeader(userName);
  }
}

// Function to extract initials from the user's name and display them in the header
function getUserInitialForHeader(userName) {
  let [firstName, lastName] = userName.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName.charAt(0).toUpperCase();
  let initials = firstLetter + lastNameFirstLetter;
  let headerInitials = document.getElementById("user-initials-header");

  headerInitials.innerHTML = `
    <div>${initials}</div>
  `;
}

// Function to fetch kanban data from Firebase and process it
async function fetchKanbanData(baseUrl, user) {
  try {
    let response = await fetch(baseUrl);
    let kanbanData = await response.json();

    console.log("Kanban data from Firebase:", kanbanData);

    if (!kanbanData.users[user.userId]) {
      console.error("User not found or invalid userId.");
      return;
    }

    const currentAssignedStatus = kanbanData.users[user.userId].assignedTasks;
    console.log("Current assigned status:", currentAssignedStatus);

    if (currentAssignedStatus && typeof currentAssignedStatus === "object") {
      const statusHTMLMap = await processAssignedStatuses(currentAssignedStatus, kanbanData);
      assignStatusHTMLToContainers(statusHTMLMap);
    } else {
      console.log("User has no assigned tasks or assignedTasks is not correctly formatted.");
    }
  } catch (error) {
    console.error("Error fetching Kanban data:", error);
  }
}

// Function to process tasks for each status and generate HTML strings
async function processAssignedStatuses(currentAssignedStatus, kanbanData) {
  const statusHTMLMap = {
    toDo: "",
    inProgress: "",
    awaitingFeedback: "",
    done: ""
  };

  for (let status in currentAssignedStatus) {
    if (currentAssignedStatus.hasOwnProperty(status)) {
      const tasks = currentAssignedStatus[status];
      const taskIds = Object.keys(tasks);
      statusHTMLMap[status] = await processTasksByStatus(taskIds, status, kanbanData);
    }
  }
  return statusHTMLMap;
}

// Function to process tasks for a specific status and return HTML string
async function processTasksByStatus(taskIds, status, kanbanData) {
  let statusHTML = "";

  for (let taskId of taskIds) {
    const processedTask = await processTasks(taskId, kanbanData);

    if (!processedTask) {
      console.error(`Task ${taskId} konnte nicht verarbeitet werden.`);
      continue;
    }

    const taskHTML = taskCardTemplate(processedTask);
    statusHTML += taskHTML;
  }
  return statusHTML;
}

// Function to assign the generated HTML strings to their respective status containers
function assignStatusHTMLToContainers(statusHTMLMap) {
  document.getElementById("toDoCardsColumn").innerHTML = statusHTMLMap.toDo;
  document.getElementById("inProgressCardsColumn").innerHTML = statusHTMLMap.inProgress;
  document.getElementById("awaitFeedbackCardsColumn").innerHTML = statusHTMLMap.awaitingFeedback;
  document.getElementById("doneCardsColumn").innerHTML = statusHTMLMap.done;
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

  console.log("Verarbeiteter Task:", processedTask);

  return processedTask;
}

// Function to retrieve task content based on taskId
function getTaskContent(taskId, kanbanData) {
  const taskContent = kanbanData.tasks?.[taskId];
  if (!taskContent) {
    console.error(`Task mit der ID ${taskId} existiert nicht.`);
    return null;
  }
  return taskContent;
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

// Function to retrieve the names of all assignees for a task
function getAssigneesNames(assignees, kanbanData) {
  let assigneesNames = [];
  for (let assigneeId in assignees) {
    if (assignees.hasOwnProperty(assigneeId)) {
      let userName =
        kanbanData.users[assigneeId]?.name || "Unknown User";
      assigneesNames.push(userName);
    }
  }
  return assigneesNames;
}
