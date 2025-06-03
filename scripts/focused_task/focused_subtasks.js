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
      // Removed console.error statement
    });
}

// Toggles the completion status of a subtask and delegates to the appropriate function
function toggleSubtaskCompletion(subtaskId, isChecked) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));

  if (isGuest) {
    updateSubtaskForGuest(subtaskId, isChecked);
    // For guests, update progress bar immediately
    updateSubtaskProgressBarOnly(subtaskId);
  } else {
    // For logged-in users, update progress bar after DB and in-memory update
    updateSubtaskInDatabase(subtaskId, isChecked, () => {
      updateSubtaskProgressBarOnly(subtaskId);
    });
  }
}

// Updates only the subtask progress bar and text in the overlay and board after a subtask is toggled
function updateSubtaskProgressBarOnly(subtaskId) {
  // Find the taskId this subtask belongs to
  let taskId = null;
  for (const tId in kanbanData.tasks) {
    const task = kanbanData.tasks[tId];
    if (task.subtasks && task.subtasks[subtaskId]) {
      taskId = tId;
      break;
    }
  }
  if (!taskId) return;

  // Update overlay subtask bar (progress bar and text only)
  const focusedContent = document.getElementById("focusedTask");
  if (focusedContent && !focusedContent.classList.contains("d-none")) {
    // Get updated subtask progress data
    const taskContent = getTaskContent(taskId, kanbanData);
    const {
      totalSubtasks,
      completedSubtasks,
      progressPercentage,
      showProgress,
    } = getTaskData(taskContent);
    // Update progress bar width
    const progressBar = focusedContent.querySelector(
      ".subtask-inner-progress-bar"
    );
    if (progressBar) progressBar.style.width = `${progressPercentage}%`;
    // Update progress text
    const progressText = focusedContent.querySelector(
      ".subtask-progress-text span"
    );
    if (progressText)
      progressText.textContent = `${completedSubtasks}/${totalSubtasks}`;
    // Optionally show/hide progress bar
    const progressContainer = focusedContent.querySelector(
      ".subtask-progress-container"
    );
    if (progressContainer)
      progressContainer.style.display = showProgress ? "flex" : "none";
  }

  // Update board preview subtask bar (if visible)
  const boardTask = document.querySelector(`[data-task-id='${taskId}']`);
  if (boardTask) {
    if (typeof refreshBoardSilent === "function") {
      refreshBoardSilent();
    }
  }
}
