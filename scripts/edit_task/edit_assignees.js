/**
 * Handles the selection or deselection of an assignee and updates the UI accordingly.
 * @param {string} userId - The user ID.
 * @param {boolean} isChecked - Whether the assignee is selected.
 */
function handleAssigneeSelection(userId, isChecked) {
    if (isChecked) {
        addAssigneeToEditUI(userId);
    } else {
        removeAssigneeFromEditUI(userId);
    }
}

/**
 * Adds the assignee to the edit UI by their user ID.
 * @param {string} userId - The user ID.
 */
function addAssigneeToEditUI(userId) {
    const assignedUsersDiv = document.querySelector(".edit-assigned-users");
    const user = kanbanData.users[userId];
    if (!user) return;
    const initials = getAssigneeInitals(user.name);
    const cssClass = getFitAssigneesToCSS(user.name);
    const userHTML = `<div id="assigned_user_${userId}" class="dropdown-edit-assignee-initials ${cssClass} initials-circle">${initials}</div>`;
    assignedUsersDiv.innerHTML += userHTML;
}

/**
 * Removes the assignee from the edit UI by their user ID.
 * @param {string} userId - The user ID.
 */
function removeAssigneeFromEditUI(userId) {
    const userElement = document.getElementById(`assigned_user_${userId}`);
    if (userElement) {
        userElement.remove();
    }
}

/**
 * Generates the HTML for the list of assignees in the dropdown.
 * @param {Object} kanbanData - The kanban data object.
 * @returns {string} The HTML string for all assignees.
 */
function getEditAssignees(kanbanData) {
    if (!kanbanData || !kanbanData.users) {
        return '';
    }
    let assigneesHTML = '';
    const users = Object.entries(kanbanData.users);
    for (let userIndex = 0; userIndex < users.length; userIndex++) {
        const userId = users[userIndex][0];
        const userData = users[userIndex][1];
        const name = userData.name;
        const initials = getAssigneeInitals(name);
        const cssClass = getFitAssigneesToCSS(name);
        assigneesHTML += editAssignedToDropdownTemplate(name, initials, cssClass, userId);
    }
    return assigneesHTML;
}

/**
 * Updates the "edit-assigned-users" div with the initials of the assigned users.
 * @param {string} taskId - The task ID.
 */
function displayEditAssignees(taskId) {
    const assignedUsersDiv = document.querySelector(".edit-assigned-users");
    const taskContent = getTaskContent(taskId, kanbanData);
    if (!taskContent || !taskContent.assignees) {
        assignedUsersDiv.innerHTML = "No assignees.";
        return;
    }
    const assignees = Object.keys(taskContent.assignees);
    const assigneeHTML = renderEditAssignees(assignees);
    assignedUsersDiv.innerHTML = assigneeHTML;
    updateDropdownCheckboxes(assignees);
}

/**
 * Renders the HTML for the assigned users.
 * @param {Array<string>} assignees - Array of assignee user IDs.
 * @returns {string} The HTML string for all assigned users.
 */
function renderEditAssignees(assignees) {
    let assigneeHTML = "";
    for (let assigneeIndex = 0; assigneeIndex < assignees.length; assigneeIndex++) {
        const assigneeId = assignees[assigneeIndex];
        const user = kanbanData.users[assigneeId];
        if (user) {
            const initials = getAssigneeInitals(user.name);
            const cssClass = getFitAssigneesToCSS(user.name);
            assigneeHTML += `<div id="assigned_user_${assigneeId}" class="dropdown-edit-assignee-initials ${cssClass} initials-circle">${initials}</div>`;
        } else {
            assigneeHTML += `<div class="dropdown-edit-assignee-initials unknown initials-circle">??</div>`;
        }
    }
    return assigneeHTML;
}

/**
 * Updates the state of checkboxes in the dropdown based on assigned user IDs.
 * @param {Array<string>} assignedUserIds - Array of assigned user IDs.
 */
function updateDropdownCheckboxes(assignedUserIds) {
    const checkboxes = document.querySelectorAll(".dropdown-edit-assigned-to input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
        const userId = checkbox.id.replace("assignee_", "");
        if (assignedUserIds.includes(userId)) {
            setCheckboxChecked(checkbox);
        } else {
            setCheckboxUnchecked(checkbox);
        }
    });
}

/**
 * Sets the checkbox to checked state and updates the UI.
 * @param {HTMLInputElement} checkbox - The checkbox element.
 */
function setCheckboxChecked(checkbox) {
    checkbox.checked = true;
    let parentLabel = checkbox.parentElement;
    parentLabel.querySelector(".checkbox-svg.unchecked").classList.add("hidden");
    parentLabel.querySelector(".checkbox-svg.checked").classList.remove("hidden");
}

/**
 * Sets the checkbox to unchecked state and updates the UI.
 * @param {HTMLInputElement} checkbox - The checkbox element.
 */
function setCheckboxUnchecked(checkbox) {
    checkbox.checked = false;
    let parentLabel = checkbox.parentElement;
    parentLabel.querySelector(".checkbox-svg.unchecked").classList.remove("hidden");
    parentLabel.querySelector(".checkbox-svg.checked").classList.add("hidden");
}

/**
 * Collects assigned users from the edit modal.
 * @returns {Object} An object with user IDs as keys and true as values.
 */
function getAssignedUsersFromEdit() {
    const assignedUsersDiv = document.querySelectorAll(".edit-assigned-users .dropdown-edit-assignee-initials");
    const assignees = {};
    for (let userIndex = 0; userIndex < assignedUsersDiv.length; userIndex++) {
        const userDiv = assignedUsersDiv[userIndex];
        const userId = userDiv.id.replace("assigned_user_", "");
        assignees[userId] = true;
    }
    return assignees;
}

/**
 * Extracts and returns the initials from a given name.
 * @param {string} name - The full name of the user.
 * @returns {string} The initials of the user.
 */
function getAssigneeInitals(name) {
    if (!name || typeof name !== "string") {
        return "??";
    }
    const nameParts = name.split(" ");
    const initials = nameParts.map(part => part[0].toUpperCase()).join('');
    return initials;
}
