// This function is called when the page loads. It initializes the user name.
function onloadFunc() {
  getUserName();
}

// Event listener that waits for the DOM content to load and then checks user login and fetches kanban data
document.addEventListener("DOMContentLoaded", () => {
  const user = checkUserLogin(); // Check if the user is logged in
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/.json`; // Firebase URL
  fetchKanbanData(BASE_URL, user); // Fetch the kanban data for the user
});

// Checks if the user is logged in by verifying local storage. If not, redirects to login page
function checkUserLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "./log_in.html";
  }
  return user;
}

// Retrieves the logged-in user's name and displays the initials in the header
function getUserName() {
  const loggedInUser = checkUserLogin();
  if (loggedInUser) {
    let userName = loggedInUser.name;
    console.log("User name:", userName);
    getUserInitialForHeader(userName);
  }
}

// Extracts the first and last name to display the initials in the header
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

// Fetches kanban data from Firebase and processes it
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
      const statusHTMLMap = processAssignedStatuses(currentAssignedStatus, kanbanData);
      assignStatusHTMLToContainers(statusHTMLMap);
    } else {
      console.log("User has no assigned tasks or assignedTasks is not correctly formatted.");
    }
  } catch (error) {
    console.error("Error fetching Kanban data:", error);
  }
}

// Processes tasks for each status and generates HTML strings
function processAssignedStatuses(currentAssignedStatus, kanbanData) {
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
      statusHTMLMap[status] = processTasksByStatus(taskIds, status, kanbanData);
    }
  }
  return statusHTMLMap;
}

// Processes tasks for a specific status and returns the HTML string
function processTasksByStatus(taskIds, status, kanbanData) {
  let statusHTML = "";

  for (let taskId of taskIds) {
    const processedTask = processTasks(taskId, kanbanData);

    if (!processedTask) {
      console.error(`Task ${taskId} could not be processed.`);
      continue;
    }
    const taskHTML = taskCardTemplate(processedTask);
    statusHTML += taskHTML;
  }
  return statusHTML;
}

// Assigns generated HTML strings to their respective status containers
function assignStatusHTMLToContainers(statusHTMLMap) {
  document.getElementById("toDoCardsColumn").innerHTML = statusHTMLMap.toDo;
  document.getElementById("inProgressCardsColumn").innerHTML = statusHTMLMap.inProgress;
  document.getElementById("awaitFeedbackCardsColumn").innerHTML = statusHTMLMap.awaitingFeedback;
  document.getElementById("doneCardsColumn").innerHTML = statusHTMLMap.done;
}

// Processes each task, filling in missing fields and returning the complete task object
function processTasks(taskId, kanbanData) {
  const task = kanbanData.tasks[taskId];
  if (!task) {
    console.error(`Task with ID ${taskId} not found.`);
    return null;
  }

  task.taskId = taskId; 
  task.assignedUserName = kanbanData.users[task.assignedTo]?.name || "Unknown User";
  task.label = task.label || "No Category";
  task.priority = task.priority || "low";
  task.title = task.title || "No Title";
  task.description = task.description || "No Description";
  task.assignees = task.assignees || {};
  task.assigneesNames = getAssigneesNames(task.assignees, kanbanData); 
  return task;
}

// Retrieves the names of all assignees for a task
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
