function getEditTaskData(taskId) {

  const taskContent = getTaskContent(taskId, kanbanData);
  if (!taskContent) {
    return `<div>Error: Task not found</div>`;
  }
  const { label, fitLabelForCSS, title, description, createAt, priority } = getTaskData(taskContent);
  const displayedDueDate = createAt ? formatDateForInput(createAt) : '';
  const html = editTaskTemplate(displayedDueDate, label, fitLabelForCSS, title, description, createAt, priority);
  setTimeout(() => setPriorityActive(priority), 0);

  return html;
}
   
function editTaskTemplate(displayedDueDate, label, fitLabelForCSS, title, description, createAt, priority) {
  return /*html*/`
      <div class="edit-task" onclick="closeDropdownOnOutsideClick(event)">
        <div class="focused-task-top">
          <div></div>
          <svg onclick="backToFocusedTask()" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        
            <div class="bullet-point">Category</div>
            <div class="category_div">
              ${editCategoryTemplate(kanbanData)}
            </div>        
        
            <div class="bullet-point">Subtasks</div>
            <label class="input_label focus_blue_border">
              <input id="input_subtask" type="text" placeholder="Add new subtask" />
              <button type="button" id="button_add_subtask">
                <img id="add_icon" src="./assets/img/add_icon.svg" alt="Add" />
                <div id="input_icons" class="input-icons">
                  <img id="clear_icon" src="./assets/img/clear_symbol.svg" alt="Clear" />
                  <div class="separator_subtasks">|</div>
                  <img id="check_icon" src="./assets/img/check_dark.svg" alt="Check" />
                </div>
              </button>
            </label>
            <ul id="display_subtasks" class="display_subtasks"></ul>
          </div>
        </div>
        <div class="triangle">
          <div class="triangle-bottom"></div>
        </div>
          
        <div class="ok-button">
          <button type="button" class="clear_button_div" onclick="clearAllInputs()">
            <p>Ok</p>
            <svg width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.55 15.65L18.03 7.175a.875.875 0 0 1 1.238 1.238l-9.2 9.2a.875.875 0 0 1-1.238 0l-4.3-4.3a.875.875 0 0 1 1.238-1.238l3.55 3.575z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>    
    `;
}

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

function editAssignedToTemplate(kanbanData) {
  return /*html*/`
    <div class="dropdown_assigned_to" id="dropdown_assigned_to" tabindex="0" onclick="toggleDropdown()">
      <span id="dropdown_selected_assignee">Select a person</span>
      <img src="./assets/img/arrow_drop_down.svg" alt="dropdown arrow" class="dropdown_arrow" />
    </div>
    <div class="dropdown_options_assignee" id="dropdown_options_assignee"></div>
    <div class="dropdown-edit-assigned-to" id="dropdown_edit_assigned_to">
      ${getEditAssignees(kanbanData)}
    </div>
  `;
}

