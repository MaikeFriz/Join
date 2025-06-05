// Main entry point to refresh the board preview columns
async function refreshBoardSilent() {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  let data = getCurrentKanbanData(isGuest);
  let assignedTasks = getAssignedTasks(data, isGuest);

  if (!assignedTasks) return;

  const statusHTMLMap = await processAssignedStatuses(assignedTasks, data);
  assignStatusHTMLToContainers(statusHTMLMap);
  if (typeof loadNoTasksFunctions === "function") loadNoTasksFunctions();
}


// Returns the current kanban data object (for guest or user)
function getCurrentKanbanData(isGuest) {
  if (isGuest) {
    const data = JSON.parse(localStorage.getItem("guestKanbanData"));
    kanbanData = data;
    ensureTaskIdsInKanbanData();
    return data;
  }
  return kanbanData;
}


// Returns the assigned tasks object for the current user or guest
function getAssignedTasks(data, isGuest) {
  if (!data || !data.users) return null;

  if (isGuest) {
    return getGuestAssignedTasks(data);
  } else {
    return getUserAssignedTasks(data);
  }
}


// Returns the assigned tasks object for the guest user
function getGuestAssignedTasks(data) {
  if (!data.users.guest || !data.users.guest.assignedTasks) return null;
  return data.users.guest.assignedTasks;
}


// Returns the assigned tasks object for the logged-in user
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
