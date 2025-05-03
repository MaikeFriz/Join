// Toggles the visibility of the "Assigned to" dropdown.
function toggleEditDropdown() {
    const dropdown = document.getElementById("dropdown_edit_assigned_to");
    const trigger = document.getElementById("dropdown_assigned_to");
  
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
      trigger.classList.remove("dropdown_open");
    } else {
      dropdown.classList.add("show");
      trigger.classList.add("dropdown_open");
    }
}
  
// Toggles the visibility of the category dropdown.
function toggleCategoryDropdown() {
    const dropdown = document.getElementById("dropdown_options_category");
    const trigger = document.getElementById("dropdown_category");
  
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
      trigger.classList.remove("dropdown_open");
    } else {
      dropdown.classList.add("show");
      trigger.classList.add("dropdown_open");
    }
  }

// Closes the "Assigned to" dropdown if clicked outside.
function closeAssignedToDropdown(event) {
    const assignedDropdown = document.getElementById("dropdown_edit_assigned_to");
    const assignedTrigger = document.getElementById("dropdown_assigned_to");

    if (
        assignedDropdown &&
        assignedTrigger &&
        !assignedDropdown.contains(event.target) &&
        !assignedTrigger.contains(event.target)
    ) {
        assignedDropdown.classList.remove("show");
        assignedTrigger.classList.remove("dropdown_open");
    }
}

// Closes the category dropdown if clicked outside.
function closeCategoryDropdown(event) {
    const categoryDropdown = document.getElementById("dropdown_options_category");
    const categoryTrigger = document.getElementById("dropdown_category");

    if (
        categoryDropdown &&
        categoryTrigger &&
        !categoryDropdown.contains(event.target) &&
        !categoryTrigger.contains(event.target)
    ) {
        categoryDropdown.classList.remove("show");
        categoryTrigger.classList.remove("dropdown_open");
    }
}

// Closes dropdowns when clicking outside of them.
function closeDropdownOnOutsideClick(event) {
    closeAssignedToDropdown(event);
    closeCategoryDropdown(event);
}