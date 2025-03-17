// --------------------Kontakte als Dropdown hinzufügen
document.addEventListener("DOMContentLoaded", async function () {
    const selectElement = document.getElementById("input_assigned_to");
    const showAssigneesDiv = document.getElementById("show_assignees");

    try {
        const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users.json");
        const data = await response.json();
        // Extrahiert Benutzerwerte aus dem Datenobjekt
        const users = Object.values(data);

        // Durchlauft jeden Benutzer und fügt ihn als <option> zum <select>-Element hinzu
        users.forEach(user => {
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
    const addButton = document.getElementById("button_add_subtask");
    const displaySubtask = document.getElementById("display_subtasks");

    // Überprüft, ob das Anzeigeelement gefunden wurde
    if (displaySubtask) {
        addButton.addEventListener("click", function () {
            const subtaskText = inputSubtask.value.trim();

            if (subtaskText !== "") {
                const subtaskElement = document.createElement("div");
                subtaskElement.className = "subtask-item"; 

                // Erstelle ein <span>-Element, um den Subtask-Text anzuzeigen
                const nameElement = document.createElement("span");
                nameElement.textContent = subtaskText;
                subtaskElement.appendChild(nameElement); 

                // Erstelle einen "Löschen"-Button
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Löschen";
                deleteButton.addEventListener("click", function () {
                    displaySubtask.removeChild(subtaskElement);
                });
                subtaskElement.appendChild(deleteButton);
                displaySubtask.appendChild(subtaskElement);
                inputSubtask.value = "";
            }
        });

        // Fügt einen Event-Listener hinzu, der ausgelöst wird, wenn die "Enter"-Taste im <input>-Element gedrückt wird
        inputSubtask.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                addButton.click();
            }
        });
    } else {
        console.error("display_subtasks Element nicht gefunden!");
    }
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




//--------------------------------------Daten in Datenbank speichern
document.addEventListener("DOMContentLoaded", function () {
    // Überprüft, ob der Benutzer im localStorage als "loggedInUser" gespeichert ist
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    // Wenn kein eingeloggter Benutzer gefunden wird, leite zur Login-Seite weiter
    if (!user) {
        window.location.href = "./log_in.html";
        return; 
    }
    const userId = user.userId;
    const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks.json`;
    const taskForm = document.getElementById("task_form");

    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("input_title").value;
        const description = document.getElementById("input_description").value;
        const dueDate = document.getElementById("input_date").value;
        const priority = document.querySelector(".priority_buttons_div .active p").textContent;
        const assignedTo = Array.from(document.querySelectorAll("#show_assignees div")).map(div => {
            return div.dataset.userId; // Speichert die User-ID
        });
        const category = document.getElementById("category").value;
        const subtasks = Array.from(document.querySelectorAll("#display_subtasks div span")).map(span => span.textContent);

        // Erstellt ein Objekt mit den Task-Daten
        const taskData = {
            title: title,
            description: description,
            dueDate: dueDate,
            priority: priority,
            assignedTo: assignedTo,
            category: category,
            subtasks: subtasks,
            status: "todo"
        };

        fetch(BASE_URL, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(taskData), 
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "./board.html";
            } else {
                console.error("Fehler beim Hinzufügen des Tasks:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Fehler beim Senden der Daten:", error);
        });
    });
});