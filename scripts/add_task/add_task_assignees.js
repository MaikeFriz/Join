/**
 * Creates and appends dropdown options for each user.
 * @param {Array} users - Array of user objects.
 */
function createDropdownOptions(users) {
  const dropdownOptions = document.getElementById("dropdown_options_assignee");
  dropdownOptions.innerHTML = "";
  users.forEach((user) => {
    const option = createDropdownOptionTemplate(user);
    dropdownOptions.appendChild(option);
  });
}

/**
 * Creates a dropdown option element for a user.
 * @param {Object} user - The user object.
 * @returns {HTMLElement} The dropdown option element.
 */
function createDropdownOptionTemplate(user) {
  const option = createDropdownOptionElement(user);
  setDropdownOptionState(option, user);
  setupDropdownOptionEvents(option, user);
  return option;
}

/**
 * Builds the dropdown option HTML element for a user.
 * @param {Object} user - The user object.
 * @returns {HTMLElement} The dropdown option element.
 */
function createDropdownOptionElement(user) {
  const option = document.createElement("div");
  option.classList.add("custom-dropdown-option");
  option.dataset.value = user.name;
  option.dataset.userId = user.id;
  option.innerHTML = getDropdownOptionHTML(user);
  return option;
}

/**
 * Sets the selected state for a dropdown option if the user is already assigned.
 * @param {HTMLElement} option - The dropdown option element.
 * @param {Object} user - The user object.
 */
function setDropdownOptionState(option, user) {
  if (assigneesObject[user.id]) {
    option.classList.add("selected");
  }
}

/**
 * Adds mouse and click event listeners to a dropdown option.
 * @param {HTMLElement} option - The dropdown option element.
 * @param {Object} user - The user object.
 */
function setupDropdownOptionEvents(option, user) {
  const checkboxImg = option.querySelector(".checkbox-img");
  setupDropdownOptionMouseenter(option, checkboxImg);
  setupDropdownOptionMouseleave(option, checkboxImg);
  setupDropdownOptionClick(option, user, checkboxImg);
}

/**
 * Handles mouseenter event for a dropdown option (visual feedback).
 * @param {HTMLElement} option - The dropdown option element.
 * @param {HTMLElement} checkboxImg - The checkbox image element.
 */
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

/**
 * Handles mouseleave event for a dropdown option (visual feedback).
 * @param {HTMLElement} option - The dropdown option element.
 * @param {HTMLElement} checkboxImg - The checkbox image element.
 */
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

/**
 * Handles click event for a dropdown option (selects/deselects assignee).
 * @param {HTMLElement} option - The dropdown option element.
 * @param {Object} user - The user object.
 * @param {HTMLElement} checkboxImg - The checkbox image element.
 */
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

/**
 * Returns the initials for a given assignee name.
 * @param {string} assignee - The assignee's full name.
 * @returns {string} The initials.
 */
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

/**
 * Toggles the selection of an assignee and updates the UI.
 * @param {string} userId - The user ID.
 * @param {string} userName - The user name.
 * @param {HTMLElement} optionElement - The dropdown option element.
 */
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

/**
 * Adds the selected assignee to the UI.
 * @param {string} userId - The user ID.
 * @param {string} userName - The user name.
 */
function addAssigneeElement(userId, userName) {
  const showAssigneesDiv = document.getElementById("show-assignees");
  const assignedUsers = Object.values(assigneesObject);
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

/**
 * Removes the assignee from the selection and UI.
 * @param {string} userId - The user ID.
 */
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

/**
 * Removes the assignee element from the UI.
 * @param {string} userId - The user ID.
 */
function removeAssigneeElement(userId) {
  const assigneeElement = document.getElementById(`assignee-${userId}`);
  if (assigneeElement) {
    assigneeElement.remove();
  }
}