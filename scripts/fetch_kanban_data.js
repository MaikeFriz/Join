let kanbanData = {};
const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;

/**
 * Fetches Kanban data for logged-in users from Firebase.
 * @param {string} BASE_URL - The base URL for the Kanban data.
 * @returns {Promise<Object|null>} The Kanban data object or null if an error occurs.
 */
async function fetchKanbanData(BASE_URL) {
  try {
    let response = await fetch(BASE_URL + ".json");
    kanbanData = await response.json();
    return kanbanData;
  } catch (error) {
    console.error("Error fetching Kanban data:", error);
    return null;
  }
}

/**
 * Fetches guest user data from Firebase.
 * @returns {Promise<Object|null>} The guest user data or null if not found.
 */
async function fetchGuestData() {
  const response = await fetch(`${BASE_URL}users/guest.json`);
  const guestData = await response.json();
  if (!guestData) return null;
  return guestData;
}

/**
 * Extracts task IDs from guest data.
 * @param {Object} guestData - The guest user data.
 * @returns {Array<string>} Array of task IDs.
 */
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

/**
 * Fetches tasks based on the provided task IDs.
 * @param {Array<string>} taskIds - Array of task IDs.
 * @returns {Promise<Object>} Object containing tasks keyed by their IDs.
 */
async function fetchTasks(taskIds) {
  const tasksArray = [];
  for (let taskIndex = 0; taskIndex < taskIds.length; taskIndex++) {
    const taskId = taskIds[taskIndex];
    const response = await fetch(`${BASE_URL}tasks/${taskId}.json`);
    const taskData = await response.json();
    tasksArray.push(taskData);
  }
  const tasksObject = {};
  for (let taskIndex = 0; taskIds.length > taskIndex; taskIndex++) {
    tasksObject[taskIds[taskIndex]] = tasksArray[taskIndex];
  }
  return tasksObject;
}

/**
 * Extracts subtask IDs from the provided tasks.
 * @param {Array<Object>} tasksArray - Array of task objects.
 * @returns {Array<string>} Array of subtask IDs.
 */
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

/**
 * Fetches subtasks based on the provided subtask IDs.
 * @param {Array<string>} subtaskIds - Array of subtask IDs.
 * @returns {Promise<Object>} Object containing subtasks keyed by their IDs.
 */
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

/**
 * Fetches all users' contact data (name, email, phone).
 * @returns {Promise<Object>} Object containing user contact data.
 */
async function fetchAllUserContactData() {
  const response = await fetch(`${BASE_URL}users.json`);
  const users = await response.json();
  if (!users) return {};
  const contactData = {};
  for (const userId in users) {
    if (userId === "guest") continue;
    contactData[userId] = { name: users[userId].name };
  }
  return contactData;
}

/**
 * Saves structured guest data, tasks, and subtasks to LocalStorage.
 * @param {Object} guestData - The guest user data.
 * @param {Object} tasksData - The tasks data.
 * @param {Object} subtasksData - The subtasks data.
 * @param {Object} allUserContactData - All user contact data.
 */
function saveGuestDataToLocalStorage(
  guestData, tasksData, subtasksData, allUserContactData
) {
  const structuredData = {
    users: {
      guest: guestData,
      ...allUserContactData,
    },
    tasks: tasksData,
    subtasks: subtasksData,
  };
  localStorage.setItem("guestKanbanData", JSON.stringify(structuredData));
}

/**
 * Fetches and processes Kanban data for guest users.
 * @returns {Promise<Object|null>} The guest data or null if an error occurs.
 */
async function fetchGuestKanbanData() {
  try {
    const guestData = await fetchGuestData();
    if (!guestData) return null;
    const taskIds = extractTaskIds(guestData);
    const tasksData = await fetchTasks(taskIds);
    const subtaskIds = extractSubtaskIds(Object.values(tasksData));
    const subtasksData = await fetchSubtasks(subtaskIds);
    const allUserContactData = await fetchAllUserContactData();
    saveGuestDataToLocalStorage(guestData, tasksData, subtasksData, allUserContactData);
    return guestData;
  } catch (error) {
    console.error("Error fetching Guest Kanban data:", error);
    return null;
  }
}

/**
 * Retrieves the task data for editing and generates the corresponding HTML.
 * @param {string} taskId - The ID of the task to edit.
 * @returns {string} The HTML for editing the task.
 */
function getEditTaskData(taskId) {
  let taskContent = getTaskContent(taskId, kanbanData);
  if (!taskContent) {
    return `<div>Error: Task not found</div>`;
  }
  const editTaskHTML = renderEditTask(taskContent, taskId);
  return editTaskHTML;
}

/**
 * Fetches Kanban data for guest users and stores it in LocalStorage.
 * @returns {Promise<Object>} The guest Kanban data object.
 */
async function getKanbanData() {
  try {
    if (localStorage.getItem("isGuest") === "true") {
      kanbanData = await getGuestKanbanData();
    } else {
      kanbanData = await fetchKanbanData(BASE_URL);
    }
    if (!kanbanData.subtasks) kanbanData.subtasks = {};
    if (!kanbanData || Object.keys(kanbanData).length === 0) {
      console.error("Kanban data could not be loaded or is empty.");
    }
  } catch (error) {
    console.error("Error loading Kanban data:", error);
  }
}

/**
 * Fetches guest Kanban data from LocalStorage or Firebase.
 * @returns {Promise<Object>} The guest Kanban data object.
 */
async function getGuestKanbanData() {
  let guestKanbanData = localStorage.getItem("guestKanbanData");
  if (!guestKanbanData) {
    await fetchGuestKanbanData();
    guestKanbanData = localStorage.getItem("guestKanbanData");
  }
  return JSON.parse(guestKanbanData);
}

/**
 * Executes the main logic when the page is loaded.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await getKanbanData();
  const guest = JSON.parse(localStorage.getItem("isGuest"));
  const user = guest ? "guest" : checkUserLogin();

  if (kanbanData?.users) {
    processKanbanData(kanbanData, user);
  } else {
    console.error(
      "No users found in Kanban Data for " +
        (guest ? "Guest" : "Logged-in User") +
        "."
    );
  }
});

/**
 * Processes the Kanban data and assigns it to the user.
 * @param {Object} data - The Kanban data object.
 * @param {Object|string} user - The user object or "guest".
 */
function processKanbanData(data, user) {
  if (!data) return;
  if (!user && user !== "guest") return;
  const userId = user === "guest" ? "guest" : user.userId;
  if (!data.users?.[userId]) return;
  const currentAssignedStatus = data.users[userId].assignedTasks;
  if (isValidAssignedTasks(currentAssignedStatus)) {
    processAssignedStatuses(currentAssignedStatus, data).then(
      (statusHTMLMap) => {
        assignStatusHTMLToContainers(statusHTMLMap);
        loadNoTasksFunctions();
      }
    );
  }
}

/**
 * Checks if the `assignedTasks` object is valid.
 * @param {Object} assignedTasks - The assignedTasks object.
 * @returns {boolean} True if valid, otherwise false.
 */
function isValidAssignedTasks(assignedTasks) {
  return assignedTasks && typeof assignedTasks === "object";
}
