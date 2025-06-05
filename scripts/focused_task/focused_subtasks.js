/**
 * Renders the subtasks for a given task by generating HTML based on their data.
 * @param {Object} subtaskRefs - The references to the subtasks for the task.
 * @param {Object} allSubtasks - All available subtasks data.
 * @returns {string} The HTML string for all subtasks.
 */
function renderSubtasks(subtaskRefs, allSubtasks) {
  if (!subtaskRefs || !allSubtasks) return "<div>No Subtasks</div>";
  const titles = Object.keys(subtaskRefs).map((subtaskId) => {
    const subtask = allSubtasks[subtaskId];
    if (!subtask) return "";
    const isChecked = subtask.completed ? "checked" : "";
    return focusedSubtaskTemplate(subtask, isChecked, subtaskId);
  });

  return titles.join("");
}

/**
 * Updates the completion status of a subtask for guest users.
 * @param {string} subtaskId - The subtask ID.
 * @param {boolean} isChecked - The completion status.
 */
function updateSubtaskForGuest(subtaskId, isChecked) {
  const guestData = JSON.parse(localStorage.getItem("guestKanbanData"));
  if (guestData && guestData.subtasks && guestData.subtasks[subtaskId]) {
    guestData.subtasks[subtaskId].completed = isChecked;
    localStorage.setItem("guestKanbanData", JSON.stringify(guestData));
  }

  if (kanbanData.subtasks && kanbanData.subtasks[subtaskId]) {
    kanbanData.subtasks[subtaskId].completed = isChecked;
  }
}

/**
 * Updates the completion status of a subtask in the database.
 * @param {string} subtaskId - The subtask ID.
 * @param {boolean} isChecked - The completion status.
 * @param {Function} callback - Callback to execute after update.
 */
function updateSubtaskInDatabase(subtaskId, isChecked, callback) {
  const url = `${BASE_URL}subtasks/${subtaskId}/completed.json`;
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isChecked),
  })
    .then(handleSubtaskUpdateResponse(subtaskId, isChecked, callback))
    .catch((error) => {});
}

/**
 * Handles the fetch response and updates in-memory data and callback.
 * @param {string} subtaskId - The subtask ID.
 * @param {boolean} isChecked - The completion status.
 * @param {Function} callback - Callback to execute after update.
 * @returns {Function} A function to handle the fetch response.
 */
function handleSubtaskUpdateResponse(subtaskId, isChecked, callback) {
  return (response) => {
    if (!response.ok) {
      throw new Error("Error updating subtask");
    }
    return response.json().then(() => {
      if (kanbanData.subtasks && kanbanData.subtasks[subtaskId]) {
        kanbanData.subtasks[subtaskId].completed = isChecked;
      }
      if (typeof callback === "function") {
        callback();
      }
    });
  };
}

/**
 * Toggles the completion status of a subtask and delegates to the appropriate function.
 * @param {string} subtaskId - The subtask ID.
 * @param {boolean} isChecked - The completion status.
 */
function toggleSubtaskCompletion(subtaskId, isChecked) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));

  if (isGuest) {
    updateSubtaskForGuest(subtaskId, isChecked);
    updateSubtaskProgressBarOnly(subtaskId);
  } else {
    updateSubtaskInDatabase(subtaskId, isChecked, () => {
      updateSubtaskProgressBarOnly(subtaskId);
    });
  }
}

/**
 * Finds the taskId that a given subtask belongs to.
 * @param {string} subtaskId - The subtask ID.
 * @returns {string|null} The task ID or null if not found.
 */
function findTaskIdBySubtask(subtaskId) {
  for (const tId in kanbanData.tasks) {
    const task = kanbanData.tasks[tId];
    if (task && task.subtasks && task.subtasks[subtaskId]) {
      return tId;
    }
  }
  return null;
}

/**
 * Sets the progress bar width, text, and visibility in the overlay based on progress data.
 * @param {HTMLElement} focusedContent - The focused task container element.
 * @param {Object} progressData - The progress data object.
 */
function setOverlaySubtaskProgress(focusedContent, progressData) {
  setOverlaySubtaskProgressBar(focusedContent, progressData.progressPercentage);
  setOverlaySubtaskProgressTextAndVisibility(
    focusedContent,
    progressData.completedSubtasks,
    progressData.totalSubtasks,
    progressData.showProgress
  );
}

/**
 * Sets the progress bar width in the overlay.
 * @param {HTMLElement} focusedContent - The focused task container element.
 * @param {number} progressPercentage - The progress percentage.
 */
function setOverlaySubtaskProgressBar(focusedContent, progressPercentage) {
  const progressBar = focusedContent.querySelector(".subtask-inner-progress-bar");
  if (progressBar) progressBar.style.width = `${progressPercentage}%`;
}

/**
 * Sets the progress text and visibility in the overlay.
 * @param {HTMLElement} focusedContent - The focused task container element.
 * @param {number} completedSubtasks - Number of completed subtasks.
 * @param {number} totalSubtasks - Total number of subtasks.
 * @param {boolean} showProgress - Whether to show the progress bar.
 */
function setOverlaySubtaskProgressTextAndVisibility(
  focusedContent,
  completedSubtasks,
  totalSubtasks,
  showProgress
) {
  const progressText = focusedContent.querySelector(".subtask-progress-text span");
  if (progressText)
    progressText.textContent = `${completedSubtasks}/${totalSubtasks}`;

  const progressContainer = focusedContent.querySelector(".subtask-progress-container");
  if (progressContainer)
    progressContainer.style.display = showProgress ? "flex" : "none";
}

/**
 * Updates the subtask progress bar and text in the overlay for a given task.
 * @param {string} taskId - The task ID.
 */
function updateOverlaySubtaskProgress(taskId) {
  const focusedContent = document.getElementById("focusedTask");
  if (focusedContent && !focusedContent.classList.contains("d-none")) {
    const taskContent = getTaskContent(taskId, kanbanData);
    const progressData = getTaskData(taskContent);
    setOverlaySubtaskProgress(focusedContent, progressData);
  }
}

/**
 * Updates the board preview subtask bar for a given task if visible.
 * @param {string} taskId - The task ID.
 */
function updateBoardPreviewSubtaskBar(taskId) {
  const boardTask = document.querySelector(`[data-task-id='${taskId}']`);
  if (boardTask && typeof refreshBoardSilent === "function") {
    refreshBoardSilent();
  }
}

/**
 * Updates only the subtask progress bar and text in the overlay and board after a subtask is toggled.
 * @param {string} subtaskId - The subtask ID.
 */
function updateSubtaskProgressBarOnly(subtaskId) {
  const taskId = findTaskIdBySubtask(subtaskId);
  if (!taskId) return;

  updateOverlaySubtaskProgress(taskId);
  updateBoardPreviewSubtaskBar(taskId);
}
