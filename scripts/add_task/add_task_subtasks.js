let subtasksObject = {};
let highestSubtaskId = 0;

// Initializes subtask input listeners on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  initializeSubtaskListeners();
});

// Sets up event listeners for subtask input and icons
function initializeSubtaskListeners() {
  const inputSubtask = document.getElementById("input_subtask");
  const addIcon = document.getElementById("add_icon");
  const inputIcons = document.getElementById("input_icons");
  const checkIcon = document.getElementById("check_icon");
  const clearIcon = document.getElementById("clear_icon");

  inputSubtask.addEventListener("input", () =>
    toggleIcons(inputSubtask, addIcon, inputIcons)
  );
  inputSubtask.addEventListener("blur", () =>
    resetIcons(inputSubtask, addIcon, inputIcons)
  );
  clearIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    onCancel();
  });
  checkIcon.addEventListener("click", () => addSubtask(inputSubtask));
}

// Toggles visibility of add and input icons based on input value
function toggleIcons(inputSubtask, addIcon, inputIcons) {
  const isNotEmpty = inputSubtask.value.trim() !== "";
  addIcon.style.display = isNotEmpty ? "none" : "inline";
  inputIcons.style.display = isNotEmpty ? "flex" : "none";
}

// Resets icons to default state if input is empty
function resetIcons(inputSubtask, addIcon, inputIcons) {
  if (inputSubtask.value.trim() === "")
    toggleIcons(inputSubtask, addIcon, inputIcons);
}

// Clears the subtask input and resets icons
function clearInput(inputSubtask, addIcon, inputIcons) {
  inputSubtask.value = "";
  toggleIcons(inputSubtask, addIcon, inputIcons);
  inputSubtask.focus();
}

// Displays a subtask in the subtask list
function displaySubtask(subtaskId, subtaskText) {
  const subtaskElement = createSubtaskElement(subtaskId, subtaskText);
  document.getElementById("display_subtasks").appendChild(subtaskElement);
}

// Creates a subtask list item element with edit and delete functionality
function createSubtaskElement(subtaskId, subtaskText) {
  const subtaskElement = document.createElement("li");
  subtaskElement.className = "subtask-item";
  subtaskElement.id = subtaskId;
  subtaskElement.innerHTML = getSubtaskElementHTML(subtaskText);
  const deleteButton = subtaskElement.querySelector("button");
  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeSubtask(subtaskId, subtaskElement);
  });
  const span = subtaskElement.querySelector(".subtask-text");
  const deleteImg = subtaskElement.querySelector(".delete_button_subtask");
  setupEditEvents(span, subtaskId, deleteImg);
  return subtaskElement;
}

// Sets up double-click and edit button events for editing a subtask
function setupEditEvents(span, subtaskId, deleteButton) {
  span.addEventListener("dblclick", () => {
    openEditMode(span, subtaskId, deleteButton);
  });
  const editButton =
    deleteButton.parentElement.nextElementSibling.querySelector(
      ".edit_button_subtask"
    );
  editButton.addEventListener("click", () => {
    openEditMode(span, subtaskId, deleteButton);
  });
}

// Opens the edit mode for a subtask
function openEditMode(span, subtaskId, deleteButton) {
  const inputContainer = createEditContainer(span, subtaskId, deleteButton);
  const subtaskItem = span.closest(".subtask-item");
  span.replaceWith(inputContainer);
  deleteButton.style.display = "none";
  subtaskItem.classList.add("editing");
}

// Creates the input container and icons for editing a subtask
function createEditContainer(span, subtaskId, deleteButton) {
  const inputContainer = document.createElement("div");
  inputContainer.className = "edit-subtask-container";
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "input-wrapper";
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "edit-subtask-input";
  const iconsContainer = createEditIcons(
    input,
    () => saveEdit(input, span, subtaskId, inputContainer, deleteButton),
    () => cancelEdit(inputContainer, span, deleteButton)
  );
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(iconsContainer);
  inputContainer.appendChild(inputWrapper);
  input.focus();
  input.addEventListener("blur", () =>
    saveEdit(input, span, subtaskId, inputContainer, deleteButton)
  );
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
      saveEdit(input, span, subtaskId, inputContainer, deleteButton);
    if (e.key === "Escape") cancelEdit(inputContainer, span, deleteButton);
  });
  return inputContainer;
}

