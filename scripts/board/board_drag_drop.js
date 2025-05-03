// Initializes the drag-and-drop functionality for each task container
function initializeDragAndDrop(taskContainers) {
  taskContainers.forEach((container) => {
    setupDragStartListener(container);
    setupDragEndListener(container);
    setupDragOverListener(container);
    setupDropListener(container);
  });
}

// Sets up the 'dragstart' event listener for the task container
function setupDragStartListener(container) {
  container.addEventListener("dragstart", (event) =>
    handleDragStart(event, (task, clone) => {
      draggedTask = task;
      taskClone = clone;
    })
  );
}

// Sets up the 'dragend' event listener for the task container
function setupDragEndListener(container) {
  container.addEventListener("dragend", (event) =>
    handleDragEnd(event, () => {
      draggedTask = null;
      if (taskClone) {
        taskClone.remove();
        taskClone = null;
      }
    })
  );
}

// Sets up the 'dragover' event listener for the task container
function setupDragOverListener(container) {
  container.addEventListener("dragover", (event) => handleDragOver(event, taskClone));
}

// Sets up the 'drop' event listener for the task container
function setupDropListener(container) {
  container.addEventListener("drop", (event) =>
    handleDrop(event, container, draggedTask, (task) => updateTaskStatus(task.dataset.taskId, container.id))
  );
}

// Handles the start of the drag-and-drop operation
function handleDragStart(event, onDragStart) {
  const task = event.target;
  event.dataTransfer.setData("text/plain", "");

  const taskClone = createTaskClone(task, event);
  const invisibleElement = createInvisibleDragImage(event);

  task.classList.add("dragging");
  onDragStart(task, taskClone);

  cleanUpInvisibleDragImage(invisibleElement);
}

// Creates a clone of the dragged task and positions it near the cursor
function createTaskClone(task, event) {
  const taskClone = task.cloneNode(true);
  taskClone.classList.add("dragging-clone");
  document.body.appendChild(taskClone);

  const rect = task.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  taskClone.style.left = `${event.pageX - offsetX}px`;
  taskClone.style.top = `${event.pageY - offsetY}px`;
  taskClone.style.width = `${task.offsetWidth}px`;
  taskClone.style.height = `${task.offsetHeight}px`;

  return taskClone;
}

// Creates an invisible drag image to prevent the default globe icon from showing
function createInvisibleDragImage(event) {
  const invisibleElement = document.createElement("div");
  invisibleElement.style.width = "1px";
  invisibleElement.style.height = "1px";
  invisibleElement.style.opacity = "0";
  document.body.appendChild(invisibleElement);

  event.dataTransfer.setDragImage(invisibleElement, 0, 0);

  return invisibleElement;
}

// Cleans up the invisible drag image after it is used
function cleanUpInvisibleDragImage(invisibleElement) {
  setTimeout(() => {
    invisibleElement.remove();
  }, 0);
}


// Handles the dragend event, cleaning up after the drag operation
function handleDragEnd(event, onDragEnd) {
  const task = event.target;
  task.classList.remove("dragging");
  onDragEnd();
  loadNoTasksFunctions();

}

// Updates the position of the task clone as it follows the cursor during drag
function handleDragOver(event, taskClone) {
  event.preventDefault();
  if (taskClone) {
    taskClone.style.left = `${event.pageX - taskClone.offsetWidth / 2}px`;
    taskClone.style.top = `${event.pageY - taskClone.offsetHeight / 2}px`;
  }
}

// Handles the drop event, moving the dragged task to its new container
function handleDrop(event, container, draggedTask, onTaskDropped) {
  event.preventDefault();
  if (draggedTask) {
    container.appendChild(draggedTask);
    onTaskDropped(draggedTask);
  }
}

// Initializes the drag-and-drop functionality after the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  const taskContainers = document.querySelectorAll(".task-container");
  initializeDragAndDrop(taskContainers);
});

// Updates the task's status in Firebase or LocalStorage (Guest Mode)
function updateTaskStatus(taskId, newStatusColumnId) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  const newStatus = mapColumnIdToStatus(newStatusColumnId);

  if (isGuest) {
    updateTaskInLocalStorage(taskId, newStatus);
    return Promise.resolve();
  } else {
    return updateTaskInFirebase(taskId, newStatus).catch((error) => {
      console.error("Error updating task in Firebase:", error);
    });
  }
}

// Maps the column ID to the task's status
function mapColumnIdToStatus(columnId) {
  const columnStatusMap = {
    toDoCardsColumn: "toDo",
    inProgressCardsColumn: "inProgress",
    awaitFeedbackCardsColumn: "awaitingFeedback",
    doneCardsColumn: "done",
  };
  return columnStatusMap[columnId];
}

// Updates the task's status in LocalStorage for Guest Mode
function updateTaskInLocalStorage(taskId, newStatus) {
  let data = JSON.parse(localStorage.getItem("guestKanbanData"));
  if (!data || !data.users || !data.users.user || !data.users.user.assignedTasks) {
    return;
  }

  let assignedTasks = data.users.user.assignedTasks;

  ["toDo", "inProgress", "awaitingFeedback", "done"].forEach(status => {
    if (assignedTasks[status] && assignedTasks[status][taskId]) {
      delete assignedTasks[status][taskId];
    }
  });

  if (!assignedTasks[newStatus]) {
    assignedTasks[newStatus] = {};
  }
  assignedTasks[newStatus][taskId] = true;

  localStorage.setItem("guestKanbanData", JSON.stringify(data));
}

// Removes the task from all other status lists in Firebase
function removeTaskFromOtherStatuses(taskId, userId, baseUrl) {
  const statusPaths = ["toDo", "inProgress", "awaitingFeedback", "done"];
  const deletePromises = statusPaths.map((status) => {
    const taskPath = `${baseUrl}users/${userId}/assignedTasks/${status}/${taskId}.json`;
    return fetch(taskPath, {
      method: "DELETE",
    });
  });
  return Promise.all(deletePromises);
}

// Adds the task to the new status list in Firebase
function addTaskToNewStatus(taskId, newStatus, userId, baseUrl) {
  const taskPath = `${baseUrl}users/${userId}/assignedTasks/${newStatus}/${taskId}.json`;
  return fetch(taskPath, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(true),
  });
}

// Updates the task's status in Firebase by removing it from other statuses and adding it to the new one
function updateTaskInFirebase(taskId, newStatus) {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (isGuest) {
    let data = JSON.parse(localStorage.getItem("guestKanbanData"));
    user = data.users.user;
  }

  if (!user) {
    return Promise.reject("No user found");
  }
  return removeTaskFromOtherStatuses(taskId, user.userId, BASE_URL)
    .then(() => addTaskToNewStatus(taskId, newStatus, user.userId, BASE_URL));
}