function editAssignedToDropdownTemplate(name, initials, cssClass, userIndex) {
  return /*html*/`    
    <div class="dropdown-edit-assignee">
      <div class="dropdown-edit-assignee-initials ${cssClass} initials-circle">${initials}</div>
      <div class="dropdown-edit-assignee-name">${name}</div>
      <label class="svg-edit-checkbox">
        <input type="checkbox" class="checkbox-toggle" id="assignee_${userIndex}"
          onchange="handleAssigneeSelection('${userIndex}', this.checked)" />
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

function editCategoryTemplate() {
  return /*html*/`
    <div class="dropdown_category" id="dropdown_category" tabindex="0">
                <span id="dropdown_selected">Select task category</span>
                <img src="./assets/img/arrow_drop_down.svg" alt="dropdown arrow" class="dropdown_arrow" />
              </div>

              <div class="dropdown_options">
                <div class="custom-dropdown-option" data-value="User Story">User Story</div>
                <div class="custom-dropdown-option" data-value="Technical task">Technical task</div>
                <div class="custom-dropdown-option" data-value="HTML">HTML</div>
                <div class="custom-dropdown-option" data-value="Javascript">Javascript</div>
                <div class="custom-dropdown-option" data-value="CSS">CSS</div>
              </div>
              <input class="focus_blue_border" type="hidden" id="category" name="category" required />
              `;
}



function toggleDropdown() {
  const dropdown = document.getElementById("dropdown_edit_assigned_to");
  const trigger = document.getElementById("dropdown_assigned_to");

  if (dropdown.classList.contains("show")) {
    dropdown.classList.remove("show");
    trigger.classList.remove("dropdown_open"); // Entfernt die Klasse, wenn geschlossen
  } else {
    dropdown.classList.add("show");
    trigger.classList.add("dropdown_open"); // Fügt die Klasse hinzu, wenn geöffnet
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const taskId = "exampleTaskId";
    const taskContent = getTaskContent(taskId, kanbanData);

    if (taskContent) {
      const { priority } = getTaskData(taskContent);
      setPriorityActive(priority);
    }
    initializePriorityButtons();
  }, 0);
});

function setPriorityActive(priority) {
  const priorityMap = {
    urgent: 'edit_urgent_button',
    medium: 'edit_medium_button',
    low: 'edit_low_button'
  };

  const buttonId = priorityMap[priority];
  if (buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.classList.add('active');
    } else {
      console.error(`Button mit ID "${buttonId}" nicht gefunden.`);
    }
  } else {
    console.error(`Keine passende ID für die Priorität "${priority}" gefunden.`);
  }
}

function initializePriorityButtons() {
  const buttons = document.querySelectorAll(".priority-buttons-div > div");
  if (buttons.length > 0) {
    console.log(`Gefundene Buttons: ${buttons.length}`);
    buttons.forEach((button) => {
      console.log(`Füge Event-Listener zu Button mit ID ${button.id} hinzu.`);
      button.addEventListener("click", () => handleButtonClick(button));
    });
    console.log("Event-Listener für Prioritätsbuttons hinzugefügt.");
  }
}

function handleButtonClick(clickedButton) {
  const buttons = document.querySelectorAll(".priority-buttons-div > div"); // Alle Buttons in der Priority-Gruppe

  buttons.forEach((button) => {
    if (button.classList.contains("active")) {
      button.classList.remove("active");
    }
  });
  clickedButton.classList.add("active");
}

async function getKanbanData() {
  try {
    if (localStorage.getItem("isGuest") === "true") {
      kanbanData = await fetchGuestKanbanData();
    } else {
      kanbanData = await fetchKanbanData(BASE_URL);
    }
    if (!kanbanData || Object.keys(kanbanData).length === 0) {
      console.log("Das kanbanData-Objekt konnte nicht geladen werden oder ist leer.");
    } else {
      console.log("Kanban-Daten erfolgreich geladen.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kanban-Daten:", error);
  }
}

function getAssigneeInitals(name) {
  if (!name || typeof name !== "string") {
    console.warn("Ungültiger Name:", name);
    return "??";
  }
  const nameParts = name.split(" ");
  const initials = nameParts.map(part => part[0].toUpperCase()).join('');
  return initials;
}

function getEditAssignees(kanbanData) {
  if (!kanbanData || !kanbanData.users) {
    console.error("Keine Benutzer im Kanban-Datenobjekt gefunden.");
    return '';
  }
  let assigneesHTML = '';
  const users = Object.values(kanbanData.users);
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    const name = users[userIndex].name;
    const initials = getAssigneeInitals(name);
    const cssClass = getFitAssigneesToCSS(name);

    assigneesHTML += editAssignedToDropdownTemplate(name, initials, cssClass, userIndex);
  }
  return assigneesHTML;
}


function closeDropdownOnOutsideClick(event) {
  closeAssignedToDropdown(event);
  closeCategoryDropdown(event);
}

function closeAssignedToDropdown(event) {
  const assignedDropdown = document.getElementById("dropdown_edit_assigned_to");
  const assignedTrigger = document.getElementById("dropdown_assigned_to");

  if (
    assignedDropdown &&
    assignedTrigger &&
    !assignedDropdown.contains(event.target) &&
    !assignedTrigger.contains(event.target)
  ) {
    assignedDropdown.classList.remove("show");
    assignedTrigger.classList.remove("dropdown_open");
  }
}

function closeCategoryDropdown(event) {
  const categoryDropdown = document.getElementById("dropdown_options_category");
  const categoryTrigger = document.getElementById("dropdown_category");

  if (
    categoryDropdown &&
    categoryTrigger &&
    !categoryDropdown.contains(event.target) &&
    !categoryTrigger.contains(event.target)
  ) {
    categoryDropdown.classList.remove("show");
    categoryTrigger.classList.remove("dropdown_open");
  }
}

function editCategoryTemplate() {
  return /*html*/`
    <div class="dropdown_category" id="dropdown_category" tabindex="0" onclick="toggleCategoryDropdown()">
      <span id="dropdown_selected_category">Select task category</span>
      <img src="./assets/img/arrow_drop_down.svg" alt="dropdown arrow" class="dropdown_arrow" />
    </div>
    <div class="dropdown-options-category" id="dropdown_options_category">
      ${getCategoryOptions()}
    </div>
  `;
}

function getCategoryOptions() {
  const categories = ["User Story", "Technical task", "HTML", "Javascript", "CSS"];
  return categories
    .map(
      (category) =>
        `<div class="custom-dropdown-option" data-value="${category}" onclick="selectCategory('${category}')">${category}</div>`
    )
    .join("");
}

function toggleCategoryDropdown() {
  const dropdown = document.getElementById("dropdown_options_category");
  const trigger = document.getElementById("dropdown_category");

  if (dropdown.classList.contains("show")) {
    dropdown.classList.remove("show");
    trigger.classList.remove("dropdown_open");
  } else {
    dropdown.classList.add("show");
    trigger.classList.add("dropdown_open");
  }
}

function selectCategory(category) {
  const selectedCategory = document.getElementById("dropdown_selected_category");
  const dropdown = document.getElementById("dropdown_options_category");
  const trigger = document.getElementById("dropdown_category");

  selectedCategory.textContent = category;
  dropdown.classList.remove("show");
  trigger.classList.remove("dropdown_open");
}








