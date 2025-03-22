let assigneesObject = {};

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

function createDropdownOptions(users) {
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  dropdownOptions.innerHTML = ""; // Sicherstellen, dass keine doppelten Einträge entstehen

  users.forEach((user) => {
    const option = createDropdownOptionTemplate(user);
    dropdownOptions.appendChild(option);
  });
}

function createDropdownOptionTemplate(user) {
  const option = document.createElement("div");
  option.classList.add("custom-dropdown-option");
  option.dataset.value = user.name;
  option.dataset.userId = user.id;

  // Standardbild für nicht gewählte Nutzer
  const isChecked = assigneesObject[user.id] ? "checked_checkbox.svg" : "checkbox_unchecked.svg";

  // Initialen berechnen
  const initials = getAssigneeInitials(user.name);

  option.innerHTML = `
    <div class="option_row">
      <div class="name_initials_div">
        <span class="initials-circle">${initials}</span> 
        <span class="dropdown-item">${user.name}</span>
      </div>      
      <img src="./assets/img/${isChecked}" alt="Checkbox" class="checkbox-img">
    </div>
  `;

  option.addEventListener("click", () => toggleAssignee(user.id, user.name, option));
  return option;
}

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

function addAssigneeElement(userId, userName) {
  const showAssigneesDiv = document.getElementById("show_assignees");

  if (document.getElementById(`assignee-${userId}`)) return; // Doppelte Einträge verhindern

  const assigneeTemplate = createAssigneeTemplate(userId, userName);
  showAssigneesDiv.innerHTML += assigneeTemplate;

  // Event-Listener für den Löschen-Button hinzufügen
  const deleteButton = document.getElementById(`assignee-${userId}`).querySelector(".delete-assignee-button");
  deleteButton.addEventListener("click", () => removeAssignee(userId));
}

function createAssigneeTemplate(userId, userName) {
  // Initialen berechnen
  const initials = getAssigneeInitials(userName);

  // Erste Buchstabe des Vornamens ermitteln
  const firstLetter = userName.charAt(0).toLowerCase(); // Ersten Buchstaben klein schreiben für CSS-Klassen

  return `
    <div class="assignee-item" id="assignee-${userId}">
      <div class="name_initials_div">
        <span class="initials-circle">${initials}</span> 
        <span class="dropdown-item">${userName}</span>
      </div>
      <button class="delete-assignee-button">
        <img src="./assets/img/delete.svg" alt="Delete" />
      </button>
    </div>
  `;
}

function removeAssignee(userId) {
  delete assigneesObject[userId];

  const assigneeElement = document.getElementById(`assignee-${userId}`);
  if (assigneeElement) assigneeElement.remove();

  // Bild im Dropdown zurücksetzen
  const dropdownOptions = document.querySelectorAll(".custom-dropdown-option");
  dropdownOptions.forEach((option) => {
    if (option.dataset.userId === userId) {
      option.querySelector(".checkbox-img").src = "./assets/img/checkbox_unchecked.svg";
    }
  });
}

function setupDropdownEvents() {
  const dropdown = document.getElementById("dropdown_assigned_to");
  dropdown.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdownOnClickOutside);
}

function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("dropdown_assigned_to");
  const dropdownOptions = document.getElementById("dropdown_options_assignee");

  const isOpen = dropdownOptions.classList.contains("show");
  document.querySelectorAll(".dropdown_options_assignee").forEach((el) => el.classList.remove("show"));
  document.querySelectorAll(".dropdown_open").forEach((el) => el.classList.remove("dropdown_open"));

  if (!isOpen) {
    dropdownOptions.classList.add("show");
    dropdown.classList.add("dropdown_open");
  }
}

function closeDropdownOnClickOutside(event) {
  const dropdown = document.getElementById("dropdown_assigned_to");
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  if (!dropdown.contains(event.target) && !dropdownOptions.contains(event.target)) {
    closeDropdown();
  }
}

function closeDropdown() {
  document.getElementById("dropdown_options_assignee").classList.remove("show");
  document.getElementById("dropdown_assigned_to").classList.remove("dropdown_open");
}

// ------------------------ Add subtasks
document.addEventListener("DOMContentLoaded", function () {
  const inputSubtask = document.getElementById("input_subtask");
  const addIcon = document.getElementById("add_icon");
  const inputIcons = document.getElementById("input_icons");
  const checkIcon = document.getElementById("check_icon");
  const clearIcon = document.getElementById("clear_icon");
  const displaySubtask = document.getElementById("display_subtasks");

  inputSubtask.addEventListener("input", function () {
    if (inputSubtask.value.trim() !== "") {
      addIcon.style.display = "none";
      inputIcons.style.display = "flex";
    } else {
      addIcon.style.display = "inline";
      inputIcons.style.display = "none";
    }
  });

  inputSubtask.addEventListener("blur", function () {
    if (inputSubtask.value.trim() === "") {
      addIcon.style.display = "inline";
      inputIcons.style.display = "none";
    }
  });

  clearIcon.addEventListener("click", function () {
    inputSubtask.value = "";
    addIcon.style.display = "inline";
    inputIcons.style.display = "none";
    inputSubtask.focus();
  });

  checkIcon.addEventListener("click", function () {
    const subtaskText = inputSubtask.value.trim();

    if (subtaskText !== "") {
      const subtaskElement = document.createElement("li");
      subtaskElement.className = "subtask-item";

      const nameElement = document.createElement("span");
      nameElement.textContent = subtaskText;
      subtaskElement.appendChild(nameElement);

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<img class="delete_button_subtask" src="./assets/img/delete.svg" alt="Delete" />';

      deleteButton.addEventListener("click", function () {
        displaySubtask.removeChild(subtaskElement);
      });

      subtaskElement.appendChild(deleteButton);
      displaySubtask.appendChild(subtaskElement);

      inputSubtask.value = "";
      addIcon.style.display = "inline";
      inputIcons.style.display = "none";
    }
  });
});

//-------------------------------- Select priority
document.addEventListener("DOMContentLoaded", function () {
  const urgentButton = document.getElementById("urgent_button");
  const mediumButton = document.getElementById("medium_button");
  const lowButton = document.getElementById("low_button");

  // Variable to track the currently active button
  let activeButton = null;

  function handleButtonClick(button) {
    // If another button is active, remove the "active" class
    if (activeButton && activeButton !== button) {
      activeButton.classList.remove("active");
    }

    button.classList.add("active");
    activeButton = button;
  }

  urgentButton.addEventListener("click", function () {
    handleButtonClick(urgentButton);
  });

  mediumButton.addEventListener("click", function () {
    handleButtonClick(mediumButton);
  });

  lowButton.addEventListener("click", function () {
    handleButtonClick(lowButton);
  });
});

//-------------------------------- Select category
document.addEventListener("DOMContentLoaded", function() {
  const dropdown = document.getElementById("dropdown_category");
  const optionsContainer = document.querySelector(".dropdown_options");
  const selectedText = document.getElementById("dropdown_selected");
  const inputField = document.getElementById("category"); // The hidden input field

  dropdown.addEventListener("click", function() {
    dropdown.parentElement.classList.toggle("open");
  });

  document.querySelectorAll(".custom-dropdown-option").forEach(option => {
    option.addEventListener("click", function() {
      selectedText.textContent = this.textContent; // Update display
      inputField.value = this.dataset.value; // Save value in hidden input
      dropdown.parentElement.classList.remove("open");
    });
  });

  document.addEventListener("click", function(event) {
    if (!dropdown.parentElement.contains(event.target)) {
      dropdown.parentElement.classList.remove("open");
    }
  });
});
