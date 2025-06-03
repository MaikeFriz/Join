// Renders the subtasks for a given task by generating HTML based on their data
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

// Updates the completion status of a subtask for guest users
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

// Updates the completion status of a subtask in the database
function updateSubtaskInDatabase(subtaskId, isChecked, callback) {
  const url = `${BASE_URL}subtasks/${subtaskId}/completed.json`;
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isChecked),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error updating subtask");
      }
      return response.json();
    })
    .then(() => {
      // Update in-memory kanbanData for existing users, just like for guests
      if (kanbanData.subtasks && kanbanData.subtasks[subtaskId]) {
        kanbanData.subtasks[subtaskId].completed = isChecked;
      }
      if (typeof callback === "function") {
        callback();
      }
    })
    .catch((error) => {
    });
}

// Toggles the completion status of a subtask and delegates to the appropriate function
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

// Finds the taskId that a given subtask belongs to
function findTaskIdBySubtask(subtaskId) {
  for (const tId in kanbanData.tasks) {
    const task = kanbanData.tasks[tId];
    if (task.subtasks && task.subtasks[subtaskId]) {
      return tId;
    }
  }
  return null;
}

// Sets the progress bar width, text, and visibility in the overlay based on progress data
function setOverlaySubtaskProgress(focusedContent, progressData) {
  const { totalSubtasks, completedSubtasks, progressPercentage, showProgress } = progressData;

  const progressBar = focusedContent.querySelector(".subtask-inner-progress-bar");
  if (progressBar) progressBar.style.width = `${progressPercentage}%`;

  const progressText = focusedContent.querySelector(".subtask-progress-text span");
  if (progressText) progressText.textContent = `${completedSubtasks}/${totalSubtasks}`;

  const progressContainer = focusedContent.querySelector(".subtask-progress-container");
  if (progressContainer) progressContainer.style.display = showProgress ? "flex" : "none";
}

// Updates the subtask progress bar and text in the overlay for a given task
function updateOverlaySubtaskProgress(taskId) {
  const focusedContent = document.getElementById("focusedTask");
  if (focusedContent && !focusedContent.classList.contains("d-none")) {
    const taskContent = getTaskContent(taskId, kanbanData);
    const progressData = getTaskData(taskContent);
    setOverlaySubtaskProgress(focusedContent, progressData);
  }
}

// Updates the board preview subtask bar for a given task if visible
function updateBoardPreviewSubtaskBar(taskId) {
  const boardTask = document.querySelector(`[data-task-id='${taskId}']`);
  if (boardTask && typeof refreshBoardSilent === "function") {
    refreshBoardSilent();
  }
}

// Updates only the subtask progress bar and text in the overlay and board after a subtask is toggled
function updateSubtaskProgressBarOnly(subtaskId) {
  const taskId = findTaskIdBySubtask(subtaskId);
  if (!taskId) return;

  updateOverlaySubtaskProgress(taskId);
  updateBoardPreviewSubtaskBar(taskId);
}
