// Displays a focused task view, transitioning from the board content.
function renderFocusedTask(taskId) {
  let taskContent = getTaskContent(taskId, kanbanData);
  if (!taskContent) return;
  let boardContent = document.getElementById('boardContent');
  let focusedContent = document.getElementById('focusedTask');
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    focusedContent.innerHTML = getFocusedTask(taskContent);
    focusedContent.classList.remove('d-none');
    
    focusedContent.onclick = function(event) {
      const card = focusedContent.querySelector('.focused-task');
      if (card && !card.contains(event.target)) {
        fromFocusedTaskToBoard();
      }
    };
    setTimeout(() => {
      const card = focusedContent.querySelector('.focused-task');
      if (card) card.classList.add('active');
    }, 30);
  }, 300);
}

// Returns to the board view by hiding the focused task view and reloading the page.
async function fromFocusedTaskToBoard() {
  let focusedContent = document.getElementById('focusedTask');
  const card = focusedContent.querySelector('.focused-task');
  if (card) card.classList.remove('active');

  document.body.style.overflow = '';

  setTimeout(() => {
    focusedContent.classList.add('d-none');
    focusedContent.innerHTML = '';
    [
      'toDoCardsColumn',
      'awaitFeedbackCardsColumn',
      'doneCardsColumn',
      'inProgressCardsColumn'
    ].forEach(id => {
      const col = document.getElementById(id);
      if (col) col.classList.add('d-none');
    });
    location.reload();
  }, 300);
}

// Switches from the focused task view to the task editing view.
function fromFocusedToEditTask(taskId) {
  let editContent = document.getElementById('editTask');
  let focusedContent = document.getElementById('focusedTask');
  const focusedCard = focusedContent.querySelector('.focused-task');
  if (focusedCard) focusedCard.classList.remove('active');
  setTimeout(() => {
    focusedContent.classList.add('d-none');
    editContent.classList.remove('d-none');
    editContent.innerHTML = getEditTaskData(taskId);
    editContent.onclick = function(event) {
      const card = editContent.querySelector('.edit-task');
      if (card && !card.contains(event.target)) {
        fromEditTaskToBoard();
      }
    };

    setTimeout(() => {
      const card = editContent.querySelector('.edit-task');
      if (card) card.classList.add('active');
    }, 30);
  }, 300);
}

// Returns from the task editing view to the focused task view.
async function fromEditToFocusedTask() {
  let focusedContent = document.getElementById('focusedTask');
  let editContent = document.getElementById('editTask');
  const editCard = editContent.querySelector('.edit-task');
  if (editCard) editCard.classList.remove('active');
  setTimeout(() => {
    editContent.classList.add('d-none');
    focusedContent.classList.remove('d-none');
    setTimeout(() => {
      const focusedCard = focusedContent.querySelector('.focused-task');
      if (focusedCard) focusedCard.classList.add('active');
    }, 30);
  }, 300);
}

// Returns from the task editing view to the board view.
async function fromEditTaskToBoard() {
  let editContent = document.getElementById('editTask');
  const editCard = editContent.querySelector('.edit-task');
  if (editCard) editCard.classList.remove('active');

  setTimeout(() => {
    editContent.classList.add('d-none');
    editContent.innerHTML = '';
    [
      'toDoCardsColumn',
      'awaitFeedbackCardsColumn',
      'doneCardsColumn',
      'inProgressCardsColumn'
    ].forEach(id => {
      const col = document.getElementById(id);
      if (col) col.classList.add('d-none');
    });
    location.reload();
  }, 300);
}

async function onSaveEditTask(taskId) {
  await saveEditedTask(taskId); // wartet auf alle Save- und Lösch-Operationen
  // Jetzt ist alles sicher gespeichert!
  fromEditTaskToBoard(); // Modal schließen oder Board neu rendern
}