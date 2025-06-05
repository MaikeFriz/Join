/**
 * Sets up the add task overlay and its styles based on the URL category.
 */
function setupAddTaskOverlay() {
  const addTaskFrame = document.getElementById("add_task_frame");
  const addTaskContainer = document.getElementById("add_task_container");
  const closeBtn = document.getElementById("close_add_task");
  const category = getCategoryFromUrl();
  if (addTaskFrame && addTaskContainer && category) {
    addTaskFrame.classList.add("add-task-frame");
    addTaskContainer.classList.add("add-task-overlay");
    if (closeBtn) closeBtn.classList.remove("d-none");
    setTimeout(() => {
      addTaskFrame.classList.add("active");
    }, 30);
  }
}

/**
 * Sets up the click event to redirect to the board page when clicking outside the overlay.
 */
function setupOverlayClickToBoard() {
  const addTaskContainer = document.getElementById("add_task_container");
  const addTaskFrame = document.getElementById("add_task_frame");
  if (addTaskContainer && addTaskFrame) {
    addTaskContainer.addEventListener("click", function (event) {
      if (!addTaskFrame.contains(event.target)) {
        addTaskFrame.classList.remove("active");
        document.body.style.overflow = "";
        setTimeout(() => {
          window.location.href = "board.html";
        }, 300);
      }
    });
  }
}

/**
 * Closes the add task overlay and redirects to the board page.
 */
function closeAddTaskOverlay() {
  const addTaskFrame = document.getElementById("add_task_frame");
  if (addTaskFrame) {
    addTaskFrame.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => {
      window.location.href = "board.html";
    }, 300);
  }
}

/**
 * Shows the loading spinner.
 */
function showLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "flex";
}

/**
 * Hides the loading spinner.
 */
function hideLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "none";
}


