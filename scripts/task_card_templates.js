function taskCardTemplate(taskContent) {
  let { label, fitLabelForCSS, title, description, totalSubtasks, completedSubtasks, progressPercentage, showProgress } = getTaskData(taskContent);

  return /*html*/ `
    <div class="board-task draggable" draggable="true" data-task-id="${taskContent.taskId}" onclick="renderFocusedTask('${taskContent.taskId}')">
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

function focusedTaskTemplate(taskContent) {
  let { label, fitLabelForCSS, title, description, totalSubtasks, completedSubtasks, progressPercentage, showProgress } = getTaskData(taskContent);
  return /*html*/`
  <div class="board-focused-task draggable" draggable="true" data-task-id="${taskContent.taskId}">
  <div class="focused-task-top">
    <label class="${fitLabelForCSS}">${label}</label>
    <svg onclick="backToBoardTable()" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.9998 8.36587L2.0998 13.2659C1.91647 13.4492 1.68314 13.5409 1.3998 13.5409C1.11647 13.5409 0.883138 13.4492 0.699805 13.2659C0.516471 13.0825 0.424805 12.8492 0.424805 12.5659C0.424805 12.2825 0.516471 12.0492 0.699805 11.8659L5.5998 6.96587L0.699805 2.06587C0.516471 1.88254 0.424805 1.6492 0.424805 1.36587C0.424805 1.08254 0.516471 0.849202 0.699805 0.665869C0.883138 0.482536 1.11647 0.390869 1.3998 0.390869C1.68314 0.390869 1.91647 0.482536 2.0998 0.665869L6.9998 5.56587L11.8998 0.665869C12.0831 0.482536 12.3165 0.390869 12.5998 0.390869C12.8831 0.390869 13.1165 0.482536 13.2998 0.665869C13.4831 0.849202 13.5748 1.08254 13.5748 1.36587C13.5748 1.6492 13.4831 1.88254 13.2998 2.06587L8.3998 6.96587L13.2998 11.8659C13.4831 12.0492 13.5748 12.2825 13.5748 12.5659C13.5748 12.8492 13.4831 13.0825 13.2998 13.2659C13.1165 13.4492 12.8831 13.5409 12.5998 13.5409C12.3165 13.5409 12.0831 13.4492 11.8998 13.2659L6.9998 8.36587Z" fill="#2A3647"/>
    </svg>
  </div>
  <div>
      <h1>${title}</h1>
      <p>${description}</p>
  </div>
  ${showProgress ? `
    <div class="focused-subtask-progress-container">
      <div class="focused-subtask-progress-bar">
        <div class="subtask-inner-progress-bar" style="width: ${progressPercentage}%;"></div>
      </div>
      <div class="focused-subtask-progress-text">
          <span>${completedSubtasks}/${totalSubtasks}</span>
          <span>Subtasks</span>
      </div>
    </div>
  ` : ''}
      <div class="focused-assignees-container">
          ${getAssignees(taskContent)}
      </div>
      <div class="focused-task-info-line">
        <div class="bullet-point">Priority:</div>
        <div class="${taskContent.priority}"></div>
      </div>
</div>
`;
  
}

// Function to create an HTML template for displaying assignee initials
function assigneeTemplate(assigneeInitials, firstLetterLowerCase) {
  return `<div class="assignee-initials ${firstLetterLowerCase}">${assigneeInitials}</div>`;
}
