let subtasksObject = {};
let highestSubtaskId = 0;

/**
 * Initializes subtask input listeners on DOMContentLoaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeSubtaskListeners();
});

/**
 * Sets up event listeners for subtask input and icons.
 */
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

/**
 * Toggles visibility of add and input icons based on input value.
 * @param {HTMLInputElement} inputSubtask - The subtask input element.
 * @param {HTMLElement} addIcon - The add icon element.
 * @param {HTMLElement} inputIcons - The input icons container.
 */
function toggleIcons(inputSubtask, addIcon, inputIcons) {
  const isNotEmpty = inputSubtask.value.trim() !== "";
  addIcon.style.display = isNotEmpty ? "none" : "inline";
  inputIcons.style.display = isNotEmpty ? "flex" : "none";
}

/**
 * Resets icons to default state if input is empty.
 * @param {HTMLInputElement} inputSubtask - The subtask input element.
 * @param {HTMLElement} addIcon - The add icon element.
 * @param {HTMLElement} inputIcons - The input icons container.
 */
function resetIcons(inputSubtask, addIcon, inputIcons) {
  if (inputSubtask.value.trim() === "")
    toggleIcons(inputSubtask, addIcon, inputIcons);
}

/**
 * Clears the subtask input and resets icons.
 * @param {HTMLInputElement} inputSubtask - The subtask input element.
 * @param {HTMLElement} addIcon - The add icon element.
 * @param {HTMLElement} inputIcons - The input icons container.
 */
function clearInput(inputSubtask, addIcon, inputIcons) {
  inputSubtask.value = "";
  toggleIcons(inputSubtask, addIcon, inputIcons);
  inputSubtask.focus();
}

/**
 * Displays a subtask in the subtask list.
 * @param {string} subtaskId - The subtask ID.
 * @param {string} subtaskText - The subtask text.
 */
function displaySubtask(subtaskId, subtaskText) {
  const subtaskElement = createSubtaskElement(subtaskId, subtaskText);
  document.getElementById("display_subtasks").appendChild(subtaskElement);
}

/**
 * Creates a subtask list item element with edit and delete functionality.
 * @param {string} subtaskId - The subtask ID.
 * @param {string} subtaskText - The subtask text.
 * @returns {HTMLElement} The subtask list item element.
 */
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

/**
 * Sets up double-click and edit button events for editing a subtask.
 * @param {HTMLElement} span - The subtask text span element.
 * @param {string} subtaskId - The subtask ID.
 * @param {HTMLElement} deleteButton - The delete button element.
 */
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

/**
 * Opens the edit mode for a subtask.
 * @param {HTMLElement} span - The subtask text span element.
 * @param {string} subtaskId - The subtask ID.
 * @param {HTMLElement} deleteButton - The delete button element.
 */
function openEditMode(span, subtaskId, deleteButton) {
  const inputContainer = createEditContainer(span, subtaskId, deleteButton);
  const subtaskItem = span.closest(".subtask-item");
  span.replaceWith(inputContainer);
  deleteButton.style.display = "none";
  subtaskItem.classList.add("editing");
}

/**
 * Creates the input container for editing a subtask.
 * @param {HTMLElement} span - The subtask text span element.
 * @param {string} subtaskId - The subtask ID.
 * @param {HTMLElement} deleteButton - The delete button element.
 * @returns {HTMLElement} The input container element.
 */
function createEditContainer(span, subtaskId, deleteButton) {
  const inputContainer = document.createElement("div");
  inputContainer.className = "edit-subtask-container";
  const inputWrapper = createInputWrapper(span, subtaskId, deleteButton, inputContainer);
  inputContainer.appendChild(inputWrapper);
  focusEditInput(inputWrapper);
  return inputContainer;
}

/**
 * Creates the input wrapper with input and icons for editing.
 * @param {HTMLElement} span - The subtask text span element.
 * @param {string} subtaskId - The subtask ID.
 * @param {HTMLElement} deleteButton - The delete button element.
 * @param {HTMLElement} inputContainer - The input container element.
 * @returns {HTMLElement} The input wrapper element.
 */
function createInputWrapper(span, subtaskId, deleteButton, inputContainer) {
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "input-wrapper";
  const input = createEditInput(span);
  const iconsContainer = createEditIcons(
    input,
    () => saveEdit(input, span, subtaskId, inputContainer, deleteButton),
    () => cancelEdit(inputContainer, span, deleteButton)
  );
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(iconsContainer);
  addEditInputListeners(input, span, subtaskId, inputContainer, deleteButton);
  return inputWrapper;
}

/**
 * Creates the input element for editing a subtask.
 * @param {HTMLElement} span - The subtask text span element.
 * @returns {HTMLInputElement} The input element.
 */
function createEditInput(span) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "edit-subtask-input";
  return input;
}

/**
 * Adds event listeners for blur and keydown to the edit input.
 * @param {HTMLInputElement} input - The input element.
 * @param {HTMLElement} span - The subtask text span element.
 * @param {string} subtaskId - The subtask ID.
 * @param {HTMLElement} inputContainer - The input container element.
 * @param {HTMLElement} deleteButton - The delete button element.
 */
