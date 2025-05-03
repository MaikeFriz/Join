// Sets the active priority button based on the given priority.
function setPriorityActive(priority) {
    const priorityMap = {
      urgent: 'edit_urgent_button',
      medium: 'edit_medium_button',
      low: 'edit_low_button'
    };
  
    const buttonId = priorityMap[priority];
    if (buttonId) {
      const button = document.getElementById(buttonId);
      if (button) {
        button.classList.add('active');
      } else {
        console.error(`Button with ID "${buttonId}" not found.`);
      }
    } else {
      console.error(`No matching ID for priority "${priority}" found.`);
    }
}
  
// Initializes click event listeners for priority buttons.
function initializePriorityButtons() {
    const buttons = document.querySelectorAll(".priority-buttons-div > div");
    
    for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
        const button = buttons[buttonIndex];
        button.addEventListener("click", () => handleButtonClick(button));
    }
}
  
// Handles the click event for priority buttons and updates the active state.
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