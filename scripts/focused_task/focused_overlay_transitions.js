/**
 * Displays a focused task view, transitioning from the board content.
 * @param {string} taskId - The ID of the task to display.
 */
function renderFocusedTask(taskId) {
  let taskContent = getTaskContent(taskId, kanbanData);
  if (!taskContent) return;
  taskContent.assigneesNames = getAssigneesNames(
    taskContent.assignees,
    kanbanData
  );
  let focusedContent = document.getElementById("focusedTask");
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    showFocusedTaskContent(focusedContent, taskContent);
  }, 300);
}

/**
 * Handles the DOM update and event binding for the focused task overlay.
 * @param {HTMLElement} focusedContent - The focused task container element.
 * @param {Object} taskContent - The task data object.
 */
function showFocusedTaskContent(focusedContent, taskContent) {
  focusedContent.innerHTML = getFocusedTask(taskContent);
  focusedContent.classList.remove("d-none");
  focusedContent.onclick = function (event) {
    const card = focusedContent.querySelector(".focused-task");
    if (card && !card.contains(event.target)) {
      fromFocusedTaskToBoard();
    }
  };
  setTimeout(() => {
    const card = focusedContent.querySelector(".focused-task");
    if (card) card.classList.add("active");
  }, 30);
}

/**
 * Returns to the board view by hiding the focused task view and reloading the page.
 */
async function fromFocusedTaskToBoard() {
  let focusedContent = document.getElementById("focusedTask");
  const card = focusedContent.querySelector(".focused-task");
  if (card) card.classList.remove("active");

  document.body.style.overflow = "";

  setTimeout(() => {
    hideFocusedTaskContent(focusedContent);
    showBoardColumns();
  }, 300);
}

/**
 * Hides the focused task content and clears its HTML.
 * @param {HTMLElement} focusedContent - The focused task container element.
 */
function hideFocusedTaskContent(focusedContent) {
  focusedContent.classList.add("d-none");
  focusedContent.innerHTML = "";
}

/**
 * Switches from the focused task view to the task editing view.
 * @param {string} taskId - The ID of the task to edit.
 */
function fromFocusedToEditTask(taskId) {
  let editContent = document.getElementById("editTask");
  let focusedContent = document.getElementById("focusedTask");
  const focusedCard = focusedContent.querySelector(".focused-task");
  if (focusedCard) focusedCard.classList.remove("active");
  setTimeout(() => {
    showEditTaskContent(editContent, focusedContent, taskId);
  }, 300);
}

/**
 * Handles the DOM update and event binding for the edit task overlay.
 * @param {HTMLElement} editContent - The edit task container element.
 * @param {HTMLElement} focusedContent - The focused task container element.
 * @param {string} taskId - The ID of the task to edit.
 */
function showEditTaskContent(editContent, focusedContent, taskId) {
  focusedContent.classList.add("d-none");
  editContent.classList.remove("d-none");
  editContent.innerHTML = getEditTaskData(taskId);
  editContent.onclick = function (event) {
    const card = editContent.querySelector(".edit-task");
    if (card && !card.contains(event.target)) {
      fromEditTaskToBoard();
    }
  };
  setTimeout(() => {
    const card = editContent.querySelector(".edit-task");
    if (card) card.classList.add("active");
  }, 30);
}

/**
 * Returns from the task editing view to the focused task view.
 */
async function fromEditToFocusedTask() {
  let focusedContent = document.getElementById("focusedTask");
  let editContent = document.getElementById("editTask");
  const editCard = editContent.querySelector(".edit-task");
  if (editCard) editCard.classList.remove("active");
  setTimeout(() => {
    editContent.classList.add("d-none");
    focusedContent.classList.remove("d-none");
    setTimeout(() => {
      const focusedCard = focusedContent.querySelector(".focused-task");
      if (focusedCard) focusedCard.classList.add("active");
    }, 30);
  }, 300);
}

/**
 * Returns from the task editing view to the board view.
 */
async function fromEditTaskToBoard() {
  let editContent = document.getElementById("editTask");
  const editCard = editContent.querySelector(".edit-task");
  if (editCard) editCard.classList.remove("active");
  document.body.style.overflow = "";

  setTimeout(async () => {
    hideAndClearEditContent(editContent);
    showBoardColumns();
    await refreshBoardDataIfNeeded();
    refreshBoardSilent();
  }, 300);
}

/**
 * Hides and clears the edit content area.
 * @param {HTMLElement} editContent - The edit task container element.
 */
function hideAndClearEditContent(editContent) {
  editContent.classList.add("d-none");
  editContent.innerHTML = "";
}

/**
 * Shows all board columns.
 */
function showBoardColumns() {
  [
    "toDoCardsColumn",
    "awaitFeedbackCardsColumn",
    "doneCardsColumn",
    "inProgressCardsColumn",
  ].forEach((id) => {
    const col = document.getElementById(id);
    if (col) col.classList.remove("d-none");
  });
}

/**
 * Refreshes board data from backend if user is not a guest.
 */
async function refreshBoardDataIfNeeded() {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  if (!isGuest && typeof getKanbanData === "function") {
    await getKanbanData();
  }
}

/**
 * Saves the edited task and transitions back to the board view.
 * @param {string} taskId - The ID of the task to save.
 */
async function onSaveEditTask(taskId) {
  await saveEditedTask(taskId);
  fromEditTaskToBoard();
}
