
// Event listener to check user login and fetch kanban data once the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  const guest = JSON.parse(localStorage.getItem("isGuest"));
  if (guest)
  {
    fetchGuestKanbanData(guest);
  }
  else
  {
    const user = checkUserLogin();
    const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/.json`;
      fetchKanbanData(BASE_URL, user);
  }
});

// Function to fetch kanban data from Firebase and process it
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
      const statusHTMLMap = await processAssignedStatuses(currentAssignedStatus, kanbanData);
      assignStatusHTMLToContainers(statusHTMLMap);
    } else {
      console.log("User has no assigned tasks or assignedTasks is not correctly formatted.");
    }
  } catch (error) {
    console.error("Error fetching Kanban data:", error);
  }
  loadNoTasksFunctions();
}



function isValidAssignedTasks(assignedTasks) {
  return assignedTasks && typeof assignedTasks === "object";
}

async function fetchGuestKanbanData(guest) {
  try {
    const guestData = JSON.parse(localStorage.getItem("guestKanbanData"));

    console.log("Guest Kanban Data:", guestData);

    const currentAssignedStatus = guestData.users.user.assignedTasks;

    if (isValidAssignedTasks(currentAssignedStatus)) {
      const statusHTMLMap = await processAssignedStatuses(currentAssignedStatus, guestData);
      assignStatusHTMLToContainers(statusHTMLMap);
    } else {
      console.log("Guest user has no assigned tasks or assignedTasks is not correctly formatted.");
    }
  } catch (error) {
    console.error("Error fetching Guest Kanban data:", error);
  }
  loadNoTasksFunctions();
}

