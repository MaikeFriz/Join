document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/.json`;
  const currentAssignedStatus = await fetchKanbanData(BASE_URL, user); // Holt die zugewiesenen Aufgaben

  if (currentAssignedStatus) {
    // Da die Daten jetzt von 'scripts.js' verarbeitet wurden, rendert 'board.js' die Karten
    renderKanbanBoard(currentAssignedStatus, user);
  }
});

// Funktion zum Rendern des Kanban-Boards in 'board.js'
function renderKanbanBoard(currentAssignedStatus, user) {
  let toDoCardsHTML = "", inProgressCardsHTML = "", awaitingFeedbackCardsHTML = "", doneCardsHTML = "";
  
  const statuses = Object.keys(currentAssignedStatus);

  statuses.forEach(status => {
    const tasks = currentAssignedStatus[status];
    const taskHTML = generateTaskContent(tasks, status);
    
    if (status === "toDo") toDoCardsHTML += taskHTML;
    else if (status === "inProgress") inProgressCardsHTML += taskHTML;
    else if (status === "awaitingFeedback") awaitingFeedbackCardsHTML += taskHTML;
    else if (status === "done") doneCardsHTML += taskHTML;
  });

  // Karten-HTML in die jeweiligen Container einfügen
  addHTMLToTaskContainers(toDoCardsHTML, inProgressCardsHTML, awaitingFeedbackCardsHTML, doneCardsHTML);
}

// Funktion zum Erstellen des HTML-Inhalts für die Aufgaben
function generateTaskContent(tasks, status) {
  if (!tasks || Object.keys(tasks).length === 0) {
    console.log("No tasks for this category");
    return "";
  }

  return Object.keys(tasks)
    .map(taskId => {
      const taskData = tasks[taskId];
      const task = processTask(taskData, taskId); // Verarbeitet die Aufgaben-Daten
      return createCardHTML(task, status);
    })
    .join("");
}

// Funktion zum Erstellen des HTML-Templates für eine Aufgabe
function createCardHTML(task, status) {
  switch (status) {
    case "toDo":
      return toDoCardTemplate(task);
    case "inProgress":
      return inProgressCardTemplate(task);
    case "awaitingFeedback":
      return awaitingFeedbackCardTemplate(task);
    case "done":
      return doneCardTemplate(task);
    default:
      return "";
  }
}

// Funktion, um das HTML in die Container einzufügen
function addHTMLToTaskContainers(toDoHTML, inProgressHTML, feedbackHTML, doneHTML) {
  document.getElementById("toDoCard").innerHTML = toDoHTML;
  document.getElementById("inProgressCard").innerHTML = inProgressHTML;
  document.getElementById("awaitFeedbackCard").innerHTML = feedbackHTML;
  document.getElementById("doneCard").innerHTML = doneHTML;
  addDragAndDropHandlers(); // Drag-and-Drop nach dem Rendern hinzufügen
}

// Task-Daten verarbeiten, um sicherzustellen, dass alle Felder ausgefüllt sind
function processTask(taskData, taskId) {
  return {
    ...taskData,
    taskId: taskId,
    title: taskData.title || "No Title",
    description: taskData.description || "No Description",
    label: taskData.label || "No Label",
    priority: taskData.priority || "Low",
    assignedUserName: taskData.assignedTo || "Unknown"
  };
}
