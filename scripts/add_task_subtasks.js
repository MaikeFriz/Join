
let subtasksObject = {}; // Initialize the subtasks object
let highestSubtaskId = 0;

document.addEventListener("DOMContentLoaded", function () {
  initializeSubtaskListeners();
});

// Initializes all event listeners for subtask interactions
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

// Toggles the visibility of icons based on input content
function toggleIcons(inputSubtask, addIcon, inputIcons) {
  const isNotEmpty = inputSubtask.value.trim() !== "";
  addIcon.style.display = isNotEmpty ? "none" : "inline";
  inputIcons.style.display = isNotEmpty ? "flex" : "none";
}

// Resets the icons when the input loses focus
function resetIcons(inputSubtask, addIcon, inputIcons) {
  if (inputSubtask.value.trim() === "") toggleIcons(inputSubtask, addIcon, inputIcons);
}

// Clears the input field and resets icons
function clearInput(inputSubtask, addIcon, inputIcons) {
  inputSubtask.value = "";
  toggleIcons(inputSubtask, addIcon, inputIcons);
  inputSubtask.focus();
}

// Adds a new subtask
async function addSubtask(inputSubtask) {
    const subtaskText = inputSubtask.value.trim();
    if (subtaskText !== "") {
      await loadHighestSubtaskId();
      const newSubtaskId = `subtask${highestSubtaskId + 1}`;
      subtasksObject[newSubtaskId] = { title: subtaskText, completed: false }; // 'title' instead of 'text'
      displaySubtask(newSubtaskId, subtaskText);
      highestSubtaskId++;
      clearInput(inputSubtask, document.getElementById("add_icon"), document.getElementById("input_icons"));
    }
  }

// Loads the highest subtask ID from the database
async function loadHighestSubtaskId() {
  if (Object.keys(subtasksObject).length === 0) {
    const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json");
    const data = await response.json();
    highestSubtaskId = Math.max(...Object.keys(data.subtasks || {}).map(id => parseInt(id.replace('subtask', ''))), 0);
  }
}

// Displays a new subtask in the UI
function displaySubtask(subtaskId, subtaskText) {
  const subtaskElement = document.createElement("li");
  subtaskElement.className = "subtask-item";
  subtaskElement.id = subtaskId;
  subtaskElement.innerHTML = `
    <span>${subtaskText}</span>
    <button><img class="delete_button_subtask" src="./assets/img/delete.svg" alt="Delete" /></button>
  `;
  subtaskElement.querySelector("button").addEventListener("click", () => removeSubtask(subtaskId, subtaskElement));
  document.getElementById("display_subtasks").appendChild(subtaskElement);
}

// Removes a subtask from the UI and object
function removeSubtask(subtaskId, subtaskElement) {
  delete subtasksObject[subtaskId];
  subtaskElement.remove();
}