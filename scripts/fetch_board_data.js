
// Event listener to check user login and fetch kanban data once the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    const user = checkUserLogin();
    const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/.json`;
    fetchKanbanData(BASE_URL, user);
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
  }