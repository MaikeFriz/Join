
// Updates the board preview columns in the background using the latest kanban data or guest data.
async function refreshBoardSilent() {
  let data = kanbanData;
  if (!data || !data.users || !data.users.guest || !data.users.guest.assignedTasks) {
    data = JSON.parse(localStorage.getItem("guestKanbanData"));
  }
  if (!data || !data.users || !data.users.guest || !data.users.guest.assignedTasks) {
    return;
  }
  let assignedTasks = data.users.guest.assignedTasks;
  const statusHTMLMap = await processAssignedStatuses(assignedTasks, data);
  assignStatusHTMLToContainers(statusHTMLMap);
  if (typeof loadNoTasksFunctions === "function") loadNoTasksFunctions();
}