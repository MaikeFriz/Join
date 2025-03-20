let assigneesObject = {};

// --------------------Kontakte als Dropdown hinzufügen
document.addEventListener("DOMContentLoaded", async function () {
  const selectElement = document.getElementById("input_assigned_to");
  const showAssigneesDiv = document.getElementById("show_assignees");

  try {
    const response = await fetch(
      "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json"
    );
    const data = await response.json();
    // Extrahiert Benutzerwerte aus dem Datenobjekt
    const users = Object.values(data);

    // Durchlauft jeden Benutzer und fügt ihn als <option> zum <select>-Element hinzu
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id; // Setzt den Wert der Option auf die Benutzer-ID
      option.textContent = user.name; // Setzt den Text der Option auf den Benutzernamen
      selectElement.appendChild(option); // Fügt die Option zum <select>-Element hinzu
    });

    // Fügt einen Event-Listener hinzu, der ausgelöst wird, wenn sich die Auswahl im <select>-Element ändert
    selectElement.addEventListener("change", function () {
      // Holt die ausgewählte Option
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      // Holt den Text der ausgewählten Option (Benutzernamen)
      const selectedName = selectedOption.textContent;

      // Überprüft, ob nicht der Platzhalter ausgewählt ist
      if (selectedOption.value !== "") {
        // Erstellt ein <div>-Element, um den ausgewählten Kontakt anzuzeigen
        const assigneeElement = document.createElement("div");
        assigneeElement.className = "assignee-item";

        // Erstellt ein <span>-Element, um den Benutzernamen anzuzeigen
        const nameElement = document.createElement("span");
        nameElement.textContent = selectedName;
        assigneeElement.appendChild(nameElement); // Fügt das <span> zum <div> hinzu

        assigneesObject[selectedName] = selectedName
          .toLowerCase()
          .replace(/\s(.)/g, (firstLetterFromLastname) =>
            firstLetterFromLastname.toUpperCase()
          )
          .replace(/\s+/g, "");
        console.log(assigneesObject);

        //"Löschen"-Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", function () {
          showAssigneesDiv.removeChild(assigneeElement);
        });
        assigneeElement.appendChild(deleteButton);
        showAssigneesDiv.appendChild(assigneeElement);
        // Setzt das <select>-Element auf den Platzhalter zurück
        selectElement.selectedIndex = 0;
      }
    });
  } catch (error) {
    console.error("Fehler beim Laden der Nutzer:", error);
  }
});

// ------------------------Subtasks hinzufügen
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


// --------------------------------Priority auswählen
document.addEventListener("DOMContentLoaded", function () {
  const urgentButton = document.getElementById("urgent_button");
  const mediumButton = document.getElementById("medium_button");
  const lowButton = document.getElementById("low_button");

  // Variable, um den aktuell aktiven Button zu speichern
  let activeButton = null;

  function handleButtonClick(button) {
    // Wenn ein anderer Button aktiv ist, entfernt die "active"-Klasse
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


//-----------------------------Category auswaehlen
document.addEventListener("DOMContentLoaded", function() {
    const dropdown = document.getElementById("dropdown_category");
    const optionsContainer = document.querySelector(".dropdown_options");
    const selectedText = document.getElementById("dropdown_selected");
    const inputField = document.getElementById("category"); // Das versteckte Input-Feld

    dropdown.addEventListener("click", function() {
        dropdown.parentElement.classList.toggle("open");
    });

    document.querySelectorAll(".custom-dropdown-option").forEach(option => {
        option.addEventListener("click", function() {
            selectedText.textContent = this.textContent; // Anzeige aktualisieren
            inputField.value = this.dataset.value; // Wert in hidden input speichern
            dropdown.parentElement.classList.remove("open");
        });
    });

    document.addEventListener("click", function(event) {
        if (!dropdown.parentElement.contains(event.target)) {
            dropdown.parentElement.classList.remove("open");
        }
    });
});

//--------------------------------------Daten in Datenbank speichern
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  const userId = user.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/${userId}/assignedTasks/todos.json`;
  const taskForm = document.getElementById("task_form");

  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("input_title").value;
    const description = document.getElementById("input_description").value;
    const dueDate = document.getElementById("input_date").value;
    const priority = document.querySelector(".priority_buttons_div .active p").textContent.toLocaleLowerCase();
    const assignees = assigneesObject;
    const label = document.getElementById("category").value; // Wert aus dem versteckten Input holen
    const subtasks = Array.from(document.querySelectorAll("#display_subtasks div span")).map(span => span.textContent);

    const taskData = {
      title: title,
      description: description,
      label: label, // Hier bleibt alles gleich
      assignees: assignees,
      dueDate: dueDate, //umbenannt weil hier Fälligkeitstermin gemeint ist
      priority: priority,
      subtasks: subtasks,
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
    .then((response) => {
      if (response.ok) {
        window.location.href = "./board.html";
      } else {
        console.error("Fehler beim Hinzufügen des Tasks:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Fehler beim Senden der Daten:", error);
    });
  });
});
