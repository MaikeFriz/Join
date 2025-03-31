function taskCardTemplate(taskContent) {
  console.log("Task-Daten in Template:", taskContent); // Debugging
  let { label, fitLabelForCSS, title, description, totalSubtasks, completedSubtasks, progressPercentage, showProgress } = getTaskData(taskContent);

  return /*html*/ `
    <div class="board-task draggable" draggable="true" data-task-id="${taskContent.taskId}">
        <label class="${fitLabelForCSS}">${label}</label>
        <div>
            <h3 id="task-title">${title}</h3>
            <p id="task-description">${description}</p>
        </div>
        ${showProgress ? `
          <div class="subtask-progress-container">
            <div class="subtask-progress-bar">
              <div class="subtask-inner-progress-bar" style="width: ${progressPercentage}%;"></div>
            </div>
            <div class="subtask-progress-text">
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

// Function to create an HTML template for displaying assignee initials
function assigneeTemplate(assigneeInitials, firstLetterLowerCase) {
  return `<div class="assignee-initials ${firstLetterLowerCase}">${assigneeInitials}</div>`;
}
