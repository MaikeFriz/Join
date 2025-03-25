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
    window.location.href = "./log_in.html"; // Redirect to login if user is not logged in
  }
  return user;
}

// Retrieves the logged-in user's name and displays the initials in the header
function getUserName() {
  const loggedInUser = checkUserLogin(); // Get the logged-in user
  if (loggedInUser) {
    let userName = loggedInUser.name;
    console.log("User name:", userName);
    getUserInitialForHeader(userName); // Get initials for the header
  }
}

// Extracts the first and last name to display the initials in the header
function getUserInitialForHeader(userName) {
  let [firstName, lastName] = userName.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase(); // First letter of first name
  let lastNameFirstLetter = lastName.charAt(0).toUpperCase(); // First letter of last name
  let initials = firstLetter + lastNameFirstLetter;
  let headerInitials = document.getElementById("user-initials-header");

  headerInitials.innerHTML = `
    <div>${initials}</div>
  `;
}

// Fetches kanban data from Firebase and processes it
async function fetchKanbanData(baseUrl, user) {
  try {
    let response = await fetch(baseUrl); // Fetch data from Firebase
    let kanbanData = await response.json(); // Parse JSON response

    console.log("Kanban data from Firebase:", kanbanData);

    if (!kanbanData.users[user.userId]) {
      console.error("User not found or invalid userId.");
      return;
    }

    const currentAssignedStatus = kanbanData.users[user.userId].assignedTasks; // Get assigned tasks for the user
    console.log("Current assigned status:", currentAssignedStatus);

    if (currentAssignedStatus && typeof currentAssignedStatus === "object") {
      processAssignedStatuses(currentAssignedStatus, kanbanData); // Process the assigned tasks by status
    } else {
      console.log("User has no assigned tasks or assignedTasks is not correctly formatted.");
    }
  } catch (error) {
    console.error("Error fetching Kanban data:", error);
  }
}

// Processes the assigned tasks by each status (ToDo, In Progress, Awaiting Feedback, Done)
function processAssignedStatuses(currentAssignedStatus, kanbanData) {
  let toDoCardsHTML = "";
  let inProgressCardsHTML = "";
  let awaitingFeedbackCardsHTML = "";
  let doneCardsHTML = "";

  // Iterate through the statuses and their assigned tasks
  for (let status in currentAssignedStatus) {
    if (currentAssignedStatus.hasOwnProperty(status)) {
      console.log(`Status: ${status}`);
      console.log(`Tasks for status ${status}:`, currentAssignedStatus[status]);

      const tasks = currentAssignedStatus[status];
      const taskIds = Object.keys(tasks);

      // Iterate through each task ID
      for (let taskId of taskIds) {
        console.log("Task ID before processing:", taskId);

        // Process the task to get full data using processTasks
        const processedTask = processTasks(taskId, kanbanData);

        if (!processedTask) {
          console.error(`Task ${taskId} could not be processed.`);
          continue;
        }

        console.log("Task after processing:", processedTask);

        // Use a common template for all statuses
        const taskHTML = taskCardTemplate(processedTask); // A template for all statuses

        // Create HTML strings for each status
        if (status === "toDo") {
          toDoCardsHTML += taskHTML;
        } else if (status === "inProgress") {
          inProgressCardsHTML += taskHTML;
        } else if (status === "awaitingFeedback") {
          awaitingFeedbackCardsHTML += taskHTML;
        } else if (status === "done") {
          doneCardsHTML += taskHTML;
        }
      }
    }
  }

  // Add the generated HTML to the corresponding containers
  addHTMLToTaskContainers(
    toDoCardsHTML,
    inProgressCardsHTML,
    awaitingFeedbackCardsHTML,
    doneCardsHTML
  );
}

// Adds the generated HTML for each status to the respective containers
function addHTMLToTaskContainers(
  toDoCardsHTML,
  inProgressCardsHTML,
  awaitingFeedbackCardsHTML,
  doneCardsHTML
) {
  document.getElementById("toDoCard").innerHTML = toDoCardsHTML;
  document.getElementById("inProgressCard").innerHTML = inProgressCardsHTML;
  document.getElementById("awaitFeedbackCard").innerHTML = awaitingFeedbackCardsHTML;
  document.getElementById("doneCard").innerHTML = doneCardsHTML;
}

// Processes each task, filling in missing fields and returning the complete task object
function processTasks(taskId, kanbanData) {
  const task = kanbanData.tasks[taskId];
  if (!task) {
    console.error(`Task with ID ${taskId} not found.`);
    return null;
  }

  // Fill missing fields with default values
  task.taskId = taskId; // Explicitly add task ID
  task.assignedUserName = kanbanData.users[task.assignedTo]?.name || "Unknown User";
  task.label = task.label || "No Category";
  task.priority = task.priority || "low";
  task.title = task.title || "No Title";
  task.description = task.description || "No Description";
  task.assignees = task.assignees || {}; // Ensure assignees is an object
  task.assigneesNames = getAssigneesNames(task.assignees, kanbanData); // Get assignee names

  console.log("Task after processing:", task);
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
