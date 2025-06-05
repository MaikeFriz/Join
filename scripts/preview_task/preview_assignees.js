/**
 * Generates HTML for all assignees based on the provided task and display context.
 * @param {Object} taskContent - The task object containing assignee names.
 * @param {string} displayContext - The display context ("focused" or other).
 * @returns {string} The generated HTML for the assignees.
 */
function getAssignees(taskContent, displayContext) {
  const names = taskContent.assigneesNames || [];
  const maxToShow = 4;
  const showCount = displayContext === "focused" ? names.length : Math.min(maxToShow, names.length);

  let assigneesHTML = getAssigneesHTML(names, showCount, displayContext);

  if (displayContext !== "focused" && names.length > maxToShow) {
    assigneesHTML += getMoreAssigneesIndicator(names.length, maxToShow);
  }
  return assigneesHTML; 
}

/**
 * Generates HTML for the visible assignees.
 * @param {Array<string>} names - Array of assignee names.
 * @param {number} showCount - Number of assignees to show.
 * @param {string} displayContext - The display context ("focused" or other).
 * @returns {string} The generated HTML for the visible assignees.
 */
function getAssigneesHTML(names, showCount, displayContext) {
  let assigneesHTML = "";
  for (let i = 0; i < showCount; i++) {
    let assignee = names[i];
    if (typeof assignee !== "string") {
      console.warn("Invalid assignee name:", assignee);
      continue;
    }
    assigneesHTML = getAssigneesForTemplates(
      assignee,
      displayContext,
      assigneesHTML
    );
  }
  return assigneesHTML;
}

/**
 * Generates the "+X" indicator for additional assignees.
 * @param {number} total - Total number of assignees.
 * @param {number} maxToShow - Maximum number of assignees to show.
 * @returns {string} The HTML for the "+X" indicator.
 */
function getMoreAssigneesIndicator(total, maxToShow) {
  const moreCount = total - maxToShow;
  return `<div class='assignee-initials more-assignees-indicator' style='background:#2a3647;color:#fff;border:1px solid #fff;font-weight:bold;font-size:12px;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;margin-left:-8px;'>+${moreCount}</div>`;
}

/**
 * Generates the HTML for a single assignee based on the display context.
 * @param {string} assignee - The assignee's name.
 * @param {string} displayContext - The display context ("focused" or other).
 * @param {string} assigneesHTML - The current HTML string for assignees.
 * @returns {string} The updated HTML string for assignees.
 */
function getAssigneesForTemplates(assignee, displayContext, assigneesHTML) {
  let assigneeInitials = getAssigneeInitals(assignee);
  let cssClass = getFitAssigneesToCSS(assignee);

  if (displayContext === "focused") {
    assigneesHTML += focusedAssigneeTemplate(
      assigneeInitials,
      cssClass,
      assignee
    );
  } else {
    assigneesHTML += previewAssigneeTemplate(assigneeInitials, cssClass);
  }

  return assigneesHTML;
}

/**
 * Retrieves the names of all assignees for a task from the provided assignee IDs.
 * @param {Object} assignees - Object with assignee IDs as keys.
 * @param {Object} kanbanData - The Kanban data object containing user info.
 * @returns {Array<string>} Array of assignee names.
 */
function getAssigneesNames(assignees, kanbanData) {
  let assigneesNames = [];

  for (let assigneeId in assignees) {
    if (assignees.hasOwnProperty(assigneeId)) {
      let userName = kanbanData.users[assigneeId]?.name || "Unknown User";
      assigneesNames.push(userName);
    }
  }

  return assigneesNames;
}

/**
 * Extracts the initials of an assignee from their full name (e.g., "John Doe" -> "JD").
 * @param {string} assignee - The assignee's full name.
 * @returns {string} The initials of the assignee.
 */
function getAssigneeInitals(assignee) {
  if (!assignee || typeof assignee !== "string") {
    console.warn("Invalid assignee:", assignee);
    return "??";
  }

  let [firstName = "", lastName = ""] = assignee.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase() || "?";
  let lastNameFirstLetter = lastName.charAt(0).toUpperCase() || "?";

  return firstLetter + lastNameFirstLetter;
}

/**
 * Adjusts assignee name for use in CSS (lowercase first letter of the name).
 * @param {string} assignee - The assignee's name.
 * @returns {string} The CSS class string.
 */
function getFitAssigneesToCSS(assignee) {
  if (!assignee || typeof assignee !== "string") {
    console.warn("Invalid assignee for CSS:", assignee);
    return "x";
  }
  return assignee.charAt(0).toLowerCase();
}
