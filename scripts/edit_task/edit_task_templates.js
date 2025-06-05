/**
 * Generates the HTML template for the edit task modal.
 * @param {string} displayedDueDate - The formatted due date.
 * @param {string} label - The label for the task.
 * @param {string} fitLabelForCSS - The CSS class for the label.
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} createAt - The creation date.
 * @param {string} priority - The task priority.
 * @param {string} taskId - The task ID.
 * @returns {string} The HTML string for the edit task modal.
 */
function editTaskTemplate(displayedDueDate, label, fitLabelForCSS, title, description, createAt, priority, taskId) {
  return /*html*/`
      <div class="edit-task" onclick="closeDropdownOnOutsideClick(event)">
        <div class="focused-task-top">
          <div></div>
          <div></div>
          <svg onclick="fromEditToFocusedTask()" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.9998 8.36587L2.0998 13.2659C1.91647 13.4492 1.68314 13.5409 1.3998 13.5409C1.11647 13.5409 0.883138 13.4492 0.699805 13.2659C0.516471 13.0825 0.424805 12.8492 0.424805 12.5659C0.424805 12.2825 0.516471 12.0492 0.699805 11.8659L5.5998 6.96587L0.699805 2.06587C0.516471 1.88254 0.424805 1.6492 0.424805 1.36587C0.424805 1.08254 0.516471 0.849202 0.699805 0.665869C0.883138 0.482536 1.11647 0.390869 1.3998 0.390869C1.68314 0.390869 1.91647 0.482536 2.0998 0.665869L6.9998 5.56587L11.8998 0.665869C12.0831 0.482536 12.3165 0.390869 12.5998 0.390869C12.8831 0.390869 13.1165 0.482536 13.2998 0.665869C13.4831 0.849202 13.5748 1.08254 13.5748 1.36587C13.5748 1.6492 13.4831 1.88254 13.2998 2.06587L8.3998 6.96587L13.2998 11.8659C13.4831 12.0492 13.5748 12.2825 13.5748 12.5659C13.5748 12.8492 13.4831 13.0825 13.2998 13.2659C13.1165 13.4492 12.8831 13.5409 12.5998 13.5409C12.3165 13.5409 12.0831 13.4492 11.8998 13.2659L6.9998 8.36587Z" fill="#2A3647"/>
          </svg>
        </div>
        <div class="triangle">
          <div class="triangle-top"></div>
        </div>
        <div class="scrollable-container">
          <div class="scrollable-area">
            <div class="bullet-point">Title</div>
            <label class="input_label input_div_left input-title">
              <input id="edit_input_title" type="text" value="${title}" />
            </label>
            <div class="bullet-point">Description</div>
            <label class="input_label input_div_left textarea-container">
              <textarea id="edit_input_description" class="textarea-with-icon" type="text">${description}</textarea>
              <svg class="resize-icon" width="19" height="19" viewBox="0  0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.9 0V1.69C18.9017 2.31796 18.7788 2.94002 18.5385 3.52019C18.2982 4.10036 17.9452 4.62712 17.5 5.07L5.07 17.5C4.62712 17.9452 4.10036 18.2982 3.52019 18.5385C2.94002 18.7788 2.31796 18.9017 1.69 18.9H0L18.9 0Z" fill="#D1D1D1"/>
                <path d="M18.9001 6.31006V8.00006C18.9006 8.62786 18.7772 9.2496 18.537 9.82961C18.2967 10.4096 17.9444 10.9365 17.5001 11.3801L11.3801 17.5001C10.9365 17.9444 10.4096 18.2967 9.82961 18.537C9.2496 18.7772 8.62786 18.9006 8.00006 18.9001H6.31006L18.9001 6.31006Z" fill="#D1D1D1"/>
                <path d="M18.8999 12.4302V14.1202C18.9005 14.748 18.7771 15.3697 18.5369 15.9497C18.2966 16.5297 17.9442 17.0566 17.4999 17.5002C17.0564 17.9445 16.5295 18.2969 15.9495 18.5371C15.3695 18.7773 14.7477 18.9007 14.1199 18.9002H12.4299L18.8999 12.4302Z" fill="#D1D1D1"/>
              </svg>
            </label>
            <div class="bullet-point">Due Date</div>
            <label class="input_label input_label_calender input_div_left">
              <input type="date" required value="${displayedDueDate}" />
            </label>
            <div class="bullet-point">Priority</div>
            <div id="edit_priority_buttons" class="priority-buttons-div">
              ${editPriorityTemplate()}
            </div>
            <div class="bullet-point">Assigned to</div>
            <div class="assigned_to_div">
              ${editAssignedToTemplate(kanbanData)} 
            </div>
            <div class="edit-assigned-users"></div>
            <div class="bullet-point">Category</div>
            <div class="category_div">
              ${editCategoryTemplate(kanbanData)}
            </div>  
            <div class="edit-selected-categories"></div>      
            <div class="bullet-point">Subtasks</div>
            <label class="input_label focus_blue_border">
              <input id="input_edit_subtask" class="input-edit-subtask" type="text" placeholder="Add new subtask" />
              <button type="button" id="button_add_subtask" onclick="addEditSubtask()">
                <img id="add_icon" src="./assets/img/add_icon.svg" alt="Add" />
              </button>
            </label>
            <div id="display_subtasks" class="display-edit-subtasks"></div>
          </div>
        </div>
        <div class="triangle">
          <div class="triangle-bottom"></div>
        </div>
        <div class="ok-button">
          <button type="button" class="clear_button_div" onclick="onSaveEditTask('${taskId}')">
            <p>Ok</p>
            <svg width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.55 15.65L18.03 7.175a.875.875 0 0 1 1.238 1.238l-9.2 9.2a.875.875 0 0 1-1.238 0l-4.3-4.3a.875.875 0 0 1 1.238-1.238l3.55 3.575z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>   
    `;
}

