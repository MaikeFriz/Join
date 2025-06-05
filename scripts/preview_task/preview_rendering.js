/**
 * Refreshes the board preview columns silently without user interaction.
 * Fetches the current Kanban data and updates the UI.
 */
async function refreshBoardSilent() {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  let data = getCurrentKanbanData(isGuest);
  let assignedTasks = getAssignedTasks(data, isGuest);

  if (!assignedTasks) return;

  const statusHTMLMap = await processAssignedStatuses(assignedTasks, data);
  assignStatusHTMLToContainers(statusHTMLMap);
  if (typeof loadNoTasksFunctions === "function") loadNoTasksFunctions();
}

/**
 * Returns the current Kanban data object for the guest or logged-in user.
 * @param {boolean} isGuest - Whether the current user is a guest.
 * @returns {Object} The Kanban data object.
 */
function getCurrentKanbanData(isGuest) {
  if (isGuest) {
    const data = JSON.parse(localStorage.getItem("guestKanbanData"));
    kanbanData = data;
    ensureTaskIdsInKanbanData();
    return data;
  }
  return kanbanData;
}

/**
 * Returns the assigned tasks object for the current user or guest.
 * @param {Object} data - The Kanban data object.
 * @param {boolean} isGuest - Whether the current user is a guest.
 * @returns {Object|null} The assigned tasks object or null if not found.
 */
function getAssignedTasks(data, isGuest) {
  if (!data || !data.users) return null;

  if (isGuest) {
    return getGuestAssignedTasks(data);
  } else {
    return getUserAssignedTasks(data);
  }
}

/**
 * Returns the assigned tasks object for the guest user.
 * @param {Object} data - The Kanban data object.
 * @returns {Object|null} The guest's assigned tasks or null if not found.
 */
function getGuestAssignedTasks(data) {
  if (!data.users.guest || !data.users.guest.assignedTasks) return null;
  return data.users.guest.assignedTasks;
}

/**
 * Returns the assigned tasks object for the logged-in user.
 * @param {Object} data - The Kanban data object.
 * @returns {Object|null} The user's assigned tasks or null if not found.
 */
function getUserAssignedTasks(data) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (
    !loggedInUser ||
    !data.users[loggedInUser.userId] ||
    !data.users[loggedInUser.userId].assignedTasks
  ) {
    return null;
  }
  return data.users[loggedInUser.userId].assignedTasks;
}
