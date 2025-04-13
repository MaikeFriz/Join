// Displays a focused task view, transitioning from the board content.
function renderFocusedTask(taskId) {
  let taskContent = getTaskContent(taskId, kanbanData);
  if (!taskContent) return;
  let boardContent = document.getElementById('boardContent');
  let focusedContent = document.getElementById('focusedTask');
  boardContent.classList.remove('active');
  logoutButton.classList.add('d-none');
    setTimeout(() => {
      boardContent.classList.add('d-none');
      focusedContent.innerHTML = getFocusedTask(taskContent);
      focusedContent.classList.remove('d-none');
      setTimeout(() => {
        focusedContent.classList.add('active');
      }, 10);
    }, 300);
}

// Returns to the board view by hiding the focused task view and reloading the page.
async function backToBoardTable() {
  let focusedContent = document.getElementById('focusedTask');
  focusedContent.classList.remove('active');
    setTimeout(() => {
      focusedContent.classList.add('d-none');
      focusedContent.innerHTML = '';
      location.reload();
    }, 300);
}

// Formats a given ISO date string into the format "DD/MM/YYYY".
function formatDate(isoDate) {
  let date = new Date(isoDate);
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Switches from the focused task view to the task editing view.
function renderEditTask(taskId) {
  let editContent = document.getElementById('editTask');
  let focusedContent = document.getElementById('focusedTask');
  focusedContent.classList.remove('active');
    setTimeout(() => {
      focusedContent.classList.add('d-none');
      editContent.classList.remove('d-none');
      setTimeout(() => {
        editContent.classList.add('active');
        editContent.innerHTML = editTaskTemplate(taskId);
      }, 10);
    }, 300);
}


// Returns from the task editing view to the focused task view.
async function backToFocusedTask() {
  let focusedContent = document.getElementById('focusedTask');
  let editContent = document.getElementById('editTask');
  editContent.classList.remove('active');
    setTimeout(() => {
      editContent.classList.add('d-none');
      focusedContent.classList.remove('d-none');
        setTimeout(() => {
          focusedContent.classList.add('active');
        }, 10);
    }, 300);
}
