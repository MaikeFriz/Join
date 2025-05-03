// Retrieves and formats the task data for editing.
function getEditTaskData(taskId) {
    console.log(`Loading edit task template for taskId: ${taskId}`);
  
    let taskContent = getTaskContent(taskId, kanbanData); // Wird später verändert
    if (!taskContent) {
      return `<div>Error: Task not found</div>`;
    }
  
    const editTaskHTML = renderEditTask(taskContent, taskId);
  
    return editTaskHTML;
  }
  
// Fetches Kanban data from the server or local storage based on user type.
  async function getKanbanData() {
    try {
      if (localStorage.getItem("isGuest") === "true") {
        kanbanData = await fetchGuestKanbanData();
      } else {
        kanbanData = await fetchKanbanData(BASE_URL);
      }
      if (!kanbanData || Object.keys(kanbanData).length === 0) {
        console.error("Kanban data could not be loaded or is empty.");
      }
    } catch (error) {
      console.error("Error loading Kanban data:", error);
    }
  }
