// Stores the selected assignees for the task
let assigneesObject = {};

// Initializes the assignee dropdown on page load
document.addEventListener("DOMContentLoaded", initDropdown);

// Loads users and sets up the assignee dropdown
async function initDropdown() {
  try {
    const users = await fetchUsers();
    createDropdownOptions(users);
    setupDropdownEvents();
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

// Fetches users from localStorage (guest) or database (user)
async function fetchUsers() {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  let data;
  if (isGuest) {
    data = JSON.parse(localStorage.getItem("guestKanbanData"));
  } else {
    const response = await fetch(
      "https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json"
    );
    data = await response.json();
  }
  if (!data || !data.users) return [];
  return Object.entries(data.users).map(([userId, user]) => ({
    id: userId,
    name: user.name || "Unnamed User",
  }));
}

// Creates and appends dropdown options for each user
function createDropdownOptions(users) {
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  dropdownOptions.innerHTML = "";

  users.forEach((user) => {
    const option = createDropdownOptionTemplate(user);
    dropdownOptions.appendChild(option);
  });
}

// Creates a dropdown option element for a user
function createDropdownOptionTemplate(user) {
  const option = createDropdownOptionElement(user);
  setDropdownOptionState(option, user);
  setupDropdownOptionEvents(option, user);
  return option;
}

// Builds the dropdown option HTML element for a user
function createDropdownOptionElement(user) {
  const option = document.createElement("div");
  option.classList.add("custom-dropdown-option");
  option.dataset.value = user.name;
  option.dataset.userId = user.id;
  option.innerHTML = getDropdownOptionHTML(user);
  return option;
}

// Sets the selected state for a dropdown option if the user is already assigned
function setDropdownOptionState(option, user) {
  if (assigneesObject[user.id]) {
    option.classList.add("selected");
  }
}

// Adds mouse and click event listeners to a dropdown option
function setupDropdownOptionEvents(option, user) {
  const checkboxImg = option.querySelector(".checkbox-img");
  setupDropdownOptionMouseenter(option, checkboxImg);
  setupDropdownOptionMouseleave(option, checkboxImg);
  setupDropdownOptionClick(option, user, checkboxImg);
}

// Handles mouseenter event for a dropdown option (visual feedback)
function setupDropdownOptionMouseenter(option, checkboxImg) {
  option.addEventListener("mouseenter", () => {
    if (option.classList.contains("selected")) {
      checkboxImg.src = "./assets/img/checked_checkbox_white.svg";
      checkboxImg.classList.add("checkbox-scale");
    } else {
      checkboxImg.src = "./assets/img/checkbox_unchecked_white.svg";
      checkboxImg.classList.remove("checkbox-scale");
    }
  });
}

// Handles mouseleave event for a dropdown option (visual feedback)
function setupDropdownOptionMouseleave(option, checkboxImg) {
  option.addEventListener("mouseleave", () => {
    if (option.classList.contains("selected")) {
      checkboxImg.src = "./assets/img/checked_checkbox_white.svg";
      checkboxImg.classList.add("checkbox-scale");
    } else {
      checkboxImg.src = "./assets/img/checkbox_unchecked.svg";
      checkboxImg.classList.remove("checkbox-scale");
    }
  });
}

// Handles click event for a dropdown option (selects/deselects assignee)
function setupDropdownOptionClick(option, user, checkboxImg) {
  option.addEventListener("click", () => {
    option.classList.toggle("selected");
    const nowSelected = option.classList.contains("selected");
    if (nowSelected) {
      checkboxImg.src = "./assets/img/checked_checkbox_white.svg";
      checkboxImg.classList.add("checkbox-scale");
    } else {
      checkboxImg.src = "./assets/img/checkbox_unchecked_white.svg";
      checkboxImg.classList.remove("checkbox-scale");
    }
    toggleAssignee(user.id, user.name, option);
  });
}

// Returns the initials for a given assignee name
function getAssigneeInitials(assignee) {
  let assigneeInitials = "";
  if (assignee) {
    let names = assignee.split(" ");
    if (names.length >= 2) {
      assigneeInitials =
        names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
    } else if (names.length === 1) {
      assigneeInitials = names[0].charAt(0).toUpperCase();
    }
  }
  return assigneeInitials;
}

// Toggles the selection of an assignee and updates the UI
function toggleAssignee(userId, userName, optionElement) {
  const imgElement = optionElement.querySelector(".checkbox-img");
  if (assigneesObject[userId]) {
    delete assigneesObject[userId];
    imgElement.src = "./assets/img/checkbox_unchecked.svg";
    removeAssigneeElement(userId);
  } else {
    assigneesObject[userId] = { id: userId, name: userName };
    imgElement.src = "./assets/img/checked_checkbox.svg";
    addAssigneeElement(userId, userName);
  }
}

// Adds the selected assignee to the UI
function addAssigneeElement(userId, userName) {
  const showAssigneesDiv = document.getElementById("show-assignees");
  // Collect all assigned users
  const assignedUsers = Object.values(assigneesObject);
  // Only show the first 8, and a +N icon if more
  let html = "";
  for (let i = 0; i < Math.min(8, assignedUsers.length); i++) {
    const user = assignedUsers[i];
    html += createAssigneeTemplate(user.id, user.name);
  }
  if (assignedUsers.length > 8) {
    const moreCount = assignedUsers.length - 8;
    html += `<div class="assignee-item more-assignees-indicator"><span class="initials-circle more">+${moreCount}</span></div>`;
  }
  showAssigneesDiv.innerHTML = html;
}

// Removes the assignee from the selection and UI
function removeAssignee(userId) {
  delete assigneesObject[userId];
  const assigneeElement = document.getElementById(`assignee-${userId}`);
  if (assigneeElement) assigneeElement.remove();
  const dropdownOptions = document.querySelectorAll(".custom-dropdown-option");
  dropdownOptions.forEach((option) => {
    if (option.dataset.userId === userId) {
      option.querySelector(".checkbox-img").src =
        "./assets/img/checkbox_unchecked.svg";
      option.classList.remove("selected");
    }
  });
}

// Removes the assignee element from the UI
function removeAssigneeElement(userId) {
  const assigneeElement = document.getElementById(`assignee-${userId}`);
  if (assigneeElement) {
    assigneeElement.remove();
  }
}

// Sets up the dropdown open/close events for the assignee dropdown
function setupDropdownEvents() {
  const dropdown = document.getElementById("dropdown_assigned_to");
  dropdown.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdownOnClickOutside);
}

// Toggles the assignee dropdown open or closed
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("dropdown_assigned_to");
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  const isOpen = dropdownOptions.classList.contains("show");
  if (!isOpen) {
    dropdownOptions.classList.add("show");
    dropdown.classList.add("dropdown_open");
  } else {
    dropdownOptions.classList.remove("show");
    dropdown.classList.remove("dropdown_open");
  }
}

