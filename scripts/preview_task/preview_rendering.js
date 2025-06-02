// Updates the board preview columns in the background using the latest kanban data or guest data.
async function refreshBoardSilent() {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  let data = kanbanData;
  let assignedTasks;
  if (isGuest) {
    // Guest user: use guestKanbanData from localStorage
    data = JSON.parse(localStorage.getItem("guestKanbanData"));
    if (
      !data ||
      !data.users ||
      !data.users.guest ||
      !data.users.guest.assignedTasks
    ) {
      return;
    }
    assignedTasks = data.users.guest.assignedTasks;
  } else {
    // Registered user: use loggedInUser from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (
      !data ||
      !data.users ||
      !loggedInUser ||
      !data.users[loggedInUser.userId] ||
      !data.users[loggedInUser.userId].assignedTasks
    ) {
      return;
    }
    assignedTasks = data.users[loggedInUser.userId].assignedTasks;
  }
  const statusHTMLMap = await processAssignedStatuses(assignedTasks, data);
  assignStatusHTMLToContainers(statusHTMLMap);
  if (typeof loadNoTasksFunctions === "function") loadNoTasksFunctions();
}
