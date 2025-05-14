// Retrieves the task data for editing and generates the corresponding HTML
function getEditTaskData(taskId) {
    let taskContent = getTaskContent(taskId, kanbanData);
    if (!taskContent) {
        return `<div>Error: Task not found</div>`;
    }

    const editTaskHTML = renderEditTask(taskContent, taskId);
    return editTaskHTML;
}

// Loads the Kanban data from either localStorage (for guests) or Firebase (for logged-in users)
async function getKanbanData() {
    try {
        if (localStorage.getItem("isGuest") === "true") {
            kanbanData = await fetchGuestKanbanData();
        } else {
            kanbanData = await fetchKanbanData(BASE_URL);
        }

        // Initialisiere subtasks, falls nicht vorhanden
        if (!kanbanData.subtasks) {
            kanbanData.subtasks = {};
        }

        if (!kanbanData || Object.keys(kanbanData).length === 0) {
            console.error("Kanban data could not be loaded or is empty.");
        }
    } catch (error) {
        console.error("Error loading Kanban data:", error);
    }
}
