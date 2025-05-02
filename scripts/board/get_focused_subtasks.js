function renderSubtasks(subtaskRefs, allSubtasks) {
  if (!subtaskRefs || !allSubtasks) return "<div>Keine Subtasks</div>";
  const titles = Object.keys(subtaskRefs).map(subtaskId => {
    const subtask = allSubtasks[subtaskId];
    if (!subtask) return "";
    const isChecked = subtask.completed ? "checked" : "";
    return focusedSubtaskTemplate(subtask, isChecked, subtaskId); 
  });

  return titles.join("");
}

function toggleSubtaskCompletion(subtaskId, isChecked) {
  const url = `${BASE_URL}subtasks/${subtaskId}/completed.json`;
  fetch(url, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'
    },
    body: JSON.stringify(isChecked)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren des Subtasks');
    }
    return response.json();
  })
  .then(data => {
    console.log(`Subtask ${subtaskId} erfolgreich aktualisiert:`, data);
  })
  .catch(error => {
    console.error('Update-Fehler:', error);
  });
}



