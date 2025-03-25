let assigneesObject = {};

//-------------asignees

document.addEventListener("DOMContentLoaded", initDropdown);
async function initDropdown() {
  try {
    const users = await fetchUsers();
    createDropdownOptions(users);
    setupDropdownEvents();
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

async function fetchUsers() {
  const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json");
  const data = await response.json();
  return Object.entries(data.users).map(([userId, user]) => ({
    id: userId,
    name: user.name,
  }));
}

// Erstellt Dropdown-Optionen.
function createDropdownOptions(users) {
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  dropdownOptions.innerHTML = ""; 

  users.forEach((user) => {
    const option = createDropdownOptionTemplate(user);
    dropdownOptions.appendChild(option);
  });
}

//HTML-Template für einzelne Dropdown-Option.
function createDropdownOptionTemplate(user) {
  const option = document.createElement("div");
  option.classList.add("custom-dropdown-option");
  option.dataset.value = user.name;
  option.dataset.userId = user.id;

  const isChecked = assigneesObject[user.id] ? "checked_checkbox.svg" : "checkbox_unchecked.svg";

  // Initialen berechnen
  const initials = getAssigneeInitials(user.name);
  const firstLetter = user.name[0].toLowerCase();
  option.innerHTML = `
    <div class="option_row">
      <div class="name_initials_div ">
        <span class="initials-circle ${firstLetter}">${initials}</span> 
        <span class="dropdown-item">${user.name}</span>
      </div>      
      <img src="./assets/img/${isChecked}" alt="Checkbox" class="checkbox-img">
    </div>
  `;

  option.addEventListener("click", () => toggleAssignee(user.id, user.name, option));
  return option;
}

// Berechnet die Initialen eines Nutzernamens.
function getAssigneeInitials(assignee) {
  let assigneeInitials = "";
  if (assignee) {
    let names = assignee.split(" ");
    if (names.length >= 2) {
      assigneeInitials = names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
    } else if (names.length === 1) {
      assigneeInitials = names[0].charAt(0).toUpperCase();
    }
  }
  return assigneeInitials;
}

// Fügt einen Nutzer zu oder entfernt ihn aus der Liste der zugewiesenen Nutzer.
function toggleAssignee(userId, userName, optionElement) {
  const imgElement = optionElement.querySelector(".checkbox-img");

  if (assigneesObject[userId]) {
    // Entfernen des Nutzers
    delete assigneesObject[userId];
    imgElement.src = "./assets/img/checkbox_unchecked.svg";
    removeAssigneeElement(userId);
  } else {
    // Hinzufügen des Nutzers
    assigneesObject[userId] = { id: userId, name: userName };
    imgElement.src = "./assets/img/checked_checkbox.svg";
    addAssigneeElement(userId, userName);
  }
}

// Fügt ein Nutzer-Element zum "show_assignees"-Div hinzu.
function addAssigneeElement(userId, userName) {
  const showAssigneesDiv = document.getElementById("show_assignees");

  if (document.getElementById(`assignee-${userId}`)) return; // Doppelte Einträge verhindern

  const assigneeTemplate = createAssigneeTemplate(userId, userName);
  showAssigneesDiv.innerHTML += assigneeTemplate;
}

// HTML-Template für Nutzer-Element.
function createAssigneeTemplate(userId, userName) {
  // Initialen berechnen
  const initials = getAssigneeInitials(userName);
  const firstLetter = userName[0].toLowerCase();
  // Erste Buchstabe Vorname
  return `
<div class="assignee-item" id="assignee-${userId}">
    <span class="initials-circle ${firstLetter}">${initials}</span> 
    <button class="delete-assignee-button" onclick="removeAssignee('${userId}')">
        <svg width="12" height="auto" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="red"/>
        </svg>
    </button>
</div>

  `;
}

// Loeschen-Button
function removeAssignee(userId) {
  delete assigneesObject[userId];

  const assigneeElement = document.getElementById(`assignee-${userId}`);
  if (assigneeElement) assigneeElement.remove();

  // Checkbox im Dropdown zurücksetzen
  const dropdownOptions = document.querySelectorAll(".custom-dropdown-option");
  dropdownOptions.forEach((option) => {
    if (option.dataset.userId === userId) {
      option.querySelector(".checkbox-img").src = "./assets/img/checkbox_unchecked.svg";
    }
  });
}

// Oeffnen/Schliesen Dropdown-Menü.
function setupDropdownEvents() {
  const dropdown = document.getElementById("dropdown_assigned_to");
  dropdown.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdownOnClickOutside);
}

// Schaltet die Sichtbarkeit des Dropdown-Menüs um.
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("dropdown_assigned_to");
  const dropdownOptions = document.getElementById("dropdown_options_assignee");

  const isOpen = dropdownOptions.classList.contains("show");

  if (!isOpen) {
    dropdownOptions.classList.add("show");
    dropdown.classList.add("dropdown_open");
  } else {
    dropdownOptions.classList.remove("show");
    dropdown.classList.remove("dropdown_open");
  }
}

