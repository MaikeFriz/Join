// Function to toggle visibility of placeholders for columns without tasks
function loadNoTasksFunctions() {
    toggleNoTasksToDoPlaceholder();
    toggleNoInProogressPlaceholder();
    toggleNoAwaitFeedbackPlaceholder();
    toggleNoDonePlaceholder();
}

// Function to toggle visibility of the "No tasks" placeholder in the "To Do" column
function toggleNoTasksToDoPlaceholder() {
  let toDoColumn = document.getElementById('toDoCardsColumn');
  let noToDoPlaceholder = document.getElementById('noToDoTasks');

  if (toDoColumn && noToDoPlaceholder) {
    if (toDoColumn.childElementCount >= 1) {
      noToDoPlaceholder.classList.add('d-none');
    } else {
      noToDoPlaceholder.classList.remove('d-none');
    }
  }
}

// Function to toggle visibility of the "No tasks" placeholder in the "In Progress" column
function toggleNoInProogressPlaceholder() {
    let inProgressColumn = document.getElementById('inProgressCardsColumn');
    let noInProgressPlaceholder = document.getElementById('noInProgressTasks');
  
    if (inProgressColumn && noInProgressPlaceholder) {
      if (inProgressColumn.childElementCount >= 1) {
        noInProgressPlaceholder.classList.add('d-none');
      } else {
        noInProgressPlaceholder.classList.remove('d-none');
      }
    }
  }

// Function to toggle visibility of the "No tasks" placeholder in the "Awaiting Feedback" column
function toggleNoAwaitFeedbackPlaceholder() {
    let awaitFeedbackColumn = document.getElementById('awaitFeedbackCardsColumn');
    let awaitFeedbackPlaceholder = document.getElementById('noAwaitFeedbackTasks');
  
    if (awaitFeedbackColumn && awaitFeedbackPlaceholder) {
      if (awaitFeedbackColumn.childElementCount >= 1) {
        awaitFeedbackPlaceholder.classList.add('d-none');
      } else {
        awaitFeedbackPlaceholder.classList.remove('d-none');
      }
    }
  }

// Function to toggle visibility of the "No tasks" placeholder in the "Done" column
function toggleNoDonePlaceholder() {
    let doneColumn = document.getElementById('doneCardsColumn');
    let donePlaceholder = document.getElementById('noDoneTasks');
  
    if (doneColumn && donePlaceholder) {
      if (doneColumn.childElementCount >= 1) {
        donePlaceholder.classList.add('d-none');
      } else {
        donePlaceholder.classList.remove('d-none');
      }
    }
  }
