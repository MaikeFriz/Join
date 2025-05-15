// Global variables for drag-and-drop state
let draggedTask = null;
let taskClone = null;
let draggedTaskId = null;
let dropPlaceholder = null;

// Initializes drag-and-drop for all task containers
function initializeDragAndDrop(taskContainers) {
  taskContainers.forEach((container) => {
    setupDragStartListener(container);
    setupDragEndListener(container);
    setupDragOverListener(container);
    setupDropListener(container);
  });
}

// Sets up the dragstart event for a task container
function setupDragStartListener(container) {
  container.addEventListener("dragstart", (event) =>
    handleDragStart(event, (task, clone) => {
      draggedTask = task;
      taskClone = clone;
      draggedTaskId = task.dataset.taskId;
    })
  );
}

// Sets up the dragend event for a task container
function setupDragEndListener(container) {
  container.addEventListener("dragend", (event) =>
    handleDragEnd(event, () => {
      draggedTask = null;
      if (taskClone) {
        taskClone.remove();
        taskClone = null;
      }
      draggedTaskId = null;
    })
  );
}

// Sets up the dragover event for a task container
function setupDragOverListener(container) {
  container.addEventListener("dragover", (event) => {
    event.preventDefault();

    // Finde das Ziel-Task-Container-Element
    const taskContainer = getTargetTaskContainer(container);

    // Verhindere das Einfügen, wenn das Event auf dem Placeholder selbst ausgelöst wird
    if (event.target === dropPlaceholder) return;

    // Füge Placeholder nur ein, wenn noch keiner existiert
    if (!dropPlaceholder && taskContainer) {
      dropPlaceholder = document.createElement("div");
      dropPlaceholder.className = "drop-placeholder";
      dropPlaceholder.style.pointerEvents = "none";
      taskContainer.appendChild(dropPlaceholder);
    }

    handleDragOver(event, taskClone);
  });

  container.addEventListener("dragleave", (event) => {
    if (dropPlaceholder && dropPlaceholder.parentNode) {
      dropPlaceholder.parentNode.removeChild(dropPlaceholder);
      dropPlaceholder = null;
    }
  });
}

// Sets up the drop event for a task container
function setupDropListener(container) {
  container.addEventListener("drop", (event) => {
    const taskContainer = getTargetTaskContainer(container);
    handleDrop(
      event,
      container,
      draggedTask,
      draggedTaskId,
      (taskId) => updateTaskStatus(taskId, taskContainer.id) // <-- Hier die ID des inneren Containers!
    );
  });
}

// Handles the dragstart event for a task
function handleDragStart(event, onDragStart) {
  const task = event.target;
  event.dataTransfer.setData("text/plain", "");
  const taskClone = createTaskClone(task, event);
  const invisibleElement = createInvisibleDragImage(event);
  task.classList.add("dragging");
  onDragStart(task, taskClone);
  cleanUpInvisibleDragImage(invisibleElement);
}

