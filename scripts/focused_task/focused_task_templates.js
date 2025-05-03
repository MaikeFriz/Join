function getFocusedTask(taskContent) {
    let { label, fitLabelForCSS, title, description, createAt } = getTaskData(taskContent);
  
    let subtaskListHTML = "";
    if (taskContent.subtasks && taskContent.subtasks.length > 0) {
      subtaskListHTML = `
        <ul class="subtask-list">
          ${taskContent.subtasks.map(subtask => `<li>${subtask.title}</li>`).join("")}
        </ul>
      `;
    } else {
      subtaskListHTML = "<p>No subtasks available</p>";
    }
  
    return /*html*/`
  
      <div class="focused-task">
  
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
      
        <div class="triangle">
          <div class="triangle-top"></div>
        </div>
          <div class="scrollable-container">
          
            <div class="scrollable-area">
              <table class="focused-task-table">
                <tr>
                  <td class="bullet-point">Due Date:</td>
                  <td class="focused-task-due-date">${formatDate(createAt)}</td>
                </tr>
                <tr>
                  <td class="bullet-point">Priority:</td>
                  <td class="focused-task-priority">
                    ${taskContent.priority.charAt(0).toUpperCase() + taskContent.priority.slice(1)}
                    <span class="${taskContent.priority}"></span>
                  </td>
                </tr>
              </table>
        
              <div class="focused-assignees-container">
                <div class="bullet-point">Assigned To:</div>
                <div id="focused-assignees-list" class="focused-assignees-list">
                  ${getAssignees(taskContent, "focused")}
                </div>
              </div>
        
              <div class="focused-subtask-container">
                <div class="bullet-point">Subtasks:</div>
                <div>${renderSubtasks(taskContent.subtasks, kanbanData.subtasks)}</div>
              </div>
            </div>
            
          </div>
        <div class="triangle">
          <div class="triangle-bottom"></div>
        </div>

      
        <div class="focused-edit-trash">
  
          <div class="focused-trash" onclick="renderConfirmDialog('${taskContent.taskId}')">
            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
            </svg>
            <div>Delete</div>
          </div>
  
          <div class="focused-separator"></div>
  
          <div class="focused-edit" onclick="getKanbanData(), transitionToEditTask('${taskContent.taskId}')">
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
          </svg>
            <div>Edit</div>
          </div>
  
        </div>
      </div>
    `;
  }

  function focusedAssigneeTemplate(initials, cssClass, fullName) {
    return /*html*/`
  
      <div class="focused-assignee-entry">
      <div class="focused-initial-circle">
        <div class="focused-assignee-initials ${cssClass}">${initials}</div>
      </div>
        <span class="assignee-name">${fullName}</span>
      </div>
    `;
  }
  
  function focusedSubtaskTemplate(subtask, isChecked, subtaskId) {
    return /*html*/`
  
      <div class="focused-subtask-line">
        <label class="svg-checkbox">
          <input
            type="checkbox" class="checkbox-toggle" ${isChecked}
            onchange="toggleSubtaskCompletion('${subtaskId}', this.checked)"/>
          <img src="./assets/img/disabled_checkbox.svg" alt="Unchecked" class="checkbox-icon unchecked" />
          <img src="./assets/img/checked_checkbox.svg" alt="Checked" class="checkbox-icon checked" />
        </label>
        <div>${subtask.title}</div>
      </div>
    `;
  }
  
// Aktualisierung des Delete-Buttons
function confirmDialogTemplate(taskId) {
    return /*html*/`
        <div class="confirm-dialog-window">
            <div>
                <h1>Do you really want to delete this Task?</h1>
            </div>
            <div class="confirm_buttons">
                <button class="confirm-delete-button" onclick="deleteTask('${taskId}')">
                    Delete
                    <svg width="18" height="17" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g transform="scale(1.25) translate(-0.5, 0)">
                            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="rgba(42, 54, 71, 0.9)"/>
                        </g>
                    </svg>
                </button>
                <button class="confirm-cancel-button" onclick="closeConfirmDialog()">
                    Cancel
                    <svg width="27" height="25" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 7L18 18M18 7L7 18" stroke="rgba(42, 54, 71, 1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}
