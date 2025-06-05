// Global variables for drag-and-drop state
let draggedTask = null;
let taskClone = null;
let draggedTaskId = null;
let dropPlaceholder = null;

/**
 * Initializes drag-and-drop for all task containers.
 * @param {NodeList} taskContainers - The list of task container elements.
 */
function initializeDragAndDrop(taskContainers) {
  taskContainers.forEach((container) => {
    setupDragStartListener(container);
    setupDragEndListener(container);
    setupDragOverListener(container);
    setupDropListener(container);
  });
}

/**
 * Sets up the dragstart event for a task container.
 * @param {HTMLElement} container - The task container element.
 */
function setupDragStartListener(container) {
  container.addEventListener("dragstart", (event) => {
    const task = event.target.closest('[draggable="true"]');
    if (!task) return;
    handleDragStart(event, (task, clone) => {
      draggedTask = task;
      taskClone = clone;
      draggedTaskId = task.dataset.taskId;
    });
  });
}

/**
 * Sets up the dragend event for a task container.
 * @param {HTMLElement} container - The task container element.
 */
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

/**
 * Sets up the dragover event for a task container.
 * @param {HTMLElement} container - The task container element.
 */
function setupDragOverListener(container) {
  container.addEventListener("dragover", (event) => handleContainerDragOver(event, container));
  container.addEventListener("dragleave", handleContainerDragLeave);
}

/**
 * Handles the dragover event for a task container.
 * @param {DragEvent} event - The dragover event.
 * @param {HTMLElement} container - The task container element.
 */
function handleContainerDragOver(event, container) {
  event.preventDefault();
  handleContainerAutoScroll(event, container);
  handleDropPlaceholder(event, container);
  handleDragOver(event, taskClone);
}

/**
 * Handles auto-scrolling of the container when dragging near the edges.
 * @param {DragEvent} event - The dragover event.
 * @param {HTMLElement} container - The task container element.
 */
function handleContainerAutoScroll(event, container) {
  const SCROLL_ZONE = 60;
  const SCROLL_SPEED = 15;
  const rect = container.getBoundingClientRect();
  if (event.clientY < rect.top + SCROLL_ZONE) {
    container.scrollTop -= SCROLL_SPEED;
  } else if (event.clientY > rect.bottom - SCROLL_ZONE) {
    container.scrollTop += SCROLL_SPEED;
  }
}

/**
 * Handles the drop placeholder logic when dragging over a container.
 * @param {DragEvent} event - The dragover event.
 * @param {HTMLElement} container - The task container element.
 */
function handleDropPlaceholder(event, container) {
  const taskContainer = getTargetTaskContainer(container);
  if (event.target === dropPlaceholder) return;
  if (!dropPlaceholder && taskContainer) {
    dropPlaceholder = document.createElement("div");
    dropPlaceholder.className = "drop-placeholder";
    dropPlaceholder.style.pointerEvents = "none";
    taskContainer.appendChild(dropPlaceholder);
  }
}

/**
 * Removes the drop placeholder when dragging leaves the container.
 * @param {DragEvent} event - The dragleave event.
 */
function handleContainerDragLeave(event) {
  if (dropPlaceholder && dropPlaceholder.parentNode) {
    dropPlaceholder.parentNode.removeChild(dropPlaceholder);
    dropPlaceholder = null;
  }
}

/**
 * Sets up the drop event for a task container.
 * @param {HTMLElement} container - The task container element.
 */
function setupDropListener(container) {
  container.addEventListener("drop", (event) => {
    const taskContainer = getTargetTaskContainer(container);
    handleDrop(event, container, draggedTask,draggedTaskId,
      (taskId) => updateTaskStatus(taskId, taskContainer.id)
    );
  });
}

/**
 * Handles the dragstart event for a task.
 * @param {DragEvent} event - The dragstart event.
 * @param {Function} onDragStart - Callback to execute after drag starts.
 */
function handleDragStart(event, onDragStart) {
  const task = event.target;
  event.dataTransfer.setData("text/plain", "");
  const taskClone = createTaskClone(task, event);
  const invisibleElement = createInvisibleDragImage(event);
  task.classList.add("dragging");
  onDragStart(task, taskClone);
  cleanUpInvisibleDragImage(invisibleElement);
}

/**
 * Handles the dragend event for a task.
 * @param {DragEvent} event - The dragend event.
 * @param {Function} onDragEnd - Callback to execute after drag ends.
 */
function handleDragEnd(event, onDragEnd) {
  const task = event.target;
  task.classList.remove("dragging");
  onDragEnd();
  loadNoTasksFunctions();
}

/**
 * Handles the drop event and moves the task to the new container.
 * @param {DragEvent} event - The drop event.
 * @param {HTMLElement} container - The task container element.
 * @param {HTMLElement} draggedTask - The dragged task element.
 * @param {string} taskId - The ID of the dragged task.
 * @param {Function} onTaskDropped - Callback to execute after the task is dropped.
 */
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

/**
 * Initializes drag-and-drop after the DOM is loaded.
 */
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

/**
 * Updates the task's status in localStorage or Firebase.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatusColumnId - The ID of the new status column.
 * @returns {Promise<void>|void} A promise for logged-in users, or void for guests.
 */
function updateTaskStatus(taskId, newStatusColumnId) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  const newStatus = mapColumnIdToStatus(newStatusColumnId);
  if (isGuest) {
    updateTaskStatusForGuest(taskId, newStatus);
    return Promise.resolve();
  } else {
    return updateTaskStatusForUser(taskId, newStatus);
  }
}

