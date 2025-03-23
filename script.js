
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
  // Initialisieren der HTML-Strings für die verschiedenen Status-Container
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
          toDoCardsHTML += toDoCardTemplate(processedTask, kanbanData.users[processedTask.assignedTo] || {});
        } else if (status === "inProgress") {
          inProgressCardsHTML += inProgressCardTemplate(processedTask, kanbanData.users[processedTask.assignedTo] || {});
        } else if (status === "awaitingFeedback") {
          awaitingFeedbackCardsHTML += awaitingFeedbackCardTemplate(processedTask, kanbanData.users[processedTask.assignedTo] || {});
        } else if (status === "done") {
          doneCardsHTML += doneCardTemplate(processedTask, kanbanData.users[processedTask.assignedTo] || {});
        }
      }
    }
  }

  console.log("Generierte HTML für ToDo:", toDoCardsHTML);
  console.log("Generierte HTML für InProgress:", inProgressCardsHTML);
  console.log("Generierte HTML für AwaitingFeedback:", awaitingFeedbackCardsHTML);
  console.log("Generierte HTML für Done:", doneCardsHTML);

  // Einfügen der HTML-Strings in die passenden DOM-Elemente
  addHTMLToTaskContainers(toDoCardsHTML, inProgressCardsHTML, awaitingFeedbackCardsHTML, doneCardsHTML);
}


function processTasks(taskId, kanbanData) {
  // Extrahiere die tatsächlichen Daten aus `kanbanData.tasks`
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

  console.log("Task in processTasks nach Ergänzungen:", task);
  return task; // Rückgabe der verarbeiteten Aufgabe
}

function addHTMLToTaskContainers(toDoCardsHTML, inProgressCardsHTML, awaitingFeedbackCardsHTML, doneCardsHTML) {
  let toDoCardContainer = document.getElementById("toDoCard");
  let inProgressCardContainer = document.getElementById("inProgressCard");
  let awaitingFeedbackContainer = document.getElementById("awaitFeedbackCard");
  let doneCardContainer = document.getElementById("doneCard");

  toDoCardContainer.innerHTML += toDoCardsHTML;
  inProgressCardContainer.innerHTML += inProgressCardsHTML;
  awaitingFeedbackContainer.innerHTML += awaitingFeedbackCardsHTML;
  doneCardContainer.innerHTML += doneCardsHTML;
}

function getAssignees(taskContent) {
  let assigneesHTML = "";
  // Durchlaufen der Assignees-IDs und Abrufen der zugehörigen Benutzerdaten
  if (taskContent.assignees && Object.keys(taskContent.assignees).length > 0) {
    for (let assigneeId in taskContent.assignees) {
      let assignee = localExampleDatabase.users[assigneeId]; // Hole die Benutzerdaten
      console.log("Assignee ID:", assigneeId); // Loggt die Assignee-ID
      console.log("Assignee Daten:", assignee); // Loggt die Benutzerdaten für diese ID

      if (assignee) {
        let assigneeInitials = getAssigneeInitals(assignee.name); // Verwende den vollständigen Namen
        assigneesHTML += assigneeTemplate(assigneeInitials);
        console.log("Mitarbeiter:", assignee.name, assigneeInitials);
      }
    }
  } else {
    assigneesHTML = "<span>Keine Mitarbeiter zugewiesen</span>";
  }
  return assigneesHTML;
}


function getAssigneeInitals(assigneeName) {
  let assigneeInitials = "";
  let [firstName, lastName] = assigneeName.split(" "); // Spaltet den Namen in Vorname und Nachname
  if (firstName && lastName) {
    assigneeInitials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  } else {
    assigneeInitials = assigneeName.charAt(0).toUpperCase(); // Falls nur ein Name vorhanden ist
  }
  return assigneeInitials;
}

function assigneeTemplate(initials) {
  return `
    <div class="assignee">
      <span class="assignee-initials">${initials}</span>
    </div>
  `;
}