// Creates the icons for editing a subtask and sets up their events
function createEditIcons(input, onSave, onCancel) {
  const iconsContainer = document.createElement("div");
  iconsContainer.className = "icons-container";
  iconsContainer.innerHTML = getEditIconsHTML();
  iconsContainer
    .querySelector(".clear_icon_show_subtask")
    .addEventListener("mousedown", (e) => {
      e.preventDefault(); // Verhindert, dass das Input das Focus verliert!
      e.stopPropagation();
      input.value = "";
    });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave();
    }
  });
  return iconsContainer;
}

// Saves the edited subtask and updates the UI
function saveEdit(input, span, subtaskId, inputContainer, deleteButton) {
  const newText = input.value.trim();
  const subtaskItem = inputContainer.closest(".subtask-item");

  if (newText !== "") {
    // Text im span aktualisieren
    span.textContent = newText;

    // Subtask im Objekt aktualisieren
    subtasksObject[subtaskId].title = newText;

    // Edit-Container durch das ursprüngliche Span-Element ersetzen
    inputContainer.replaceWith(span);

    // Entferne den Bearbeitungsmodus-Style
    subtaskItem.classList.remove("editing");

    // Löschen-Icon wieder anzeigen
    deleteButton.style.display = "inline"; // oder "" – je nach Standard
  }
}

// Cancels editing and restores the original subtask text
function cancelEdit(inputContainer, span, deleteButton) {
  // Statt span.closest(".subtask-item") nimm inputContainer.closest(".subtask-item")
  const subtaskItem = inputContainer.closest(".subtask-item");
  const subtaskId = subtaskItem ? subtaskItem.id : null;
  if (!subtaskId) return; // Fehlerfall abfangen

  const originalText = subtasksObject[subtaskId].title;
  const updatedElement = createSubtaskElement(subtaskId, originalText);
  subtaskItem.replaceWith(updatedElement);
}

function removeSubtask(subtaskId, subtaskElement) {
  delete subtasksObject[subtaskId];
  subtaskElement.remove();
}

// Removes a subtask from the object and UI
async function addSubtask(inputSubtask) {
  showLoadingSpinner();
  try {
    const subtaskText = inputSubtask.value.trim();
    if (subtaskText !== "") {
      await loadHighestSubtaskId();
      const newSubtaskId = `subtask${highestSubtaskId + 1}`;
      subtasksObject[newSubtaskId] = { title: subtaskText, completed: false };
      displaySubtask(newSubtaskId, subtaskText);
      highestSubtaskId++;
      clearInput(
        inputSubtask,
        document.getElementById("add_icon"),
        document.getElementById("input_icons")
      );
    }
  } finally {
    hideLoadingSpinner();
  }
}

// Adds a new subtask to the object and displays it
async function loadHighestSubtaskId() {
  if (Object.keys(subtasksObject).length === 0) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      highestSubtaskId = getHighestSubtaskIdForGuest();
    } else {
      highestSubtaskId = await getHighestSubtaskIdForUser();
    }
  }
}

// Loads the highest subtask ID for guest or user to avoid ID conflicts
function getHighestSubtaskIdForGuest() {
  const guestData = JSON.parse(localStorage.getItem("guestKanbanData")) || {};
  const guestSubtasks = guestData.subtasks || {};
  const subtaskList = Object.keys(guestSubtasks);
  let highestSubtask = 0;
  for (
    let subtaskIndex = 0;
    subtaskIndex < subtaskList.length;
    subtaskIndex++
  ) {
    const subtaskId = subtaskList[subtaskIndex];
    const subtaskNumber = parseInt(subtaskId.replace("subtask", ""));
    if (subtaskNumber > highestSubtask) highestSubtask = subtaskNumber;
  }
  return highestSubtask;
}

// Gets the highest subtask ID for a user from the database
async function getHighestSubtaskIdForUser() {
  const response = await fetch(
    "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json"
  );
  const data = await response.json();
  const subtaskList = Object.keys(data.subtasks || {});
  let highestSubtask = 0;
  for (
    let subtaskIndex = 0;
    subtaskIndex < subtaskList.length;
    subtaskIndex++
  ) {
    const subtaskId = subtaskList[subtaskIndex];
    const subtaskNumber = parseInt(subtaskId.replace("subtask", ""));
    if (subtaskNumber > highestSubtask) highestSubtask = subtaskNumber;
  }
  return highestSubtask;
}

// Loading Spinner functions
function showLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "flex";
}

function hideLoadingSpinner() {
  document.getElementById("loading_spinner").style.display = "none";
}
