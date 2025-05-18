let assigneesObject = {};


document.addEventListener("DOMContentLoaded", initDropdown);
async function initDropdown() {
  try {
    const users = await fetchUsers();
    createDropdownOptions(users);
    setupDropdownEvents();
  } catch (error) {
    console.error("Error loading users:", error);
  }
}


async function fetchUsers() {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  let data;
  if (isGuest) {
    data = JSON.parse(localStorage.getItem("guestKanbanData"));
  } else {
    const response = await fetch("https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData.json");
    data = await response.json();
  }
  if (!data || !data.users) return [];
  return Object.entries(data.users).map(([userId, user]) => ({
    id: userId,
    name: user.name || "Unnamed User",
  }));
}


function createDropdownOptions(users) {
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  dropdownOptions.innerHTML = "";

  users.forEach((user) => {
    const option = createDropdownOptionTemplate(user);
    dropdownOptions.appendChild(option);
  });
}


function createDropdownOptionElement(user) {
    const option = document.createElement("div");
    option.classList.add("custom-dropdown-option");
    option.dataset.value = user.name;
    option.dataset.userId = user.id;
    const isChecked = assigneesObject[user.id] ? "checked_checkbox.svg" : "checkbox_unchecked.svg";
    const initials = getAssigneeInitials(user.name);
    const firstLetter = user.name[0].toLowerCase();
    option.innerHTML = generateDropdownOptionTemplate(initials, user.name, firstLetter, isChecked);

    if (assigneesObject[user.id]) {
        option.classList.add("selected");
    }
    return option;
}


function setCheckboxImage(checkboxImg, isSelected, isHovered) {
    let imageName = "checkbox_unchecked.svg";
    if (isSelected) {
        imageName = "checked_checkbox_white.svg";
    } else if (isHovered) {
        imageName = "checkbox_unchecked_white.svg";
    } else if (isSelected) {
        imageName = "checked_checkbox.svg"
    }

    checkboxImg.src = `./assets/img/${imageName}`;
    checkboxImg.classList.toggle("checkbox-scale", isSelected || isHovered);
}


function addDropdownOptionEventListeners(option, user) {
  const checkboxImg = option.querySelector(".checkbox-img");
  option.addEventListener("mouseenter", () => {
    setCheckboxImage(checkboxImg, option.classList.contains("selected"), true);
  });
  option.addEventListener("mouseleave", () => {
      setCheckboxImage(checkboxImg, option.classList.contains("selected"), false);
  });
  option.addEventListener("click", () => {
    option.classList.toggle("selected");
    const isSelected = option.classList.contains("selected");
    setCheckboxImage(checkboxImg, isSelected, false);
    toggleAssignee(user.id, user.name, option);
  });
}


function createDropdownOptionTemplate(user) {
    const option = createDropdownOptionElement(user);
    addDropdownOptionEventListeners(option, user);
    return option;
}


function getAssigneeInitials(assignee) {
  let assigneeInitials = "";
  if (assignee) {
    let names = assignee.split(" ");
    if (names.length >= 2) {
      assigneeInitials = names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
    } else if (names.length === 1) {
      assigneeInitials = names[0].charAt(0).toUpperCase();
    }
  }
  return assigneeInitials;
}


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


function addAssigneeElement(userId, userName) {
  const showAssigneesDiv = document.getElementById("show-assignees");

  if (document.getElementById(`assignee-${userId}`)) return;

  const assigneeTemplate = createAssigneeTemplate(userId, userName);
  showAssigneesDiv.innerHTML += assigneeTemplate;
}


function createAssigneeTemplate(userId, userName) {
    const initials = getAssigneeInitials(userName);
    const firstLetter = userName[0].toLowerCase();
    return generateAssigneeTemplate(userId, initials, firstLetter);
}


function removeAssignee(userId) {
  delete assigneesObject[userId];

  const assigneeElement = document.getElementById(`assignee-${userId}`);
  if (assigneeElement) assigneeElement.remove();

  const dropdownOptions = document.querySelectorAll(".custom-dropdown-option");
  dropdownOptions.forEach((option) => {
    if (option.dataset.userId === userId) {
      option.querySelector(".checkbox-img").src = "./assets/img/checkbox_unchecked.svg";
      option.classList.remove("selected");
    }
  });
}


function removeAssigneeElement(userId) {
  const assigneeElement = document.getElementById(`assignee-${userId}`);
  if (assigneeElement) {
    assigneeElement.remove();
  }
}


function setupDropdownEvents() {
  const dropdown = document.getElementById("dropdown_assigned_to");
  dropdown.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdownOnClickOutside);
}


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


function closeDropdownOnClickOutside(event) {
  const dropdown = document.getElementById("dropdown_assigned_to");
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  if (!dropdown.contains(event.target) && !dropdownOptions.contains(event.target)) {
    closeDropdown();
  }
}


function closeDropdown() {
  document.getElementById("dropdown_options_assignee").classList.remove("show");
  document.getElementById("dropdown_assigned_to").classList.remove("dropdown_open");
}


document.addEventListener("DOMContentLoaded", function () {
  initializePrioritySelection();
});


function initializePrioritySelection() {
  const urgentButton = document.getElementById("urgent_button");
  const mediumButton = document.getElementById("medium_button");
  const lowButton = document.getElementById("low_button");

  setupPriorityButtons(urgentButton, mediumButton, lowButton);
  setActiveButton(mediumButton);
}


function setupPriorityButtons(urgentButton, mediumButton, lowButton) {
  urgentButton.addEventListener("click", () =>
    handlePriorityClick(urgentButton)
  );
  mediumButton.addEventListener("click", () =>
    handlePriorityClick(mediumButton)
  );
  lowButton.addEventListener("click", () => handlePriorityClick(lowButton));
}


function handlePriorityClick(clickedButton) {
  removeActiveClassFromOtherButtons(clickedButton);
  setActiveButton(clickedButton);
}


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


function setActiveButton(clickedButton) {
  clickedButton.classList.add("active");
}


document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("dropdown_category");
  const optionsContainer = document.querySelector(".dropdown_options");
  const selectedText = document.getElementById("dropdown_selected");
  const inputField = document.getElementById("category");
  dropdown.addEventListener("click", function () {
    dropdown.parentElement.classList.toggle("open");
  });


  document.querySelectorAll(".custom-dropdown-option").forEach((option) => {
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


function clearAllInputs() {
  const form = document.getElementById("task_form");
  form.reset();
  document.getElementById("dropdown_selected").textContent = "Select task category";
  document.getElementById("dropdown_selected_assignee").textContent = "Select a person";
  document.getElementById("display_subtasks").innerHTML = "";
  const priorityButtons = document.querySelectorAll(".priority-buttons-div > div");
  priorityButtons.forEach((button) => button.classList.remove("active"));
  const showAssignees = document.getElementById("show-assignees");
  showAssignees.innerHTML = "";
}
