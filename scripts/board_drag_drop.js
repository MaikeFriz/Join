document.addEventListener("DOMContentLoaded", () => {
  // Füge Drag-and-Drop-Funktionalität zu allen Spalten hinzu
  const taskContainers = document.querySelectorAll(".task-container");

  let draggedTask = null; // Temporäre Variable, um die Aufgabe zu speichern

  taskContainers.forEach((container) => {
    // Aufgaben in den Spalten sind draggable
    container.addEventListener("dragstart", (event) => {
      draggedTask = event.target; // Speichere die Aufgabe
      event.target.classList.add("dragging");
    });

    container.addEventListener("dragend", (event) => {
      event.target.classList.remove("dragging");
      draggedTask = null; // Leere die temporäre Variable
    });

    // Erlaubt das Ablegen innerhalb der Spalten
    container.addEventListener("dragover", (event) => {
      event.preventDefault(); // Standardverhalten verhindern
    });

    // Aufgabe wird in die neue Spalte verschoben
    container.addEventListener("drop", (event) => {
      event.preventDefault(); // Standardverhalten verhindern

      if (draggedTask) {
        container.appendChild(draggedTask); // Aufgabe in die Zielspalte verschieben
        updateTaskStatus(draggedTask.dataset.taskId, container.id); // Status aktualisieren
      }
    });
  });
});

// Funktion, um den Status der Aufgabe zu aktualisieren
function updateTaskStatus(taskId, newStatusColumnId) {
  const newStatus = mapColumnIdToStatus(newStatusColumnId);

  // Hier könntest du den neuen Status in deiner Datenbank speichern
  console.log(`Task ID: ${taskId} wurde in Status ${newStatus} verschoben.`);
}

// Funktion, um die Spalten-ID in den tatsächlichen Status zu übersetzen
function mapColumnIdToStatus(columnId) {
  const columnStatusMap = {
    toDoCardsColumn: "toDo",
    inProgressCardsColumn: "inProgress",
    awaitFeedbackCardsColumn: "awaitingFeedback",
    doneCardsColumn: "done",
  };
  return columnStatusMap[columnId];
}