// Schließt das Dropdown-Menü, wenn außerhalb geklickt wird.
function closeDropdownOnClickOutside(event) {
  const dropdown = document.getElementById("dropdown_assigned_to");
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  if (!dropdown.contains(event.target) && !dropdownOptions.contains(event.target)) {
    closeDropdown();
  }
}

// Schließt das Dropdown-Menü.
function closeDropdown() {
  document.getElementById("dropdown_options_assignee").classList.remove("show");
  document.getElementById("dropdown_assigned_to").classList.remove("dropdown_open");
}

// ------------------------ Add subtasks
document.addEventListener("DOMContentLoaded", function () {
  initializeSubtaskListeners();
});

//Event-Listener Hinzufügen Subtasks.
function initializeSubtaskListeners() {
  const inputSubtask = document.getElementById("input_subtask");
  const addIcon = document.getElementById("add_icon");
  const inputIcons = document.getElementById("input_icons");
  const checkIcon = document.getElementById("check_icon");
  const clearIcon = document.getElementById("clear_icon");

  setupInputSubtaskEvents(inputSubtask, addIcon, inputIcons);
  setupClearIconEvent(clearIcon, inputSubtask, addIcon, inputIcons);
  setupCheckIconEvent(checkIcon);
}

// Event-Listener Eingabefeld des Subtasks
function setupInputSubtaskEvents(inputSubtask, addIcon, inputIcons) {
  inputSubtask.addEventListener("input", () => toggleInputIcons(inputSubtask, addIcon, inputIcons));
  inputSubtask.addEventListener("blur", () => resetInputIconsOnBlur(inputSubtask, addIcon, inputIcons));
}

// Zeigt/versteckt Icons Hinzufügen/Löschen 
function toggleInputIcons(inputSubtask, addIcon, inputIcons) {
  if (inputSubtask.value.trim() !== "") {
    addIcon.style.display = "none";
    inputIcons.style.display = "flex";
  } else {
    addIcon.style.display = "inline";
    inputIcons.style.display = "none";
  }
}

// Add-Icon wenn Eingabefeld leer
function resetInputIconsOnBlur(inputSubtask, addIcon, inputIcons) {
  if (inputSubtask.value.trim() === "") {
    addIcon.style.display = "inline";
    inputIcons.style.display = "none";
  }
}

// Event-Listener Löschen-Icon.
function setupClearIconEvent(clearIcon, inputSubtask, addIcon, inputIcons) {
  clearIcon.addEventListener("click", () => clearSubtaskInput(inputSubtask, addIcon, inputIcons));
}

// Löscht Inhalt Eingabefelds und zeigt Add-Icon.
function clearSubtaskInput(inputSubtask, addIcon, inputIcons) {
  inputSubtask.value = "";
  addIcon.style.display = "inline";
  inputIcons.style.display = "none";
  inputSubtask.focus();
}

// Event-Listener Check-Icon.
function setupCheckIconEvent(checkIcon) {
  checkIcon.addEventListener("click", () => addNewSubtask());
}

