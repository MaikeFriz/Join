function getSubtaskElementHTML(subtaskText) {
  return `
    <span class="subtask-text">${subtaskText}</span>
    <div class="hover_button_div">
      <button type="button"><img class="delete_button_subtask" src="./assets/img/delete.svg" alt="Delete" /></button>
      <button type="button"><img class="edit_button_subtask" src="./assets/img/edit.svg" alt="Edit" /></button>
    </div>
  `;
}


function getEditIconsHTML() {
  return `
    <img class="check-icon" src="./assets/img/check_dark.svg" alt="Save" />
    <div class="separator_subtasks">|</div>
    <img class="clear_icon_show_subtask" src="./assets/img/cancel.svg" alt="Clear" />
  `;
}


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


function createAssigneeTemplate(userId, userName) {
  const initials = getAssigneeInitials(userName);
  const firstLetter = userName[0].toLowerCase();
  return `
<div class="assignee-item" id="assignee-${userId}">
    <span class="initials-circle ${firstLetter}">${initials}</span> 
</div>
  `;
}