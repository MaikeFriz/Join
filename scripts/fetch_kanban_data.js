// Global variable to store Kanban data
let kanbanData = {}; 

// Base URL for the Firebase database
const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;

// Fetches Kanban data for logged-in users from Firebase
async function fetchKanbanData(BASE_URL) {
  try {
    let response = await fetch(BASE_URL + (".json"));
    kanbanData = await response.json();
    return kanbanData;
  } catch (error) {
    console.error("Error fetching Kanban data:", error);
    return null;
  }
}

// Fetches guest user data from Firebase
async function fetchGuestData() {
  const response = await fetch(`${BASE_URL}users/guest.json`);
  const guestData = await response.json();
  if (!guestData) return null;
  return guestData;
}

// Extracts task IDs from guest data
function extractTaskIds(guestData) {
  const taskIds = [];
  if (guestData.assignedTasks) {
    const categories = Object.values(guestData.assignedTasks);
    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      const category = categories[categoryIndex];
      for (const taskId in category) {
        if (category[taskId]) {
          taskIds.push(taskId);
        }
      }
    }
  }
  return taskIds;
}

// Fetches tasks based on the provided task IDs
async function fetchTasks(taskIds) {
  const tasksArray = [];
  for (let taskIndex = 0; taskIndex < taskIds.length; taskIndex++) {
    const taskId = taskIds[taskIndex];
    const response = await fetch(`${BASE_URL}tasks/${taskId}.json`);
    const taskData = await response.json();
    tasksArray.push(taskData);
  }
  const tasksObject = {};
  for (let taskIndex = 0; taskIndex < taskIds.length; taskIndex++) {
    tasksObject[taskIds[taskIndex]] = tasksArray[taskIndex];
  }
  return tasksObject;
}

// Extracts subtask IDs from the provided tasks
function extractSubtaskIds(tasksArray) {
  const subtaskIds = [];
  for (let taskIndex = 0; taskIndex < tasksArray.length; taskIndex++) {
    const task = tasksArray[taskIndex];
    if (task?.subtasks) {
      for (const subtaskId in task.subtasks) {
        subtaskIds.push(subtaskId);
      }
    }
  }
  return subtaskIds;
}

// Fetches subtasks based on the provided subtask IDs
async function fetchSubtasks(subtaskIds) {
  const subtasksArray = [];
  for (let subtaskIndex = 0; subtaskIndex < subtaskIds.length; subtaskIndex++) {
    const subtaskId = subtaskIds[subtaskIndex];
    const response = await fetch(`${BASE_URL}subtasks/${subtaskId}.json`);
    const subtaskData = await response.json();
    subtasksArray.push(subtaskData);
  }
  const subtasksObject = {};
  for (let subtaskIndex = 0; subtaskIndex < subtaskIds.length; subtaskIndex++) {
    subtasksObject[subtaskIds[subtaskIndex]] = subtasksArray[subtaskIndex];
  }
  return subtasksObject;
}

// Saves structured guest data, tasks, and subtasks to LocalStorage
function saveGuestDataToLocalStorage(guestData, tasksData, subtasksData) {
  const structuredData = {
    users: {
      guest: guestData
    },
    tasks: tasksData,
    subtasks: subtasksData
  };
  localStorage.setItem("guestKanbanData", JSON.stringify(structuredData));
}

// Fetches and processes Kanban data for guest users
async function fetchGuestKanbanData() {
  try {
    const guestData = await fetchGuestData();
    if (!guestData) return null;
    const taskIds = extractTaskIds(guestData);
    const tasksData = await fetchTasks(taskIds);
    const subtaskIds = extractSubtaskIds(Object.values(tasksData));
    const subtasksData = await fetchSubtasks(subtaskIds);
    saveGuestDataToLocalStorage(guestData, tasksData, subtasksData);
    return guestData;
  } catch (error) {
    console.error("Error fetching Guest Kanban data:", error);
    return null;
  }
}

// Fetches guest Kanban data from LocalStorage
async function fetchGuestKanbanDataFromLocalStorage() {
  const guestKanbanData = localStorage.getItem("guestKanbanData");
  if (!guestKanbanData) return null;
  return JSON.parse(guestKanbanData);
}

// Executes the main logic when the page is loaded
document.addEventListener("DOMContentLoaded", async () => {
  const guest = JSON.parse(localStorage.getItem("isGuest"));
  if (guest) {
    kanbanData = await fetchGuestKanbanDataFromLocalStorage();
    processKanbanData(kanbanData, "guest");
  } else {
    const user = checkUserLogin();
    kanbanData = await fetchKanbanData(BASE_URL);
    processKanbanData(kanbanData, user);
  }
});

// Processes the Kanban data and assigns it to the user
function processKanbanData(data, user) {
  if (!data) return;
  const userId = user === "guest" ? "guest" : user.userId;
  if (!data.users?.[userId]) return;
  const currentAssignedStatus = data.users[userId].assignedTasks;
  if (isValidAssignedTasks(currentAssignedStatus)) {
    processAssignedStatuses(currentAssignedStatus, data).then(statusHTMLMap => {
      assignStatusHTMLToContainers(statusHTMLMap);
      loadNoTasksFunctions();
    });
  }
}

// Checks if the `assignedTasks` object is valid
function isValidAssignedTasks(assignedTasks) {
  return assignedTasks && typeof assignedTasks === "object";
}
