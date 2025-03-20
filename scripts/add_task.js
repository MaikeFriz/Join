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