// Renders the subtasks for a given task by generating HTML based on their data
function renderSubtasks(subtaskRefs, allSubtasks) {
  if (!subtaskRefs || !allSubtasks) return "<div>No Subtasks</div>";
  const titles = Object.keys(subtaskRefs).map(subtaskId => {
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
function updateSubtaskInDatabase(subtaskId, isChecked) {
  const url = `${BASE_URL}subtasks/${subtaskId}/completed.json`;
  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(isChecked)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error updating subtask');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Update error:', error);
  });
}

// Toggles the completion status of a subtask and delegates to the appropriate function
function toggleSubtaskCompletion(subtaskId, isChecked) {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));

  if (isGuest) {
    updateSubtaskForGuest(subtaskId, isChecked);
  } else {
    updateSubtaskInDatabase(subtaskId, isChecked);
  }
}



