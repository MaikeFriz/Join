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


function displaySubtask(subtaskId, subtaskText) {
  const subtaskElement = createSubtaskElement(subtaskId, subtaskText);
  document.getElementById("display_subtasks").appendChild(subtaskElement);
}


function createSubtaskElement(subtaskId, subtaskText) {
    const subtaskElement = document.createElement("li");
    subtaskElement.className = "subtask-item";
    subtaskElement.id = subtaskId;
    subtaskElement.innerHTML = getSubtaskElementHTML(subtaskText);
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


function createEditContainer(span, subtaskId, deleteButton) {
  const inputContainer = document.createElement("div");
  inputContainer.className = "edit-subtask-container";
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "input-wrapper";
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "edit-subtask-input";
  const iconsContainer = createEditIcons(input, () => saveEdit(input, span, subtaskId, inputContainer, deleteButton), () => cancelEdit(inputContainer, span, deleteButton));
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(iconsContainer);
  inputContainer.appendChild(inputWrapper);
  input.focus();
  input.addEventListener("blur", () => saveEdit(input, span, subtaskId, inputContainer, deleteButton));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit(input, span, subtaskId, inputContainer, deleteButton);
    if (e.key === "Escape") cancelEdit(inputContainer, span, deleteButton);
  });
  return inputContainer;
}


function createEditIcons(input, onSave, onCancel) {
    const iconsContainer = document.createElement("div");
    iconsContainer.className = "icons-container";
    iconsContainer.innerHTML = getEditIconsHTML();
    iconsContainer.querySelector(".check-icon").addEventListener("click", onSave);
    iconsContainer.querySelector(".clear_icon_show_subtask").addEventListener("click", (e) => {
        e.preventDefault();
        input.value = "";
        if (typeof onCancel === "function") onCancel();
    });
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
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      highestSubtaskId = getHighestSubtaskIdForGuest();
    } else {
      highestSubtaskId = await getHighestSubtaskIdForUser();
    }
  }
}


function getHighestSubtaskIdForGuest() {
  const guestData = JSON.parse(localStorage.getItem("guestKanbanData")) || {};
  const guestSubtasks = guestData.subtasks || {};
  const subtaskList = Object.keys(guestSubtasks);
  let highestSubtask = 0;
  for (let subtaskIndex = 0; subtaskIndex < subtaskList.length; subtaskIndex++) {
    const subtaskId = subtaskList[subtaskIndex];
    const subtaskNumber = parseInt(subtaskId.replace('subtask', ''));
    if (subtaskNumber > highestSubtask) highestSubtask = subtaskNumber;
  }
  return highestSubtask;
}


async function getHighestSubtaskIdForUser() {
  const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json");
  const data = await response.json();
  const subtaskList = Object.keys(data.subtasks || {});
  let highestSubtask = 0;
  for (let subtaskIndex = 0; subtaskIndex < subtaskList.length; subtaskIndex++) {
    const subtaskId = subtaskList[subtaskIndex];
    const subtaskNumber = parseInt(subtaskId.replace('subtask', ''));
    if (subtaskNumber > highestSubtask) highestSubtask = subtaskNumber;
  }
  return highestSubtask;
}