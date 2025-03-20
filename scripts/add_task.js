let assigneesObject = {};

// -------------------- Add contacts as a dropdown
document.addEventListener("DOMContentLoaded", async function () {
  const selectElement = document.getElementById("input_assigned_to");
  const showAssigneesDiv = document.getElementById("show_assignees");

  try {
    const response = await fetch(
      "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json"
    );
    const data = await response.json();
    
    // Extracts users from the data object
    const users = Object.values(data.users); // Extract users from the "users" data structure

    // Loops through each user and adds them as an <option> to the <select> element
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.name; // Sets the option's value to the user's name
      option.textContent = user.name; // Sets the option's text to the user's name
      selectElement.appendChild(option); // Appends the option to the <select> element
    });

    // Adds an event listener that is triggered when the selection changes in the <select> element
    selectElement.addEventListener("change", function () {
      // Gets the selected option
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      // Gets the text content of the selected option (user's name)
      const selectedName = selectedOption.textContent;

      // Checks if the placeholder option is not selected
      if (selectedOption.value !== "") {
        // Creates a <div> element to display the selected contact
        const assigneeElement = document.createElement("div");
        assigneeElement.className = "assignee-item";

        // Creates a <span> element to display the username
        const nameElement = document.createElement("span");
        nameElement.textContent = selectedName;
        assigneeElement.appendChild(nameElement); // Appends the <span> to the <div>

        assigneesObject[selectedName] = selectedName
          .toLowerCase()
          .replace(/\s(.)/g, (firstLetterFromLastname) =>
            firstLetterFromLastname.toUpperCase()
          )
          .replace(/\s+/g, "");
        console.log(assigneesObject);

        // "Delete" button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
          showAssigneesDiv.removeChild(assigneeElement);
          delete assigneesObject[selectedName]; // Entfernt den Assignee aus dem Objekt
        });
        assigneeElement.appendChild(deleteButton);
        showAssigneesDiv.appendChild(assigneeElement);
        // Resets the <select> element to the placeholder
        selectElement.selectedIndex = 0;
      }
    });
  } catch (error) {
    console.error("Error loading users:", error);
  }
});

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

// --------------------------------Select priority
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

//-----------------------------Select category
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

//--------------------------------------Save data to database
document.addEventListener("DOMContentLoaded", async function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  const userId = user.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;
  const taskForm = document.getElementById("task_form");

  // Funktion, um die neue Aufgaben-ID als 'task1', 'task2' etc. zu ermitteln
  async function getNewTaskId() {
    try {
      const response = await fetch(`${BASE_URL}tasks.json`);
      const data = await response.json();

      // Falls keine Tasks vorhanden sind, starten wir mit task1
      if (!data) {
        return "task1";
      }

      // Extrahiere alle Task-IDs und berechne die höchste Zahl
      const taskIds = Object.keys(data);
      if (taskIds.length === 0) {
        return "task1"; // Falls keine Tasks vorhanden sind, starten mit 'task1'
      }

      // Die maximal vorhandene Task-ID finden
      const maxTaskId = taskIds.reduce((max, id) => {
        const numericId = parseInt(id.replace("task", ""), 10); // Entferne 'task' und parse die Zahl
        return numericId > max ? numericId : max;
      }, 0);

      return `task${maxTaskId + 1}`; // Die neue Task-ID ist die höchste + 1
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return "task1"; // Falls ein Fehler auftritt, starte mit 'task1'
    }
  }

  // Event-Listener für das Speichern der Aufgabe
  taskForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Sammeln der Aufgaben-Daten
    const title = document.getElementById("input_title").value;
    const description = document.getElementById("input_description").value;
    const dueDate = new Date(document.getElementById("input_date").value).toISOString();
    const priority = document.querySelector(".priority_buttons_div .active p").textContent.toLowerCase();
    const assignees = {}; // Benutzer-Zuweisungen
    Object.keys(assigneesObject).forEach(assigneeName => {
      assignees[assigneeName.toLowerCase()] = true;
    });
    const label = document.getElementById("category").value; // Kategorie
    const subtasks = {}; // Unteraufgaben
    const subtasksList = Array.from(document.querySelectorAll("#display_subtasks div span")).map(span => span.textContent);
    subtasksList.forEach((subtask, index) => {
      subtasks[`subtask${index + 1}`] = true;
    });

    // Berechnung der neuen Task-ID (task1, task2, etc.)
    let newTaskId = await getNewTaskId();

    // Aufgaben-Datenobjekt (struktur wie gewünscht)
    const taskData = {
      label: "Technical Task", // Beispiel für Label
      title: title,
      description: description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: priority,
      createdBy: userId, // Dynamischer Benutzer
      assignees: assignees,  // Zuweisungen der Benutzer
      subtasks: subtasks,    // Unteraufgaben
    };

    // Aufgabe in der Firebase-Datenbank speichern
    fetch(`${BASE_URL}tasks/${newTaskId}.json`, {
      method: "PUT", // PUT, um die spezifische ID zu setzen
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
    .then((response) => response.json()) // Antwort von Firebase verarbeiten
    .then((taskResponse) => {
      const taskId = newTaskId; // Die neue Aufgaben-ID (z. B. 'task1')

      // Aufgabe zu den "toDo"-Listen des angemeldeten Benutzers hinzufügen
      const taskForUser = {
        taskId: taskId, // Speichert die Aufgabe als "taskId" im "toDo" des Benutzers
      };

      fetch(`${BASE_URL}users/${userId}/assignedTasks/toDo.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskForUser),
      })
      .then((response) => response.json())
      .then((userResponse) => {
        console.log(`Task added to user ${userId} toDo list`);
      })
      .catch((error) => {
        console.error("Error adding task to user:", error);
      });
    })
    .catch((error) => {
      console.error("Error saving task:", error);
    });
  });
});