/**
 * Handles status update for guest users.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status to assign.
 */
function updateTaskStatusForGuest(taskId, newStatus) {
  updateTaskInLocalStorage(taskId, newStatus);
  localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
}

/**
 * Handles status update for logged-in users.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status to assign.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
function updateTaskStatusForUser(taskId, newStatus) {
  return updateTaskInFirebase(taskId, newStatus)
    .then(() => {
      updateKanbanDataForUser(taskId, newStatus);
    })
    .catch((error) => {
      // Optional: handle error
    });
}

/**
 * Updates kanbanData for the logged-in user after Firebase update.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status to assign.
 */
function updateKanbanDataForUser(taskId, newStatus) {
  if (kanbanData.tasks && kanbanData.tasks[taskId]) {
    kanbanData.tasks[taskId].status = newStatus;
  }
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user && kanbanData.users && kanbanData.users[user.userId]) {
    ["toDo", "inProgress", "awaitingFeedback", "done"].forEach(status => {
      if (kanbanData.users[user.userId].assignedTasks[status]?.[taskId]) {
        delete kanbanData.users[user.userId].assignedTasks[status][taskId];
      }
    });
    if (!kanbanData.users[user.userId].assignedTasks[newStatus]) {
      kanbanData.users[user.userId].assignedTasks[newStatus] = {};
    }
    kanbanData.users[user.userId].assignedTasks[newStatus][taskId] = true;
  }
}

/**
 * Maps a column ID to a status string.
 * @param {string} columnId - The column ID.
 * @returns {string} The corresponding status string.
 */
function mapColumnIdToStatus(columnId) {
  const columnStatusMap = {
    toDoCardsColumn: "toDo",
    inProgressCardsColumn: "inProgress",
    awaitFeedbackCardsColumn: "awaitingFeedback",
    doneCardsColumn: "done",
  };
  return columnStatusMap[columnId];
}

/**
 * Updates the task's status in localStorage for guest users.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status to assign.
 */
function updateTaskInLocalStorage(taskId, newStatus) {
  let data = JSON.parse(localStorage.getItem("guestKanbanData"));
  if (!data?.users?.guest?.assignedTasks) return;
  removeTaskFromAllStatuses(data.users.guest.assignedTasks, taskId);
  addTaskToStatus(data.users.guest.assignedTasks, taskId, newStatus);
  if (data.tasks?.[taskId]) {
    data.tasks[taskId].status = newStatus;
    data.tasks[taskId].taskId = taskId;
  }
  kanbanData = data;
  ensureTaskIdsInKanbanData();
  localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
}

/**
 * Removes the task from all statuses in localStorage.
 * @param {Object} assignedTasks - The assignedTasks object.
 * @param {string} taskId - The ID of the task.
 */
function removeTaskFromAllStatuses(assignedTasks, taskId) {
  ["toDo", "inProgress", "awaitingFeedback", "done"].forEach(status => {
    if (assignedTasks[status]?.[taskId]) {
      delete assignedTasks[status][taskId];
    }
  });
}

/**
 * Adds the task to the new status in localStorage.
 * @param {Object} assignedTasks - The assignedTasks object.
 * @param {string} taskId - The ID of the task.
 * @param {string} status - The new status to assign.
 */
function addTaskToStatus(assignedTasks, taskId, status) {
  if (!assignedTasks[status]) assignedTasks[status] = {};
  assignedTasks[status][taskId] = true;
}

/**
 * Removes the task from all statuses in Firebase.
 * @param {string} taskId - The ID of the task.
 * @param {string} userId - The user ID.
 * @param {string} baseUrl - The base URL for the API.
 * @returns {Promise<Array>} A promise that resolves when all deletions are complete.
 */
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

/**
 * Adds the task to the new status in Firebase.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status to assign.
 * @param {string} userId - The user ID.
 * @param {string} baseUrl - The base URL for the API.
 * @returns {Promise<Response>} A promise that resolves when the task is added.
 */
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

/**
 * Updates the task's status in Firebase for logged-in users.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status to assign.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
function updateTaskInFirebase(taskId, newStatus) {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    return Promise.reject("No user found");
  }
  return removeTaskFromOtherStatuses(taskId, user.userId, BASE_URL)
    .then(() => addTaskToNewStatus(taskId, newStatus, user.userId, BASE_URL));
}

/**
 * Gets the target task container based on the ID of the dragged container.
 * @param {HTMLElement} container - The dragged container element.
 * @returns {HTMLElement|null} The target task container element.
 */
function getTargetTaskContainer(container) {
  const map = {
    'drag_drop_todo_container': 'toDoCardsColumn',
    'drag_drop_progress_container': 'inProgressCardsColumn',
    'drag_drop_in_await_container': 'awaitFeedbackCardsColumn',
    'drag_drop_in_done_container': 'doneCardsColumn'
  };
  return document.getElementById(map[container.id]);
}

/**
 * Ensures that all tasks in kanbanData have a taskId property.
 */
function ensureTaskIdsInKanbanData() {
    if (!kanbanData.tasks) return;
    for (const id in kanbanData.tasks) {
        if (kanbanData.tasks[id] && !kanbanData.tasks[id].taskId) {
            kanbanData.tasks[id].taskId = id;
        }
    }
}