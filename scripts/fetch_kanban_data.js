let kanbanData = {}; 
const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;

// Loads the Kanban data for logged-in users from Firebase
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

// Loads the Kanban data for guest users from LocalStorage
async function fetchGuestKanbanData() {
  try {
    return JSON.parse(localStorage.getItem("guestKanbanData"));
  } catch (error) {
    console.error("Error fetching Guest Kanban data:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const guest = JSON.parse(localStorage.getItem("isGuest"));

  if (guest) {
    kanbanData = await fetchGuestKanbanData();
    processKanbanData(kanbanData, "guest");
  } else {
    const user = checkUserLogin();
    kanbanData = await fetchKanbanData(BASE_URL);
    processKanbanData(kanbanData, user);
  }
});

// Checks if the data is valid and processes it
function processKanbanData(data, user) {
  if (!data) return;

  const userId = user === "guest" ? "user" : user.userId;

  if (!data.users?.[userId]) {
    console.error("User not found or invalid userId.");
    return;
  }

  const currentAssignedStatus = data.users[userId].assignedTasks;

  if (isValidAssignedTasks(currentAssignedStatus)) {
    processAssignedStatuses(currentAssignedStatus, data).then(statusHTMLMap => {
      assignStatusHTMLToContainers(statusHTMLMap);
      loadNoTasksFunctions();
    });
  }
}

// Checks if the `assignedTasks` are valid
function isValidAssignedTasks(assignedTasks) {
  return assignedTasks && typeof assignedTasks === "object";
}