// Closes the dropdown if a click occurs outside of it
function closeDropdownOnClickOutside(event) {
  const dropdown = document.getElementById("dropdown_assigned_to");
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  if (
    !dropdown.contains(event.target) &&
    !dropdownOptions.contains(event.target)
  ) {
    closeDropdown();
  }
}

// Closes the assignee dropdown
function closeDropdown() {
  document.getElementById("dropdown_options_assignee").classList.remove("show");
  document
    .getElementById("dropdown_assigned_to")
    .classList.remove("dropdown_open");
}

// Initializes the priority selection buttons on page load
document.addEventListener("DOMContentLoaded", function () {
  initializePrioritySelection();
});

// Sets up the priority selection buttons and default active state
function initializePrioritySelection() {
  const urgentButton = document.getElementById("urgent_button");
  const mediumButton = document.getElementById("medium_button");
  const lowButton = document.getElementById("low_button");
  setupPriorityButtons(urgentButton, mediumButton, lowButton);
  setActiveButton(mediumButton);
}

// Adds click event listeners to the priority buttons
function setupPriorityButtons(urgentButton, mediumButton, lowButton) {
  urgentButton.addEventListener("click", () =>
    handlePriorityClick(urgentButton)
  );
  mediumButton.addEventListener("click", () =>
    handlePriorityClick(mediumButton)
  );
  lowButton.addEventListener("click", () => handlePriorityClick(lowButton));
}