function addEditInputListeners(input, span, subtaskId, inputContainer, deleteButton) {
  input.addEventListener("blur", () =>
    saveEdit(input, span, subtaskId, inputContainer, deleteButton)
  );
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
      saveEdit(input, span, subtaskId, inputContainer, deleteButton);
    if (e.key === "Escape") cancelEdit(inputContainer, span, deleteButton);
  });
}

/**
 * Focuses the input field inside the input wrapper.
 * @param {HTMLElement} inputWrapper - The input wrapper element.
 */
function focusEditInput(inputWrapper) {
  const input = inputWrapper.querySelector("input");
  if (input) input.focus();
}

/**
 * Creates the icons for editing a subtask and sets up their events.
 * @param {HTMLInputElement} input - The input element.
 * @param {Function} onSave - The function to call on save.
 * @param {Function} onCancel - The function to call on cancel.
 * @returns {HTMLElement} The icons container element.
 */
function createEditIcons(input, onSave, onCancel) {
  const iconsContainer = document.createElement("div");
  iconsContainer.className = "icons-container";
  iconsContainer.innerHTML = getEditIconsHTML();

  let clearIcon = iconsContainer.querySelector(".clear_icon_show_subtask");

  function createDeleteIcon() {
    const deleteImg = document.createElement("img");
    deleteImg.className = "delete_icon_show_subtask";
    deleteImg.src = "./assets/img/delete.svg";
    deleteImg.alt = "Delete";
    deleteImg.style.cursor = "pointer";
    deleteImg.addEventListener("mousedown", handleDeleteClick);
    return deleteImg;
  }

  function createClearIcon() {
    const newClearIcon = document.createElement("img");
    newClearIcon.className = "clear_icon_show_subtask";
    newClearIcon.src = "./assets/img/cancel.svg";
    newClearIcon.alt = "Clear";
    newClearIcon.addEventListener("mousedown", handleClearClick);
    return newClearIcon;
  }

  function handleDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const subtaskItem = input.closest(".subtask-item");
    if (subtaskItem) {
      const subtaskId = subtaskItem.id;
      removeSubtask(subtaskId, subtaskItem);
    }
  }

  function handleClearClick(e) {
    e.preventDefault();
    e.stopPropagation();
    input.value = "";
    switchToDeleteIcon();
  }

  function switchToDeleteIcon() {
    const deleteImg = createDeleteIcon();
    clearIcon.replaceWith(deleteImg);
    input.addEventListener("input", handleInputChange);
    clearIcon = deleteImg;
  }

  function switchToClearIcon() {
    const newClearIcon = createClearIcon();
    clearIcon.replaceWith(newClearIcon);
    input.removeEventListener("input", handleInputChange);
    clearIcon = newClearIcon;
  }

  function handleInputChange() {
    if (input.value.trim() === "") {
      switchToDeleteIcon();
    }
  }

  clearIcon.addEventListener("mousedown", handleClearClick);

  input.addEventListener("input", () => {
    if (input.value.trim() === "" && !clearIcon.classList.contains("delete_icon_show_subtask")) {
      switchToDeleteIcon();
    } else if (input.value.trim() !== "" && clearIcon.classList.contains("delete_icon_show_subtask")) {
      switchToClearIcon();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave();
    }
  });

  return iconsContainer;
}

/**
 * Saves the edited subtask and updates the UI.
 * @param {HTMLInputElement} input - The input element.
 * @param {HTMLElement} span - The subtask text span element.
 * @param {string} subtaskId - The subtask ID.
 * @param {HTMLElement} inputContainer - The input container element.
 * @param {HTMLElement} deleteButton - The delete button element.
 */
function saveEdit(input, span, subtaskId, inputContainer, deleteButton) {
  const newText = input.value.trim();
  const subtaskItem = inputContainer.closest(".subtask-item");

  if (newText !== "") {
    span.textContent = newText;
    subtasksObject[subtaskId].title = newText;
    inputContainer.replaceWith(span);
    subtaskItem.classList.remove("editing");
    deleteButton.style.display = "inline";
  }
}

/**
 * Cancels editing and restores the original subtask text.
 * @param {HTMLElement} inputContainer - The input container element.
 * @param {HTMLElement} span - The subtask text span element.
 * @param {HTMLElement} deleteButton - The delete button element.
 */
function cancelEdit(inputContainer, span, deleteButton) {
  const subtaskItem = inputContainer.closest(".subtask-item");
  const subtaskId = subtaskItem ? subtaskItem.id : null;
  if (!subtaskId) return;

  const originalText = subtasksObject[subtaskId].title;
  const updatedElement = createSubtaskElement(subtaskId, originalText);
  subtaskItem.replaceWith(updatedElement);
}

/**
 * Deletes a subtask from the subtasks object and removes it from the DOM.
 * @param {string} subtaskId - The subtask ID.
 * @param {HTMLElement} subtaskElement - The subtask element to remove.
 */
function removeSubtask(subtaskId, subtaskElement) {
  delete subtasksObject[subtaskId];
  subtaskElement.remove();
}

/**
 * Adds a new subtask to the object and UI.
 * @param {HTMLInputElement} inputSubtask - The subtask input element.
 */
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