/**
 * Generates the HTML template for priority buttons.
 * @returns {string} The HTML string for the priority buttons.
 */
function editPriorityTemplate() {
  return /*html*/`
    <div id="edit_urgent_button" class="urgent_button" onclick="handleButtonClick(this)">
      <p>Urgent</p>
      <svg class="urgent_symbol" width="21" height="16" viewBox="0 0 21 16">
        <path d="M19.65 15.25c-.23 0-.46-.07-.65-.21L10.75 8.96 2.5 15.04c-.23.17-.52.23-.81.2s-.52-.15-.73-.32c-.21-.18-.37-.41-.46-.66-.1-.26-.12-.53-.08-.79.04-.29.2-.55.44-.73L10.1 6.71c.19-.14.42-.22.65-.22s.46.08.65.22l8.9 6.57c.19.14.33.34.4.57.08.22.07.46 0 .68-.07.23-.2.42-.39.57-.19.15-.42.22-.66.22z" />
        <path d="M19.65 9.5c-.23 0-.46-.07-.65-.21L10.75 3.21 2.5 9.29c-.23.17-.52.23-.81.2s-.52-.15-.73-.32c-.21-.18-.37-.41-.46-.66-.1-.26-.12-.53-.08-.79.04-.29.2-.55.44-.73L10.1.96c.19-.14.42-.22.65-.22s.46.08.65.22l8.9 6.57c.19.14.33.34.4.57.08.22.07.46 0 .68-.07.23-.2.42-.39.57-.19.15-.42.22-.66.22z" />
      </svg>
    </div>
    <div id="edit_medium_button" class="medium_button" onclick="handleButtonClick(this)">
      <p>Medium</p>
      <svg class="medium_symbol" width="21" height="8" viewBox="0 0 21 8">
        <path d="M19.76 7.92H1.95a1.1 1.1 0 1 1 0-2.21h17.81a1.1 1.1 0 1 1 0 2.21Z" />
        <path d="M19.76 2.67H1.95A1.1 1.1 0 1 1 1.95.47h17.81a1.1 1.1 0 1 1 0 2.21Z" />
      </svg>
    </div>
    <div id="edit_low_button" class="low_button" onclick="handleButtonClick(this)">
      <p>Low</p>
      <svg class="low_symbol" width="21" height="16" viewBox="0 0 21 16">
        <path d="M10.25 9.51a1 1 0 0 1-.65-.22L0.69 2.72a1 1 0 0 1 .49-1.76 1 1 0 0 1 1.06.22l8 6 8-6a1 1 0 0 1 1.56 1.21l-8.9 6.57a1 1 0 0 1-.65.22Z" />
        <path d="M10.25 15.25a1 1 0 0 1-.65-.21L0.69 8.47a1 1 0 0 1 1.31-1.53l8.25 6.08 8.25-6.08a1 1 0 1 1 1.31 1.53l-8.9 6.57a1 1 0 0 1-.65.21Z" />
      </svg>
    </div>
  `;
}

