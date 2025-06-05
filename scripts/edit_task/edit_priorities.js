/**
 * Sets the active priority button based on the given priority.
 * @param {string} priority - The priority value ("urgent", "medium", or "low").
 */
function setPriorityActive(priority) {
  const priorityMap = {
    urgent: "edit_urgent_button",
    medium: "edit_medium_button",
    low: "edit_low_button",
  };

  const buttonId = priorityMap[priority];
  if (buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.classList.add("active");
    }
  }
}

/**
 * Initializes click event listeners for priority buttons.
 */
function initializePriorityButtons() {
  const buttons = document.querySelectorAll(".priority-buttons-div > div");

  for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
    const button = buttons[buttonIndex];
    button.addEventListener("click", () => handleButtonClick(button));
  }
}

/**
 * Handles the click event for priority buttons and updates the active state.
 * @param {HTMLElement} clickedButton - The button element that was clicked.
 */
function handleButtonClick(clickedButton) {
  const buttons = document.querySelectorAll(".priority-buttons-div > div");

  for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
    const button = buttons[buttonIndex];
    if (button.classList.contains("active")) {
      button.classList.remove("active");
    }
  }
  clickedButton.classList.add("active");
}