// Creates a visual clone of the dragged task
function createTaskClone(task, event) {
  const taskClone = task.cloneNode(true);
  taskClone.classList.add("dragging-clone");
  if (task.dataset.taskId) {
    taskClone.dataset.taskId = task.dataset.taskId;
  }
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

// Creates an invisible drag image to hide the default drag icon
function createInvisibleDragImage(event) {
  const invisibleElement = document.createElement("div");
  invisibleElement.style.width = "1px";
  invisibleElement.style.height = "1px";
  invisibleElement.style.opacity = "0";
  document.body.appendChild(invisibleElement);
  event.dataTransfer.setDragImage(invisibleElement, 0, 0);
  return invisibleElement;
}

// Removes the invisible drag image after use
function cleanUpInvisibleDragImage(invisibleElement) {
  setTimeout(() => {
    invisibleElement.remove();
  }, 0);
}

// Handles the dragend event for a task
function handleDragEnd(event, onDragEnd) {
  const task = event.target;
  task.classList.remove("dragging");
  onDragEnd();
  loadNoTasksFunctions();
}

// Updates the position of the task clone during dragover
function handleDragOver(event, taskClone) {
  event.preventDefault();
  if (taskClone) {
    taskClone.style.left = `${event.pageX - taskClone.offsetWidth / 2}px`;
    taskClone.style.top = `${event.pageY - taskClone.offsetHeight / 2}px`;
  }
}

// Handles the drop event and moves the task to the new container
function handleDrop(event, container, draggedTask, taskId, onTaskDropped) {
  event.preventDefault();
  const taskContainer = getTargetTaskContainer(container);
  if (draggedTask && taskId && taskContainer) {
    if (dropPlaceholder && dropPlaceholder.parentNode === taskContainer) {
      taskContainer.insertBefore(draggedTask, dropPlaceholder);
      dropPlaceholder.parentNode.removeChild(dropPlaceholder);
      dropPlaceholder = null;
    } else {
      taskContainer.appendChild(draggedTask);
    }
    onTaskDropped(taskId);
  }
  if (dropPlaceholder && dropPlaceholder.parentNode) {
    dropPlaceholder.parentNode.removeChild(dropPlaceholder);
    dropPlaceholder = null;
  }
}

// Initializes drag-and-drop after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const dropContainers = [
    "#drag_drop_todo_container",
    "#drag_drop_progress_container",
    "#drag_drop_in_await_container",
    "#drag_drop_in_done_container"
  ];
  const taskContainers = document.querySelectorAll(dropContainers.join(", "));
  initializeDragAndDrop(taskContainers);
});

// Updates the task's status in localStorage or Firebase
function updateTaskStatus(taskId, newStatusColumnId) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  const newStatus = mapColumnIdToStatus(newStatusColumnId);
  if (isGuest) {
    updateTaskInLocalStorage(taskId, newStatus);
    return Promise.resolve();
  } else {
    return updateTaskInFirebase(taskId, newStatus).catch((error) => {

    });
  }
}

// Maps a column ID to a status string
function mapColumnIdToStatus(columnId) {
  const columnStatusMap = {
    toDoCardsColumn: "toDo",
    inProgressCardsColumn: "inProgress",
    awaitFeedbackCardsColumn: "awaitingFeedback",
    doneCardsColumn: "done",
  };
  return columnStatusMap[columnId];
}

// Updates the task's status in localStorage for guest users
function updateTaskInLocalStorage(taskId, newStatus) {
  let data = JSON.parse(localStorage.getItem("guestKanbanData"));
  if (!data || !data.users || !data.users.guest || !data.users.guest.assignedTasks) {
    return;
  }
  let assignedTasks = data.users.guest.assignedTasks;
  ["toDo", "inProgress", "awaitingFeedback", "done"].forEach(status => {
    if (assignedTasks[status] && assignedTasks[status][taskId]) {
      delete assignedTasks[status][taskId];
    }
  });
  if (!assignedTasks[newStatus]) {
    assignedTasks[newStatus] = {};
  }
  assignedTasks[newStatus][taskId] = true;
  kanbanData = data;
  localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
}

// Removes the task from all statuses in Firebase
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

// Adds the task to the new status in Firebase
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

// Updates the task's status in Firebase for logged-in users
function updateTaskInFirebase(taskId, newStatus) {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    return Promise.reject("No user found");
  }
  return removeTaskFromOtherStatuses(taskId, user.userId, BASE_URL)
    .then(() => addTaskToNewStatus(taskId, newStatus, user.userId, BASE_URL));
}

function getTargetTaskContainer(container) {
  const map = {
    'drag_drop_todo_container': 'toDoCardsColumn',
    'drag_drop_progress_container': 'inProgressCardsColumn',
    'drag_drop_in_await_container': 'awaitFeedbackCardsColumn',
    'drag_drop_in_done_container': 'doneCardsColumn'
  };
  return document.getElementById(map[container.id]);
}