/**
 * Generates the HTML template for the "Assigned to" dropdown.
 * @param {Object} kanbanData - The kanban data object.
 * @returns {string} The HTML string for the assigned to dropdown.
 */
function editAssignedToTemplate(kanbanData) {
  return /*html*/`
    <div class="dropdown-assigned-to" id="dropdown_assigned_to" tabindex="0" onclick="toggleEditDropdown()">
      <span id="dropdown_selected_assignee">Select a person</span>
      <img src="./assets/img/arrow_drop_down.svg" alt="dropdown arrow" class="dropdown_arrow" />
    </div>
    <div class="dropdown-options-assignee" id="dropdown_options_assignee"></div>
    <div class="dropdown-edit-assigned-to" id="dropdown_edit_assigned_to">
      ${getEditAssignees(kanbanData)}
    </div>
  `;
}

/**
 * Generates the HTML for individual assignee options in the dropdown.
 * @param {string} name - The assignee's name.
 * @param {string} initials - The assignee's initials.
 * @param {string} cssClass - The CSS class for the initials.
 * @param {string} userId - The user ID.
 * @returns {string} The HTML string for the assignee option.
 */
function editAssignedToDropdownTemplate(name, initials, cssClass, userId) {
  return /*html*/`    
    <div class="dropdown-edit-assignee" onclick="if(event.target.tagName !== 'INPUT'){document.getElementById('assignee_${userId}').click();}">
      <div class="dropdown-edit-assignee-initials ${cssClass} initials-circle">${initials}</div>
      <div class="dropdown-edit-assignee-name">${name}</div>
      <label class="svg-edit-checkbox">
        <input type="checkbox" class="checkbox-toggle" id="assignee_${userId}"
          onchange="handleAssigneeSelection('${userId}', this.checked)" />
        <svg class="checkbox-svg unchecked" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="16" height="16" rx="3" class="checkbox-rect" />
        </svg>
        <svg class="checkbox-svg checked" width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12V18C20 19.66 18.66 21 17 21H7C5.34 21 4 19.66 4 18V8C4 6.34 5.34 5 7 5H15" stroke="#2A3647" stroke-width="2" stroke-linecap="round" fill="none"/>
          <path d="M8 13L12 17L20 5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </label>
    </div>
  `;
}

/**
 * Generates the HTML template for the category dropdown.
 * @returns {string} The HTML string for the category dropdown.
 */
function editCategoryTemplate() {
  return /*html*/`
    <div class="dropdown-category" id="dropdown_category" tabindex="0" onclick="toggleCategoryDropdown()">
      <span id="dropdown_selected_category">Select task category</span>
      <img src="./assets/img/arrow_drop_down.svg" alt="dropdown arrow" class="dropdown_arrow" />
    </div>
    <div class="dropdown-options-category" id="dropdown_options_category">
      ${getCategoryOptions()}
    </div>
  `;
}

/**
 * Generates the HTML for a category label.
 * @param {string} label - The category label.
 * @param {string} fitLabelForCSS - The CSS class for the label.
 * @returns {string} The HTML string for the category label.
 */
function editCategoryLabelTemplate(label, fitLabelForCSS) {
  return `
    <div class="category-label-container">
      <span class="category-label ${fitLabelForCSS}">${label}</span>
    </div>
  `;
}

/**
 * Generates the HTML for an individual subtask in the edit modal.
 * @param {string} subtaskId - The subtask ID.
 * @param {Object} subtaskData - The subtask data object.
 * @returns {string} The HTML string for the subtask item.
 */
function editSubtaskTemplate(subtaskId, subtaskData) {
  return `
    <div class="edit-subtask-item" data-id="${subtaskId}">
      <span>${subtaskData.title}</span>
      <svg onclick="removeEditSubtask('${subtaskId}', '${subtaskData.title}', event)" width="18" height="17" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="scale(1.25) translate(-0.5, 0)">
          <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="rgba(42, 54, 71, 0.9)"/>
        </g>
      </svg>
    </div>
  `;
}