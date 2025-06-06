let assigneesObject = {};

/**
 * Initializes all DOMContentLoaded listeners and sets up dropdowns and overlays.
 */
document.addEventListener("DOMContentLoaded", function () {
  initDropdown();
  initializePrioritySelection();
  setupAddTaskOverlay();
  setupOverlayClickToBoard();
  setupCategoryDropdown();
});

/**
 * Sets up the category dropdown open/close and option selection logic.
 */
function setupCategoryDropdown() {
  const dropdown = document.getElementById("dropdown_category");
  const optionsContainer = document.querySelector(".dropdown_options");
  const selectedText = document.getElementById("dropdown_selected");
  const inputField = document.getElementById("category");

  setupCategoryDropdownToggle(dropdown);
  setupCategoryDropdownOptions(optionsContainer, selectedText, inputField, dropdown);
  setupCategoryDropdownClose(dropdown);
}

/**
 * Adds click event to toggle the category dropdown open/close.
 * @param {HTMLElement} dropdown - The dropdown element.
 */
function setupCategoryDropdownToggle(dropdown) {
  dropdown.addEventListener("click", function () {
    dropdown.parentElement.classList.toggle("open");
  });
}

/**
 * Adds click events to each dropdown option to select and set the value.
 * @param {HTMLElement} optionsContainer - The container for dropdown options.
 * @param {HTMLElement} selectedText - The element displaying the selected text.
 * @param {HTMLElement} inputField - The hidden input field for the category.
 * @param {HTMLElement} dropdown - The dropdown element.
 */
function setupCategoryDropdownOptions(optionsContainer, selectedText, inputField, dropdown) {
  optionsContainer
    .querySelectorAll(".custom-dropdown-option")
    .forEach((option) => {
      option.addEventListener("click", function () {
        selectedText.textContent = this.textContent;
        inputField.value = this.dataset.value;
        dropdown.parentElement.classList.remove("open");
      });
    });
}

/**
 * Closes the category dropdown if a click occurs outside of it.
 * @param {HTMLElement} dropdown - The dropdown element.
 */
function setupCategoryDropdownClose(dropdown) {
  document.addEventListener("click", function (event) {
    if (!dropdown.parentElement.contains(event.target)) {
      dropdown.parentElement.classList.remove("open");
    }
  });
}

/**
 * Loads users and sets up the assignee dropdown.
 */
async function initDropdown() {
  try {
    const users = await fetchUsers();
    createDropdownOptions(users);
    setupDropdownEvents();
  } catch (error) {}
}

/**
 * Fetches users from localStorage (guest) or database (user).
 * @returns {Promise<Array>} Array of user objects.
 */
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
    id: userId, name: user.name || "Unnamed User",
  }));
}

/**
 * Sets up the dropdown open/close events for the assignee dropdown.
 */
function setupDropdownEvents() {
  const dropdown = document.getElementById("dropdown_assigned_to");
  dropdown.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdownOnClickOutside);
}

/**
 * Toggles the assignee dropdown open or closed.
 * @param {Event} event - The click event.
 */
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

/**
 * Closes the dropdown if a click occurs outside of it.
 * @param {Event} event - The click event.
 */
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

/**
 * Closes the assignee dropdown.
 */
function closeDropdown() {
  document.getElementById("dropdown_options_assignee").classList.remove("show");
  document
    .getElementById("dropdown_assigned_to")
    .classList.remove("dropdown_open");
}

/**
 * Sets up the priority selection buttons and default active state.
 */
function initializePrioritySelection() {
  const urgentButton = document.getElementById("urgent_button");
  const mediumButton = document.getElementById("medium_button");
  const lowButton = document.getElementById("low_button");
  setupPriorityButtons(urgentButton, mediumButton, lowButton);
  setActiveButton(mediumButton);
}

/**
 * Adds click event listeners to the priority buttons.
 * @param {HTMLElement} urgentButton - The urgent priority button.
 * @param {HTMLElement} mediumButton - The medium priority button.
 * @param {HTMLElement} lowButton - The low priority button.
 */
function setupPriorityButtons(urgentButton, mediumButton, lowButton) {
  urgentButton.addEventListener("click", () =>
    handlePriorityClick(urgentButton)
  );
  mediumButton.addEventListener("click", () =>
    handlePriorityClick(mediumButton)
  );
  lowButton.addEventListener("click", () => handlePriorityClick(lowButton));
}

/**
 * Handles the click event for a priority button.
 * @param {HTMLElement} clickedButton - The clicked priority button.
 */
function handlePriorityClick(clickedButton) {
  removeActiveClassFromOtherButtons(clickedButton);
  setActiveButton(clickedButton);
}

/**
 * Removes the active class from all priority buttons except the clicked one.
 * @param {HTMLElement} clickedButton - The clicked priority button.
 */
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

/**
 * Sets the clicked priority button as active.
 * @param {HTMLElement} clickedButton - The clicked priority button.
 */
function setActiveButton(clickedButton) {
  clickedButton.classList.add("active");
}