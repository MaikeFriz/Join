/**
 * Returns the HTML template for a single task preview card on the board.
 * @param {Object} taskContent - The task content object.
 * @returns {string} The HTML string for the task preview card.
 */
function previewTaskTemplate(taskContent) {
  let { label, fitLabelForCSS, title, description, totalSubtasks, completedSubtasks, progressPercentage, showProgress } = getTaskData(taskContent);

  return /*html*/ `
    <div class="board-preview-task draggable" draggable="true" data-task-id="${taskContent.taskId}" onclick=" refreshBoardSilent(); renderFocusedTask('${taskContent.taskId}')">
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
        <div class="preview-task-bottom">
            <div class="preview-assignees-list" id="preview-assignees-list">
                ${getAssignees(taskContent, "preview")}
            </div>
            <div class="${taskContent.priority}"></div>
        </div>
    </div>
  `;
}

/**
 * Returns the HTML template for a single assignee in the preview card.
 * @param {string} initials - The initials of the assignee.
 * @param {string} cssClass - The CSS class for the assignee.
 * @returns {string} The HTML string for the assignee.
 */
function previewAssigneeTemplate(initials, cssClass) {
  return /*html*/`
    <div class="assignee-initials ${cssClass}">${initials}</div>
  `;
}
