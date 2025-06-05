/**
 * Returns HTML for a single subtask element with edit and delete buttons.
 * @param {string} subtaskText - The text of the subtask.
 * @returns {string} The HTML string for the subtask element.
 */
function getSubtaskElementHTML(subtaskText) {
  return `
    <span class="subtask-text">${subtaskText}</span>
    <div class="hover_button_div">
      <button type="button"><img class="delete_button_subtask" src="./assets/img/delete.svg" alt="Delete" /></button>
      <button type="button"><img class="edit_button_subtask" src="./assets/img/edit.svg" alt="Edit" /></button>
    </div>
  `;
}

/**
 * Returns HTML for the edit icons (check and cancel) in the subtask edit mode.
 * @returns {string} The HTML string for the edit icons.
 */
function getEditIconsHTML() {
  return `
    <img class="check-icon" src="./assets/img/check_dark.svg" alt="Save" />
    <div class="separator_subtasks">|</div>
    <img class="clear_icon_show_subtask" src="./assets/img/cancel.svg" alt="Clear" />
  `;
}

/**
 * Returns HTML for a dropdown option for assigning a user, including checkbox and initials.
 * @param {Object} user - The user object.
 * @returns {string} The HTML string for the dropdown option.
 */
function getDropdownOptionHTML(user) {
  const isChecked = assigneesObject[user.id] ? "checked_checkbox.svg" : "checkbox_unchecked.svg";
  const initials = getAssigneeInitials(user.name);
  const firstLetter = user.name[0].toLowerCase();
  return `
    <div class="option_row">
      <div class="name_initials_div">
        <span class="initials-circle ${firstLetter}">${initials}</span> 
        <span class="dropdown-item">${user.name}</span>
      </div>      
      <div class="checkbox-container">
        <img src="./assets/img/${isChecked}" alt="Checkbox" class="checkbox-img">
      </div>
    </div>
  `;
}

/**
 * Returns HTML for an assignee item with initials.
 * @param {string} userId - The user ID.
 * @param {string} userName - The user name.
 * @returns {string} The HTML string for the assignee item.
 */
function createAssigneeTemplate(userId, userName) {
  const initials = getAssigneeInitials(userName);
  const firstLetter = userName[0].toLowerCase();
  return `
<div class="assignee-item" id="assignee-${userId}">
    <span class="initials-circle ${firstLetter}">${initials}</span> 
</div>
  `;
}