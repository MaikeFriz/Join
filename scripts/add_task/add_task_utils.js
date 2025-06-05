// Clears all input fields and resets the add task form
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


// Resets the task form fields
function resetFormFields() {
  const form = document.getElementById("task_form");
  form.reset();
}


// Resets the dropdowns to their default text
function resetDropdowns() {
  document.getElementById("dropdown_selected").textContent =
    "Select task category";
  document.getElementById("dropdown_selected_assignee").textContent =
    "Select a person";
}


// Clears the subtasks display area
function resetSubtasksUI() {
  document.getElementById("display_subtasks").innerHTML = "";
}


// Resets the priority buttons to default state
function resetPriorityButtons() {
  const priorityButtons = document.querySelectorAll(
    ".priority-buttons-div > div"
  );
  priorityButtons.forEach((button) => button.classList.remove("active"));
  const mediumButton = document.getElementById("medium_button");
  setActiveButton(mediumButton);
}


// Clears the assignees display area
function resetAssigneesUI() {
  const showAssignees = document.getElementById("show-assignees");
  showAssignees.innerHTML = "";
}


// Resets the assignees object to empty
function resetAssigneesObject() {
  assigneesObject = {};
}


// Resets all dropdown options to unselected state
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


// Gets the category from the URL query parameters
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}


