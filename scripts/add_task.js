let assigneesObject = {};

document.addEventListener("DOMContentLoaded", initDropdown);

// Initialisiert das Dropdown, lädt die Benutzer und setzt Events
async function initDropdown() {
    try {
        const users = await fetchUsers();
        createDropdownOptions(users);
        setupDropdownEvents();
    } catch (error) {
        console.error("Error loading users:", error);
    }
}

// Lädt die Benutzer aus der Firebase-Datenbank
async function fetchUsers() {
    const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json");
    const data = await response.json();
    // Extrahiert die Benutzer und deren IDs aus dem Datenbank-Objekt
    return Object.entries(data.users).map(([userId, user]) => ({
        id: userId,  // Der Benutzer-Schlüssel ist die ID (z.B. "user1")
        name: user.name
    }));
}

// Erstellt die Dropdown-Optionen basierend auf den Benutzern
function createDropdownOptions(users) {
    const dropdownOptions = document.getElementById("dropdown_options_assignee");
    users.forEach(user => {
        const option = document.createElement("div");
        option.classList.add("custom-dropdown-option");
        option.dataset.value = user.name;
        option.dataset.userId = user.id; // Speichern der Benutzer-ID in dataset
        option.innerHTML = templateDropdownOption(user);
        option.addEventListener("click", () => selectAssignee(user.id)); // Übergibt die ID direkt
        dropdownOptions.appendChild(option);
    });
}

// Gibt das HTML-Template für eine einzelne Dropdown-Option zurück
function templateDropdownOption(user) {
    return `
    <div class="option_row">
        <div class="name_initials_div">
            <span>...</span>
            <span class="dropdown-item">${user.name}</span>
        </div>    
        <img src="./assets/img/checkbox_unchecked.svg" alt="">
    </div>`;
}

// Wählt eine Person aus der Liste aus und fügt sie hinzu
async function selectAssignee(userId) {
  const users = await fetchUsers(); // Holen der Benutzerliste
  const selectedUser = users.find(user => user.id === userId); // Verwende direkt die ID

  if (!assigneesObject[selectedUser.id]) {
      // Speichern der Benutzer-ID und Name im assigneesObject
      assigneesObject[selectedUser.id] = { id: selectedUser.id, name: selectedUser.name };
      addAssigneeElement(selectedUser);
  }
  resetDropdownSelection();
}

// Erstellt das Assignee-Element und zeigt es in der UI an
function addAssigneeElement(user) {
  const showAssigneesDiv = document.getElementById("show_assignees");
  const assigneeElement = document.createElement("div");
  assigneeElement.className = "assignee-item";

  const nameElement = document.createElement("span");
  nameElement.textContent = user.name; // Benutzername
  assigneeElement.appendChild(nameElement);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => removeAssignee(user.id, assigneeElement));
  assigneeElement.appendChild(deleteButton);

  showAssigneesDiv.appendChild(assigneeElement);
}

// Entfernt einen ausgewählten Assignee aus der Liste
function removeAssignee(userId, element) {
    document.getElementById("show_assignees").removeChild(element);
    delete assigneesObject[userId]; // Benutzer-ID wird verwendet, um den Assignee zu entfernen
}

// Setzt die Dropdown-Anzeige zurück
function resetDropdownSelection() {
    document.getElementById("dropdown_selected_assignee").textContent = "Select a person";
    document.getElementById("assigned_to").value = "";
    closeDropdown();
}

// Setzt die Event-Listener für das Dropdown
function setupDropdownEvents() {
    const dropdown = document.getElementById("dropdown_assigned_to");
    dropdown.addEventListener("click", toggleDropdown);
    document.addEventListener("click", closeDropdownOnClickOutside);
}

// Öffnet oder schließt das Dropdown
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById("dropdown_assigned_to");
    const dropdownOptions = document.getElementById("dropdown_options_assignee");
    
    const isOpen = dropdownOptions.classList.contains("show");
    document.querySelectorAll(".dropdown_options_assignee").forEach(el => el.classList.remove("show"));
    document.querySelectorAll(".dropdown_open").forEach(el => el.classList.remove("dropdown_open"));
    
    if (!isOpen) {
        dropdownOptions.classList.add("show");
        dropdown.classList.add("dropdown_open");
    }
}

// Schließt das Dropdown, wenn außerhalb geklickt wird
function closeDropdownOnClickOutside(event) {
    const dropdown = document.getElementById("dropdown_assigned_to");
    const dropdownOptions = document.getElementById("dropdown_options_assignee");
    if (!dropdown.contains(event.target) && !dropdownOptions.contains(event.target)) {
        closeDropdown();
    }
}

// Schließt das Dropdown-Menü
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

    dropdown.addEventListener("click", function () {
        dropdown.parentElement.classList.toggle("open");
    });

  document.addEventListener("click", function(event) {
    if (!dropdown.parentElement.contains(event.target)) {
      dropdown.parentElement.classList.remove("open");
    }
  });
});