// Handles the click event for a priority button
function handlePriorityClick(clickedButton) {
  removeActiveClassFromOtherButtons(clickedButton);
  setActiveButton(clickedButton);
}

// Removes the active class from all priority buttons except the clicked one
function removeActiveClassFromOtherButtons(clickedButton) {
  const allButtons = document.querySelectorAll(
    "#urgent_button, #medium_button, #low_button"
  );
  allButtons.forEach((button) => {
    if (button !== clickedButton && button.classList.contains("active")) {
      button.classList.remove("active");
    }
  });
}

function validateTaskForm() {
  const titleValid = validateTitleField();
  const dateValid = validateDateField();
  const categoryValid = validateCategoryField();
  return titleValid && dateValid && categoryValid;
}

function validateTitleField() {
  const titleInput = document.getElementById("input_title");
  const errorTitle = document.getElementById("error_message_title");
  resetTitleInputError();
  if (!titleInput.value.trim()) {
    titleInput.style.border = "1px solid red";
    errorTitle
      .querySelector("span")
      .classList.remove("d_none_error_message_title");
    return false;
  }
  return true;
}

function validateDateField() {
  const dateInput = document.querySelector('input[type="date"]');
  const errorDate = document.getElementById("error_message_date");
  resetDateInputError();
  if (!dateInput.value || isDateInPast(dateInput.value)) {
    dateInput.style.border = "1px solid red";
    errorDate
      .querySelector("span")
      .classList.remove("d_none_error_message_date");
    return false;
  }
  return true;
}

function validateCategoryField() {
  const categoryInput = document.getElementById("category");
  const errorCategory = document.getElementById("error_message_category");
  const dropdownCategory = document.getElementById("dropdown_category");
  resetCategoryInputError();
  if (!categoryInput.value) {
    dropdownCategory.style.border = "1px solid red";
    errorCategory
      .querySelector("span")
      .classList.remove("d_none_error_message_category");
    return false;
  }
  return true;
}

function validateTitle(titleInput) {
  const title = titleInput.value.trim();
  if (!title) {
    titleInput.focus();
    return false;
  }
  return true;
}

function resetTitleInputError() {
  const titleInput = document.getElementById("input_title");
  const errorTitle = document.getElementById("error_message_title");
  if (titleInput && errorTitle) {
    titleInput.style.border = "";
    errorTitle
      .querySelector("span")
      .classList.add("d_none_error_message_title");
  }
}

function resetDateInputError() {
  const dateInput = document.querySelector('input[type="date"]');
  const errorDate = document.getElementById("error_message_date");
  if (dateInput && errorDate) {
    dateInput.style.border = "";
    errorDate.querySelector("span").classList.add("d_none_error_message_date");
  }
}

function resetCategoryInputError() {
  const dropdownCategory = document.getElementById("dropdown_category");
  const errorCategory = document.getElementById("error_message_category");
  if (dropdownCategory && errorCategory) {
    dropdownCategory.style.border = "";
    errorCategory
      .querySelector("span")
      .classList.add("d_none_error_message_category");
  }
}

function validateDueDate(dueDateInput) {
  const dueDate = dueDateInput.value;
  if (!dueDate) {
    dueDateInput.focus();
    return false;
  }
  if (isDateInPast(dueDate)) {
    dueDateInput.focus();
    return false;
  }
  return true;
}

function isDateInPast(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateString);
  return selectedDate < today;
}

function validateCategory(categoryInput) {
  const category = categoryInput.value;
  if (!category) {
    categoryInput.focus();
    return false;
  }
  return true;
}