// Fügt neuen Subtask zur Liste hinzu, wenn Check-Icon geklickt
function addNewSubtask() {
  const inputSubtask = document.getElementById("input_subtask");
  const displaySubtask = document.getElementById("display_subtasks");
  const addIcon = document.getElementById("add_icon");
  const inputIcons = document.getElementById("input_icons");

  const subtaskText = inputSubtask.value.trim();

  if (subtaskText !== "") {
    const subtaskElement = createSubtaskElement(subtaskText, displaySubtask);
    displaySubtask.appendChild(subtaskElement);
    resetSubtaskInput(inputSubtask, addIcon, inputIcons);
  }
}

// Erstellt Subtask-Element.
function createSubtaskElement(subtaskText, displaySubtask) {
  const subtaskElement = document.createElement("li");
  subtaskElement.className = "subtask-item";

  const nameElement = document.createElement("span");
  nameElement.textContent = subtaskText;
  subtaskElement.appendChild(nameElement);

  const deleteButton = createDeleteButton(displaySubtask, subtaskElement);
  subtaskElement.appendChild(deleteButton);

  return subtaskElement;
}

// Erstellt Löschen-Button für Subtask-Element.
function createDeleteButton(displaySubtask, subtaskElement) {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<img class="delete_button_subtask" src="./assets/img/delete.svg" alt="Delete" />';
  deleteButton.addEventListener("click", () => displaySubtask.removeChild(subtaskElement));
  return deleteButton;
}

// Setzt Eingabefeld zurück und zeigt Add-Icon.
function resetSubtaskInput(inputSubtask, addIcon, inputIcons) {
  inputSubtask.value = "";
  addIcon.style.display = "inline";
  inputIcons.style.display = "none";
}

//-------------------------------- Select priority
document.addEventListener("DOMContentLoaded", function () {
  initializePrioritySelection();
});

function initializePrioritySelection() {
  const urgentButton = document.getElementById("urgent_button");
  const mediumButton = document.getElementById("medium_button");
  const lowButton = document.getElementById("low_button");

  setupPriorityButtons(urgentButton, mediumButton, lowButton);
}

function setupPriorityButtons(urgentButton, mediumButton, lowButton) {
  urgentButton.addEventListener("click", () => handlePriorityClick(urgentButton));
  mediumButton.addEventListener("click", () => handlePriorityClick(mediumButton));
  lowButton.addEventListener("click", () => handlePriorityClick(lowButton));
}

// Klick auf Prioritätsbutton.
function handlePriorityClick(clickedButton) {
  removeActiveClassFromOtherButtons(clickedButton);
  setActiveButton(clickedButton);
}

// Entfernt aktive Klasse von anderen Prioritätsbuttons.
function removeActiveClassFromOtherButtons(clickedButton) {
  const allButtons = document.querySelectorAll("#urgent_button, #medium_button, #low_button");
  allButtons.forEach(button => {
    if (button !== clickedButton && button.classList.contains("active")) {
      button.classList.remove("active");
    }
  });
}

// Setzt angeklickten Button aktiv.
function setActiveButton(clickedButton) {
  clickedButton.classList.add("active");
}

//-------------------------------- Select category
document.addEventListener("DOMContentLoaded", function() {
  const dropdown = document.getElementById("dropdown_category");
  const optionsContainer = document.querySelector(".dropdown_options");
  const selectedText = document.getElementById("dropdown_selected");
  const inputField = document.getElementById("category"); 

  dropdown.addEventListener("click", function() {
    dropdown.parentElement.classList.toggle("open");
  });

  document.querySelectorAll(".custom-dropdown-option").forEach(option => {
    option.addEventListener("click", function() {
      selectedText.textContent = this.textContent; 
      inputField.value = this.dataset.value;
      dropdown.parentElement.classList.remove("open");
    });
  });

  document.addEventListener("click", function(event) {
    if (!dropdown.parentElement.contains(event.target)) {
      dropdown.parentElement.classList.remove("open");
    }
  });
});
