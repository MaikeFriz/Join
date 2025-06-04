// Fetches task data from the database
async function fetchTaskData(taskId) {
  const taskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`);
  if (!taskResponse.ok) {
    throw new Error("Task could not be fetched.");
  }
  return await taskResponse.json();
}

function showLoadingSpinner() {
  document.getElementById("loading_spinner_delete_task").style.display = "flex";
}
function hideLoadingSpinner() {
  document.getElementById("loading_spinner_delete_task").style.display = "none";
}

// Deletes a task and its related data, then updates the DOM and navigates back to the board
async function deleteTask(taskId) {
  showLoadingSpinner();
  try {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      await deleteTaskForGuest(taskId);
    } else {
      await deleteTaskForUser(taskId);
      removeUserTaskFromDOM(taskId); // Instantly remove from DOM for user
      // Fetch latest kanban data for logged-in users after deletion
      if (typeof getKanbanData === "function") {
        await getKanbanData();
      }
    }
    await waitForDatabaseOperations(taskId);
    closeConfirmDialog();
    await fromFocusedTaskToBoard();
    // Ensure empty-board-info is shown if no tasks remain (no reload needed)
    if (typeof loadNoTasksFunctions === "function") {
      loadNoTasksFunctions();
    }
  } catch (error) {
  } finally {
    hideLoadingSpinner();
  }
}

// Deletes a task and all related user data from the database
async function deleteTaskForUser(taskId) {
  await waitForDatabaseOperations(taskId);
  await deleteUserTaskAssignments(taskId);
  await deleteUserTaskSubtasks(taskId);
  await deleteTaskFromCategoriesForUser(taskId);
  await deleteTaskFromDatabase(taskId);
}

// Removes the task from the user's assigned tasks
async function deleteUserTaskAssignments(taskId) {
  const category = await getTaskCategoryForUser(taskId);
  if (category) {
    await deleteTaskFromUserAssignedTasks(taskId, category);
  }
  await deleteTaskFromAssigneesForUser(taskId);
}

// Deletes all subtasks related to a user task from the database
async function deleteUserTaskSubtasks(taskId) {
  const taskData = await fetchTaskData(taskId);
  if (taskData && taskData.subtasks) {
    await deleteSubtasks(taskData.subtasks);
  }
}

// Removes a user task from all categories in the database
async function deleteTaskFromCategoriesForUser(taskId) {
  const response = await fetch(`${BASE_URL}categories.json`);
  const categories = await response.json();
  for (const categoryId in categories) {
    const tasks = categories[categoryId].tasks || [];
    if (tasks.includes(taskId)) {
      const url = `${BASE_URL}categories/${categoryId}/tasks/${taskId}.json`;
      await fetch(url, { method: "DELETE" });
    }
  }
}

// Removes a user task from all assignees in the database
async function deleteTaskFromAssigneesForUser(taskId) {
  const taskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`);
  if (!taskResponse.ok) {
    throw new Error("Task could not be fetched.");
  }

  const taskData = await taskResponse.json();
  if (!taskData || !taskData.assignees) {
    return;
  }

  for (const userId in taskData.assignees) {
    if (taskData.assignees[userId]) {
      const url = `${BASE_URL}users/${userId}/assignedTasks/${taskId}.json`;
      await fetch(url, { method: "DELETE" });
    }
  }
}

// Deletes a task from the database
async function deleteTaskFromDatabase(taskId) {
  const deleteTaskResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`, {
    method: "DELETE",
  });
  if (!deleteTaskResponse.ok) {
    throw new Error("Error deleting task.");
  }
}

// Waits for all pending database operations for a task to complete
async function waitForDatabaseOperations(taskId) {
  try {
    const response = await fetch(`${BASE_URL}tasks/${taskId}/status.json`);
    if (!response.ok) {
      throw new Error(`Error checking database status for task ${taskId}.`);
    }

    const status = await response.json();

    if (status && status.pendingOperations > 0) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(waitForDatabaseOperations(taskId)), 1000)
      );
    }
  } catch (error) {
    throw error;
  }
}

// Removes a task from the logged-in user's assigned tasks in a specific category
async function deleteTaskFromUserAssignedTasks(taskId, category) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser || !loggedInUser.userId) {
    throw new Error("No logged-in user found.");
  }

  const url = `${BASE_URL}users/${loggedInUser.userId}/assignedTasks/${category}/${taskId}.json`;

  try {
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(
        `Failed to delete task ${taskId} from user ${loggedInUser.userId} in category ${category}.`
      );
    }
  } catch (error) {}
}

// Loads the assignedTasks of the user
async function fetchAssignedTasksForUser(userId) {
  const url = `${BASE_URL}users/${userId}/assignedTasks.json`;
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch assigned tasks for user ${userId}.`);
  return await response.json();
}

// Finds the category of a task in the assignedTasks
function findCategoryForTask(assignedTasks, taskId) {
  const categoryNames = Object.keys(assignedTasks);
  for (
    let categoryIndex = 0;
    categoryIndex < categoryNames.length;
    categoryIndex++
  ) {
    const categoryName = categoryNames[categoryIndex];
    if (assignedTasks[categoryName] && assignedTasks[categoryName][taskId]) {
      return categoryName;
    }
  }
  return null;
}

// Gets the category of a task for the logged-in user
async function getTaskCategoryForUser(taskId) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser?.userId) throw new Error("No logged-in user found.");
  try {
    const assignedTasks = await fetchAssignedTasksForUser(loggedInUser.userId);
    return findCategoryForTask(assignedTasks, taskId);
  } catch {
    return null;
  }
}

// Deletes all subtasks from the database
async function deleteSubtasks(subtasks) {
  const subtaskIds = Object.keys(subtasks);
  for (let subtaskIndex = 0; subtaskIndex < subtaskIds.length; subtaskIndex++) {
    const subtaskId = subtaskIds[subtaskIndex];
    try {
      const deleteSubtaskResponse = await fetch(
        `${BASE_URL}subtasks/${subtaskId}.json`,
        { method: "DELETE" }
      );
      if (!deleteSubtaskResponse.ok) {
        throw new Error(`Error deleting subtask ${subtaskId}.`);
      }
    } catch (error) {}
  }
}

// Instantly removes the task from the board and focused overlay in the DOM for user
function removeUserTaskFromDOM(taskId) {
  // Remove from board
  const boardTask = document.querySelector(`[data-task-id='${taskId}']`);
  if (boardTask) boardTask.remove();

  // Close focused overlay if open
  const focusedContent = document.getElementById("focusedTask");
  if (focusedContent && !focusedContent.classList.contains("d-none")) {
    focusedContent.classList.add("d-none");
    focusedContent.innerHTML = "";
    document.body.style.overflow = "";
  }
}