function validateTitle(titleInput) {
  const title = titleInput.value.trim();
  if (!title) {
    titleInput.focus();
    return false;
  }
  return true;
}

function validateDueDate(dueDateInput) {
  const dueDate = dueDateInput.value;
  if (!dueDate) {
    dueDateInput.focus();
    return false;
  }
  if (isDateInPast(dueDate)) {
    dueDateInput.focus();
    return false;
  }
  return true;
}

function isDateInPast(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateString);
  return selectedDate < today;
}

function validateCategory(categoryInput) {
  const category = categoryInput.value;
  if (!category) {
    categoryInput.focus();
    return false;
  }
  return true;
}

// Sets the clicked priority button as active
function setActiveButton(clickedButton) {
  clickedButton.classList.add("active");
}

// Initializes the category dropdown and its event listeners on page load
document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("dropdown_category");
  const optionsContainer = document.querySelector(".dropdown_options");
  const selectedText = document.getElementById("dropdown_selected");
  const inputField = document.getElementById("category");
  dropdown.addEventListener("click", function () {
    dropdown.parentElement.classList.toggle("open");
  });
  optionsContainer
    .querySelectorAll(".custom-dropdown-option")
    .forEach((option) => {
      option.addEventListener("click", function () {
        selectedText.textContent = this.textContent;
        inputField.value = this.dataset.value;
        dropdown.parentElement.classList.remove("open");
      });
    });
  document.addEventListener("click", function (event) {
    if (!dropdown.parentElement.contains(event.target)) {
      dropdown.parentElement.classList.remove("open");
    }
  });
});

// Clears all input fields and resets the add task form
function clearAllInputs() {
  const form = document.getElementById("task_form");
  form.reset();
  document.getElementById("dropdown_selected").textContent =
    "Select task category";
  document.getElementById("dropdown_selected_assignee").textContent =
    "Select a person";
  document.getElementById("display_subtasks").innerHTML = "";
  const priorityButtons = document.querySelectorAll(
    ".priority-buttons-div > div"
  );
  priorityButtons.forEach((button) => button.classList.remove("active"));
  const showAssignees = document.getElementById("show-assignees");
  showAssignees.innerHTML = "";
  const mediumButton = document.getElementById("medium_button");
  setActiveButton(mediumButton);

  // Clear assigned persons in the dropdown menu
  assigneesObject = {};
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

// Gets the category from the URL query parameters
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

document.addEventListener("DOMContentLoaded", function () {
  setupAddTaskOverlay();
  setupOverlayClickToBoard();
});

// Sets up the add task overlay and its styles based on the URL category
function setupAddTaskOverlay() {
  const addTaskFrame = document.getElementById("add_task_frame");
  const addTaskContainer = document.getElementById("add_task_container");
  const closeBtn = document.getElementById("close_add_task");
  const category = getCategoryFromUrl();
  if (addTaskFrame && addTaskContainer && category) {
    addTaskFrame.classList.add("add-task-frame");
    addTaskContainer.classList.add("add-task-overlay");
    if (closeBtn) closeBtn.classList.remove("d-none");
    setTimeout(() => {
      addTaskFrame.classList.add("active");
    }, 30);
  }
}

// Sets up the click event to redirect to the board page when clicking outside the overlay
function setupOverlayClickToBoard() {
  const addTaskContainer = document.getElementById("add_task_container");
  const addTaskFrame = document.getElementById("add_task_frame");
  if (addTaskContainer && addTaskFrame) {
    addTaskContainer.addEventListener("click", function (event) {
      if (!addTaskFrame.contains(event.target)) {
        addTaskFrame.classList.remove("active");
        document.body.style.overflow = "";
        setTimeout(() => {
          window.location.href = "board.html";
        }, 300);
      }
    });
  }
}

function closeAddTaskOverlay() {
  const addTaskFrame = document.getElementById("add_task_frame");
  if (addTaskFrame) {
    addTaskFrame.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => {
      window.location.href = "board.html";
    }, 300);
  }
}
