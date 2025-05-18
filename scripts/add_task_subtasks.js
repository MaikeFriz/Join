let subtasksObject = {};
let highestSubtaskId = 0;


document.addEventListener("DOMContentLoaded", function () {
  initializeSubtaskListeners();
});


function initializeSubtaskListeners() {
  const inputSubtask = document.getElementById("input_subtask");
  const addIcon = document.getElementById("add_icon");
  const inputIcons = document.getElementById("input_icons");
  const checkIcon = document.getElementById("check_icon");
  const clearIcon = document.getElementById("clear_icon");

  inputSubtask.addEventListener("input", () => toggleIcons(inputSubtask, addIcon, inputIcons));
  inputSubtask.addEventListener("blur", () => resetIcons(inputSubtask, addIcon, inputIcons));
  clearIcon.addEventListener("click", () => clearInput(inputSubtask, addIcon, inputIcons));
  checkIcon.addEventListener("click", () => addSubtask(inputSubtask));
}


function toggleIcons(inputSubtask, addIcon, inputIcons) {
  const isNotEmpty = inputSubtask.value.trim() !== "";
  addIcon.style.display = isNotEmpty ? "none" : "inline";
  inputIcons.style.display = isNotEmpty ? "flex" : "none";
}


function resetIcons(inputSubtask, addIcon, inputIcons) {
  if (inputSubtask.value.trim() === "") toggleIcons(inputSubtask, addIcon, inputIcons);
}


function clearInput(inputSubtask, addIcon, inputIcons) {
  inputSubtask.value = "";
  toggleIcons(inputSubtask, addIcon, inputIcons);
  inputSubtask.focus();
}


async function addSubtask(inputSubtask) {
  const subtaskText = inputSubtask.value.trim();
  if (subtaskText !== "") {
    await loadHighestSubtaskId();
    const newSubtaskId = `subtask${highestSubtaskId + 1}`;
    subtasksObject[newSubtaskId] = { title: subtaskText, completed: false };
    displaySubtask(newSubtaskId, subtaskText);
    highestSubtaskId++;
    clearInput(inputSubtask, document.getElementById("add_icon"), document.getElementById("input_icons"));
  }
}


async function loadHighestSubtaskId() {
  if (Object.keys(subtasksObject).length === 0) {
    const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json");
    const data = await response.json();
    highestSubtaskId = Math.max(...Object.keys(data.subtasks || {}).map(id => parseInt(id.replace('subtask', ''))), 0);
  }
}


function displaySubtask(subtaskId, subtaskText) {
  const subtaskElement = createSubtaskElement(subtaskId, subtaskText);
  document.getElementById("display_subtasks").appendChild(subtaskElement);
}


function createSubtaskElement(subtaskId, subtaskText) {
  const subtaskElement = document.createElement("li");
  subtaskElement.className = "subtask-item";
  subtaskElement.id = subtaskId;
  subtaskElement.innerHTML = getSubtaskHtmlTemplate(subtaskText);

  const deleteButton = subtaskElement.querySelector("button");
  deleteButton.addEventListener("click", () =>
    removeSubtask(subtaskId, subtaskElement)
  );
  const span = subtaskElement.querySelector(".subtask-text");
  const deleteImg = subtaskElement.querySelector(".delete_button_subtask");
  setupEditEvents(span, subtaskId, deleteImg);
  return subtaskElement;
}


function setupEditEvents(span, subtaskId, deleteButton) {
  span.addEventListener("dblclick", () => {
    openEditMode(span, subtaskId, deleteButton);
  });
  const editButton = deleteButton.parentElement.nextElementSibling.querySelector(".edit_button_subtask");
  editButton.addEventListener("click", () => {
    openEditMode(span, subtaskId, deleteButton);
  });
}


