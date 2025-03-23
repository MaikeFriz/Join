function onloadFunc() {
  getUserName();
}

document.addEventListener("DOMContentLoaded", () => {
  const user = checkUserLogin();
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/.json`;
  fetchKanbanData(BASE_URL, user);
});

function checkUserLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "./log_in.html";
  }
  return user;
}

function getUserName() {
  const loggedInUser = checkUserLogin();
  if (loggedInUser) {
    let userName = loggedInUser.name;
    console.log("Benutzername:", userName);
    getUserInitialForHeader(userName);
  }
}

function getUserInitialForHeader(userName) {
  let [firstName, lastName] = userName.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName.charAt(0).toUpperCase();
  let initials = firstLetter + lastNameFirstLetter;
  let headerInitials = document.getElementById("user-initials-header");

  headerInitials.innerHTML =  `
    <div>${initials}</div>
  `;
}

async function fetchKanbanData(baseUrl, user) {
  try {
    let response = await fetch(baseUrl);
    let kanbanData = await response.json();

    console.log("Kanban-Daten aus Firebase:", kanbanData);

    if (!kanbanData.users[user.userId]) {
      console.error("Benutzer nicht gefunden oder ungültige userId.");
      return;
    }

    const currentAssignedStatus = kanbanData.users[user.userId].assignedTasks;
    console.log("Aktueller zugewiesener Status:", currentAssignedStatus);

    if (currentAssignedStatus && typeof currentAssignedStatus === 'object') {
      processAssignedStatuses(currentAssignedStatus, kanbanData);
    } else {
      console.log("Der Benutzer hat keine zugewiesenen Aufgaben oder assignedTasks ist nicht korrekt.");
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Kanban-Daten:", error);
  }
}

function processAssignedStatuses(currentAssignedStatus, kanbanData) {
  let toDoCardsHTML = "";
  let inProgressCardsHTML = "";
  let awaitingFeedbackCardsHTML = "";
  let doneCardsHTML = "";

  // Iteration über die Status und deren zugewiesene Aufgaben
  for (let status in currentAssignedStatus) {
    if (currentAssignedStatus.hasOwnProperty(status)) {
      console.log(`Status: ${status}`);
      console.log(`Aufgaben für Status ${status}:`, currentAssignedStatus[status]);

      const tasks = currentAssignedStatus[status];
      const taskIds = Object.keys(tasks);

      for (let taskId of taskIds) {
        console.log("Task-ID vor Verarbeitung:", taskId);

        // Verarbeite die Aufgabe mit `processTasks`, um vollständige Daten zu erhalten
        const processedTask = processTasks(taskId, kanbanData);

        if (!processedTask) {
          console.error(`Task ${taskId} konnte nicht verarbeitet werden.`);
          continue;
        }

        console.log("Task nach Verarbeitung:", processedTask);

        // Passende HTML-Strings basierend auf dem Status erstellen
        if (status === "toDo") {
          toDoCardsHTML += toDoCardTemplate(processedTask, kanbanData);
        } else if (status === "inProgress") {
          inProgressCardsHTML += inProgressCardTemplate(processedTask, kanbanData);
        } else if (status === "awaitingFeedback") {
          awaitingFeedbackCardsHTML += awaitingFeedbackCardTemplate(processedTask, kanbanData);
        } else if (status === "done") {
          doneCardsHTML += doneCardTemplate(processedTask, kanbanData);
        }
      }
    }
  }

  addHTMLToTaskContainers(toDoCardsHTML, inProgressCardsHTML, awaitingFeedbackCardsHTML, doneCardsHTML);
}

function processTasks(taskId, kanbanData) {
  const task = kanbanData.tasks[taskId];
  if (!task) {
    console.error(`Task mit ID ${taskId} nicht gefunden.`);
    return null;
  }

  // Ergänze fehlende Felder mit Standardwerten
  task.assignedUserName = kanbanData.users[task.assignedTo]?.name || "Unbekannter Benutzer";
  task.label = task.label || "Keine Kategorie";
  task.priority = task.priority || "low";
  task.title = task.title || "Kein Titel";
  task.description = task.description || "Keine Beschreibung";

  task.assignees = task.assignees || {}; // Sicherstellen, dass Assignees ein Objekt ist
  task.assigneesNames = getAssigneesNames(task.assignees, kanbanData); // Hole Assignee-Namen

  console.log("Task nach Verarbeitung:", task);
  return task; 
}



