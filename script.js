
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

    if (!kanbanData.users[user.userId]) {
      console.error("Benutzer nicht gefunden oder ungültige userId.");
      return;
    }

    const currentAssignedStatus = kanbanData.users[user.userId].assignedTasks;
    console.log("FireBase all Data:", kanbanData);
    console.log("FireBase current AssignedStatus:", currentAssignedStatus);

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
  for (let status in currentAssignedStatus) {
    if (currentAssignedStatus.hasOwnProperty(status)) {
      console.log("Status:", status); // Status anzeigen
      console.log("Aufgaben für Status", status, ":");

      const tasks = currentAssignedStatus[status];
      processTasks(tasks, kanbanData);
    }
  }
}

function processTasks(tasks, kanbanData) {
  for (let taskId in tasks) {
    if (tasks.hasOwnProperty(taskId)) {
      const task = kanbanData.tasks[taskId];
      if (task) {
        console.log(`Task ID: ${taskId}`);
        console.log("Aufgabe:", task.title);
        console.log("Beschreibung:", task.description);
        console.log("Priorität:", task.priority);

        processSubtasks(task.subtasks);
      }
    }
  }
}

function processSubtasks(subtasks) {
  if (subtasks && typeof subtasks === 'object') {
    for (let subtaskId in subtasks) {
      if (subtasks.hasOwnProperty(subtaskId)) {
        const isCompleted = subtasks[subtaskId];
        console.log(`Subtask ID: ${subtaskId}, Status: ${isCompleted ? "Completed" : "Pending"}`);
      }
    }
  } else {
    console.log("Keine Subtasks gefunden.");
  }
} 



   /* 
    //getDataContent(kanbanData);

      getDataContentHTML(userDataContent);


  function getDataContentHTML(userDataContent) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      return;
    }
    let toDoCardsHTML = getToDoContent(userDataContent);
    let inProgressCardsHTML = getInProgressContent(userDataContent);
    let awaitingFeedbackCardsHTML = getAwaitingFeedbackContent(userDataContent);
    let doneCardsHTML = getDoneContent(userDataContent);
  
    addHTMLToTaskContainers(toDoCardsHTML, inProgressCardsHTML,awaitingFeedbackCardsHTML, doneCardsHTML);
  }
  
});





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

function getToDoContent(userDataContent) {
  let toDoCardsHTML = "";
  if (
    !userDataContent.assignedTasks ||
    !userDataContent.assignedTasks.toDo ||
    Object.keys(userDataContent.assignedTasks.toDo).length === 0
  ) {
    console.log("toDo: Keine Aufgaben für diesen User");
  } else {
    let toDo = userDataContent.assignedTasks.toDo;
    let toDoArray = Object.values(toDo);
    for (let toDoIndex = 0; toDoIndex < toDoArray.length; toDoIndex++) {
      let toDoContent = toDoArray[toDoIndex];
      console.log("toDo:", toDoContent);
      toDoCardsHTML += toDoCardTemplate(toDoContent);
    }
  }
  return toDoCardsHTML;
}

function getInProgressContent(userDataContent) {
  let inProgressCardsHTML = "";
  if (
    !userDataContent.assignedTasks ||
    !userDataContent.assignedTasks.inProgress ||
    Object.keys(userDataContent.assignedTasks.inProgress).length === 0
  ) {
    console.log("In Progress: Keine Aufgaben für diesen User");
  } else {
    let inProgress = userDataContent.assignedTasks.inProgress;
    let inProgressArray = Object.values(inProgress);
    for (
      let inProgressIndex = 0;
      inProgressIndex < inProgressArray.length;
      inProgressIndex++
    ) {
      let inProgressContent = inProgressArray[inProgressIndex];
      console.log("In Progress:", inProgressContent);
      inProgressCardsHTML += inProgressCardTemplate(inProgressContent);
    }
  }
  return inProgressCardsHTML;
}

function getAwaitingFeedbackContent(userDataContent) {
  let awaitingFeedbackCardsHTML = "";
  if (
    !userDataContent.assignedTasks ||
    !userDataContent.assignedTasks.awaitingFeedback ||
    Object.keys(userDataContent.assignedTasks.awaitingFeedback).length === 0
  ) {
    console.log("Awaiting Feedback: Keine Aufgaben für diesen User");
  } else {
    let awaitingFeedback = userDataContent.assignedTasks.awaitingFeedback;
    let awaitingFeedbackArray = Object.values(awaitingFeedback);
    for (
      let awaitingFeedbackIndex = 0;
      awaitingFeedbackIndex < awaitingFeedbackArray.length;
      awaitingFeedbackIndex++
    ) {
      let awaitingFeedbackContent =
        awaitingFeedbackArray[awaitingFeedbackIndex];
      console.log("Awaiting Feedback:", awaitingFeedbackContent);
      awaitingFeedbackCardsHTML += awaitingFeedbackCardTemplate(
        awaitingFeedbackContent
      );
    }
  }
  return awaitingFeedbackCardsHTML;
}

function getDoneContent(userDataContent) {
  let doneCardsHTML = "";
  if (
    !userDataContent.assignedTasks ||
    !userDataContent.assignedTasks.done ||
    Object.keys(userDataContent.assignedTasks.done).length === 0
  ) {
    console.log("Done: Keine Aufgaben für diesen User");
  } else {
    let done = userDataContent.assignedTasks.done;
    let doneArray = Object.values(done);
    for (let doneIndex = 0; doneIndex < doneArray.length; doneIndex++) {
      let doneContent = doneArray[doneIndex];
      console.log("Done:", doneContent);
      doneCardsHTML += doneCardTemplate(doneContent);
    }
  }
  return doneCardsHTML;
}

function assigneeTemplate(assigneeInitials) {
  return `<div class="assignee">${assigneeInitials}</div>`;
}

function getAssignees(taskContent) {
  let assigneesHTML = "";
  if (taskContent.assignees && taskContent.assignees.length > 0) {
    for (
      let assigneeIndex = 0;
      assigneeIndex < taskContent.assignees.length;
      assigneeIndex++
    ) {
      let assignee = taskContent.assignees[assigneeIndex];
      let assigneeInitials = getAssigneeInitals(assignee);
      assigneesHTML += assigneeTemplate(assigneeInitials);
      console.log("Mitarbeiter:", assignee, assigneeInitials);
    }
  } else {
    assigneesHTML = "<span>Keine Mitarbeiter zugewiesen</span>";
  }
  return assigneesHTML;
}

function getAssigneeInitals(assignee) {
  let assigneeInitials = "";
  let [firstName, lastName] = assignee.split("-");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName.charAt(0).toUpperCase();
  assigneeInitials = firstLetter + lastNameFirstLetter;

  return assigneeInitials;
}
*/


