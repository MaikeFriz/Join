
// Displays a focused task view, transitioning from the board content.
function renderFocusedTask(taskId) {
  let taskContent = getTaskContent(taskId, kanbanData);
  if (!taskContent) return;
  let boardContent = document.getElementById('boardContent');
  let focusedContent = document.getElementById('focusedTask');
  boardContent.classList.remove('active');
  boardContent.classList.add('d-none');
    setTimeout(() => {
      
      focusedContent.innerHTML = getFocusedTask(taskContent);
      focusedContent.classList.remove('d-none');
      setTimeout(() => {
        focusedContent.classList.add('active');
      }, 30);
    }, 300);
}

// Returns to the board view by hiding the focused task view and reloading the page.
async function fromFocusedTaskToBoard() {
  let focusedContent = document.getElementById('focusedTask');
  focusedContent.classList.remove('active');
    setTimeout(() => {
      focusedContent.classList.add('d-none');
      focusedContent.innerHTML = '';
      location.reload();
    }, 300);
}

// Switches from the focused task view to the task editing view.
function fromFocusedToEditTask(taskId) {
  let editContent = document.getElementById('editTask');
  let focusedContent = document.getElementById('focusedTask');
  focusedContent.classList.remove('active');
    setTimeout(() => {
      focusedContent.classList.add('d-none');
      editContent.classList.remove('d-none');
      setTimeout(() => {
        editContent.classList.add('active');
        editContent.innerHTML = getEditTaskData(taskId);
      }, 30);
    }, 300);
}

// Returns from the task editing view to the focused task view.
async function fromEditToFocusedTask() {
  let focusedContent = document.getElementById('focusedTask');
  let editContent = document.getElementById('editTask');
  editContent.classList.remove('active');
  setTimeout(() => {
    editContent.classList.add('d-none');
    focusedContent.classList.remove('d-none');
    // Timeout auf 30ms erhöhen, damit das Einfaden sichtbar wird
    setTimeout(() => {
      focusedContent.classList.add('active');
    }, 30);
  }, 300);
}

// Returns from the task editing view to the board view.
async function fromEditTaskToBoard() {
  let editContent = document.getElementById('editTask');
  editContent.classList.remove('active');
  setTimeout(() => {
    editContent.classList.add('d-none');
  }, 300);
}