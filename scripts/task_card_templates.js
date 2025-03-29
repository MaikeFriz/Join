function taskCardTemplate(taskContent) {
  console.log("Task-Daten in Template:", taskContent); // Debugging
  let { label, fitLabelForCSS, title, description, totalSubtasks, completedSubtasks, progressPercentage, showProgress } = getTaskData(taskContent);

  return /*html*/ `
    <div class="board-task draggable" draggable="true" data-task-id="${taskContent.taskId}">
        <label class="${fitLabelForCSS}">${label}</label>
        <div>
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
        ${showProgress ? `
        <div class="subtask_progress_container">
          <div class="subtask_progress_bar" style="width: ${progressPercentage}%;"></div>
          <div class="subtask_progress_text">
            <span>${completedSubtasks}/${totalSubtasks}</span>
            <span>Subtasks</span>
          </div>
        </div>
        ` : ''}
        <div class="review-task-bottom">
            <div class="assignees-container">
                ${getAssignees(taskContent)}
            </div>
            <div class="${taskContent.priority}"></div>
        </div>
    </div>
  `;
}
