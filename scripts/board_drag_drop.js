// Function to initialize drag-and-drop behavior for tasks
function initializeDragAndDrop(taskContainers) {
  let draggedTask = null;

  taskContainers.forEach((container) => {
    container.addEventListener("dragstart", (event) => handleDragStart(event, (task) => (draggedTask = task)));
    container.addEventListener("dragend", (event) => handleDragEnd(event, () => (draggedTask = null)));
    container.addEventListener("dragover", (event) => event.preventDefault()); // Allow drop
    container.addEventListener("drop", (event) => handleDrop(event, container, draggedTask, (task) => updateTaskStatus(task.dataset.taskId, container.id)));
  });
}

// Drag-and-drop event handlers
function handleDragStart(event, onDragStart) {
  const task = event.target;
  task.classList.add("dragging");
  onDragStart(task);
}

function handleDragEnd(event, onDragEnd) {
  event.target.classList.remove("dragging");
  onDragEnd();
}

function handleDrop(event, container, draggedTask, onTaskDropped) {
  event.preventDefault();
  if (draggedTask) {
    container.appendChild(draggedTask);
    onTaskDropped(draggedTask);
  }
}

// Initialize drag-and-drop functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const taskContainers = document.querySelectorAll(".task-container");
  initializeDragAndDrop(taskContainers);
});


// Function to update the task status
function updateTaskStatus(taskId, newStatusColumnId) {
  const newStatus = mapColumnIdToStatus(newStatusColumnId);

  // Update the task status in Firebase
  updateTaskInFirebase(taskId, newStatus)
    .then(() => {
      console.log(`Task ID: ${taskId} successfully moved to status ${newStatus}.`);
    })
    .catch((error) => {
      console.error("Error updating task in Firebase:", error);
    });
}

// Function to map column IDs to actual statuses
function mapColumnIdToStatus(columnId) {
  const columnStatusMap = {
    toDoCardsColumn: "toDo",
    inProgressCardsColumn: "inProgress",
    awaitFeedbackCardsColumn: "awaitingFeedback",
    doneCardsColumn: "done",
  };
  return columnStatusMap[columnId];
}

// Function to remove the task from all other status lists in Firebase
function removeTaskFromOtherStatuses(taskId, userId, baseUrl) {
  const statusPaths = ["toDo", "inProgress", "awaitingFeedback", "done"];
  const deletePromises = statusPaths.map((status) => {
    const taskPath = `${baseUrl}users/${userId}/assignedTasks/${status}/${taskId}.json`;
    return fetch(taskPath, {
      method: "DELETE", // Remove the task from the previous list
    });
  });
  return Promise.all(deletePromises);
}

// Function to add the task to the new status list in Firebase
function addTaskToNewStatus(taskId, newStatus, userId, baseUrl) {
  const taskPath = `${baseUrl}users/${userId}/assignedTasks/${newStatus}/${taskId}.json`;
  return fetch(taskPath, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(true), // Mark the task as active in the new list
  });
}

// Main function to update the task in Firebase
function updateTaskInFirebase(taskId, newStatus) {
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    console.error("No logged-in user found.");
    return Promise.reject("No user found");
  }

  return removeTaskFromOtherStatuses(taskId, user.userId, BASE_URL)
    .then(() => addTaskToNewStatus(taskId, newStatus, user.userId, BASE_URL));
}
