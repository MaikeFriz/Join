/**
 * Clears all input fields and resets the add task form.
 */
function clearAllInputs() {
  resetFormFields();
  resetDropdowns();
  resetSubtasksUI();
  resetPriorityButtons();
  resetAssigneesUI();
  resetAssigneesObject();
  resetDropdownOptions();
  resetAllErrorMessages();
}

/**
 * Resets the task form fields.
 */
function resetFormFields() {
  const form = document.getElementById("task_form");
  form.reset();
}

/**
 * Resets the dropdowns to their default text.
 */
function resetDropdowns() {
  document.getElementById("dropdown_selected").textContent =
    "Select task category";
  document.getElementById("dropdown_selected_assignee").textContent =
    "Select a person";
}

/**
 * Clears the subtasks display area.
 */
function resetSubtasksUI() {
  document.getElementById("display_subtasks").innerHTML = "";
}

/**
 * Resets the priority buttons to default state.
 */
function resetPriorityButtons() {
  const priorityButtons = document.querySelectorAll(
    ".priority-buttons-div > div"
  );
  priorityButtons.forEach((button) => button.classList.remove("active"));
  const mediumButton = document.getElementById("medium_button");
  setActiveButton(mediumButton);
}

/**
 * Clears the assignees display area.
 */
function resetAssigneesUI() {
  const showAssignees = document.getElementById("show-assignees");
  showAssignees.innerHTML = "";
}

/**
 * Resets the assignees object to empty.
 */
function resetAssigneesObject() {
  assigneesObject = {};
}

/**
 * Resets all dropdown options to unselected state.
 */
function resetDropdownOptions() {
  const dropdownOptions = document.querySelectorAll(".custom-dropdown-option");
  dropdownOptions.forEach((option) => {
    option.classList.remove("selected");
    const checkboxImg = option.querySelector(".checkbox-img");
    if (checkboxImg) {
      checkboxImg.src = "./assets/img/checkbox_unchecked.svg";
      checkboxImg.classList.remove("checkbox-scale");
    }
  });
}

/**
 * Gets the category from the URL query parameters.
 * @returns {string|null} The category parameter from the URL.
 */
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

/**
 * Maps the category parameter from the URL to the database category name.
 * @param {string} categoryParameter - The category parameter from the URL.
 * @returns {string} The mapped database category name.
 */
function mapCategoryParameterToDatabaseCategory(categoryParameter) {
  const categoryMapping = {
    toDoCardsColumn: "toDo",
    inProgressCardsColumn: "inProgress",
    awaitFeedbackCardsColumn: "awaitingFeedback",
    doneCardsColumn: "done"
  };
  return categoryMapping[categoryParameter] || "toDo";
}

/**
 * Returns the selected assignees as an object.
 * @returns {Object} The selected assignees.
 */
function getAssignedUsers() {
  let assignees = {};
  for (let assigneeId in assigneesObject) {
    if (assigneesObject.hasOwnProperty(assigneeId)) {
      assignees[assigneeId] = true;
    }
  }
  return assignees;
}

/**
 * Returns the selected subtasks as an object.
 * @returns {Object} The selected subtasks.
 */
function getSubtaskDetails() {
  let subtasks = {};
  for (let subtaskId in subtasksObject) {
    subtasks[subtaskId] = true;
  }
  return subtasks;
}

/**
 * Prepares the subtasks object for saving to the database or localStorage.
 * @param {Object} existingSubtasks - The existing subtasks object.
 * @param {string} taskId - The task ID.
 * @returns {Object} The updated subtasks object.
 */
function prepareSubtasksForDatabase(existingSubtasks, taskId) {
  const newSubtasks = { ...existingSubtasks };
  for (let subtaskId in subtasksObject) {
    if (!newSubtasks[subtaskId]) {
      newSubtasks[subtaskId] = {
        ...subtasksObject[subtaskId],
        [taskId]: true,
      };
    }
  }
  return newSubtasks;
}

/**
 * Loads the highest subtask ID depending on guest or user mode.
 * @returns {Promise<void>}
 */
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

/**
 * Gets the highest subtask ID for a guest from localStorage.
 * @returns {number} The highest subtask ID.
 */
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

/**
 * Gets the highest subtask ID for a user from the database.
 * @returns {Promise<number>} The highest subtask ID.
 */
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