function openEditMode(span, subtaskId, deleteButton) {
  const inputContainer = createEditContainer(span, subtaskId, deleteButton);
  const subtaskItem = span.closest(".subtask-item");
  span.replaceWith(inputContainer);
  deleteButton.style.display = "none";
  subtaskItem.classList.add("editing");
}


function createInputContainer() {
  const container = document.createElement("div");
  container.className = "edit-subtask-container";
  return container;
}


function createInputWrapper() {
  const wrapper = document.createElement("div");
  wrapper.className = "input-wrapper";
  return wrapper;
}


function createInput(textContent) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = textContent;
  input.className = "edit-subtask-input";
  return input;
}


function createEditIcons(inputElement, saveCallback, cancelCallback) {
  const iconsContainer = document.createElement("div");
  iconsContainer.className = "edit-icons-container";
  const saveIcon = document.createElement("span");
  saveIcon.innerHTML = `<i class="bi bi-check-lg"></i>`;
  saveIcon.addEventListener("click", () => saveCallback());
  const cancelIcon = document.createElement("span");
  cancelIcon.innerHTML = `<i class="bi bi-x-lg"></i>`;
  cancelIcon.addEventListener("click", () => cancelCallback());
  iconsContainer.appendChild(saveIcon);
  iconsContainer.appendChild(cancelIcon);
  return iconsContainer;
}


function addInputEventListeners(inputElement, saveCallback, cancelCallback) {
  inputElement.addEventListener("blur", () => saveCallback());
  inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveCallback();
    if (e.key === "Escape") cancelCallback();
  });
}


function createEditContainer(span, subtaskId, deleteButton) {
  const inputContainer = createInputContainer();
  const inputWrapper = createInputWrapper();
  const input = createInput(span.textContent);
  const iconsContainer = createEditIcons(input,
    () => saveEdit(input, span, subtaskId, inputContainer, deleteButton),
    () => cancelEdit(inputContainer, span, deleteButton)
  );
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(iconsContainer);
  inputContainer.appendChild(inputWrapper);
  input.focus();
  addInputEventListeners(input,
    () => saveEdit(input, span, subtaskId, inputContainer, deleteButton),
    () => cancelEdit(inputContainer, span, deleteButton)
  );
  return inputContainer;
}


function createEditIconsContainer() {
    const iconsContainer = document.createElement("div");
    iconsContainer.className = "icons-container";
    return iconsContainer;
}


function addSaveIconEventListener(saveIcon, onSave) {
    saveIcon.addEventListener("click", onSave);
}


function addClearIconEventListener(clearIcon, inputElement) {
    clearIcon.addEventListener("click", (e) => {
        e.preventDefault();
        inputElement.value = "";
    });
}


function createEditIcons(inputElement, onSave, onCancel) {
    const iconsContainer = createEditIconsContainer();
    iconsContainer.innerHTML = generateEditIconsTemplate();
    const saveIcon = iconsContainer.querySelector(".check-icon");
    const clearIcon = iconsContainer.querySelector(".clear_icon_show_subtask");
    addSaveIconEventListener(saveIcon, onSave);
    addClearIconEventListener(clearIcon, inputElement);
    return iconsContainer;
}


function saveEdit(input, span, subtaskId, inputContainer, deleteButton) {
  const newText = input.value.trim();
  const subtaskItem = inputContainer.closest(".subtask-item");
  if (newText !== "") {
    span.textContent = newText;
    subtasksObject[subtaskId].title = newText;
  }
  const updatedElement = createSubtaskElement(subtaskId, newText);
  subtaskItem.replaceWith(updatedElement);
}


function cancelEdit(inputContainer, span, deleteButton) {
  const subtaskId = span.closest(".subtask-item").id;
  const originalText = subtasksObject[subtaskId].title;
  const updatedElement = createSubtaskElement(subtaskId, originalText);
  inputContainer.closest(".subtask-item").replaceWith(updatedElement);
}


function removeSubtask(subtaskId, subtaskElement) {
  delete subtasksObject[subtaskId];
  subtaskElement.remove();
}