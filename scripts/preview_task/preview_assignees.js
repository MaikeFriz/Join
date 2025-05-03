
// Function to generate HTML for all assignees based on the provided task and display context
function getAssignees(taskContent, displayContext) {
    let assigneesHTML = "";
    
    if (taskContent.assigneesNames && taskContent.assigneesNames.length > 0) {
      for (let assigneeIndex = 0; assigneeIndex < taskContent.assigneesNames.length; assigneeIndex++) {
        let assignee = taskContent.assigneesNames[assigneeIndex];
        
        if (typeof assignee !== "string") {
          console.warn("Invalid assignee name:", assignee);
          continue;
        }
        assigneesHTML = getAssigneesForTemplates(assignee, displayContext, assigneesHTML);
      }
    } else {
      assigneesHTML = "<span>!!!</span>";
    }
    return assigneesHTML;
}
  
// Function to generate the HTML for a single assignee based on the display context (focused/preview)
function getAssigneesForTemplates(assignee, displayContext, assigneesHTML) {
    let assigneeInitials = getAssigneeInitals(assignee);
    let cssClass = getFitAssigneesToCSS(assignee);
  
    if (displayContext === "focused") {
      assigneesHTML += focusedAssigneeTemplate(assigneeInitials, cssClass, assignee);
    } else {
      assigneesHTML += previewAssigneeTemplate(assigneeInitials, cssClass);
    }
  
    return assigneesHTML;
}
  
// Function to retrieve the names of all assignees for a task from the provided assignee IDs
function getAssigneesNames(assignees, kanbanData) {
    let assigneesNames = [];
    
    for (let assigneeId in assignees) {
      if (assignees.hasOwnProperty(assigneeId)) {
        let userName =
          kanbanData.users[assigneeId]?.name || "Unknown User";
        assigneesNames.push(userName);
      }
    }
    
    return assigneesNames;
}
  
// Function to extract the initials of an assignee from their full name (e.g., "John Doe" -> "JD")
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
  
// Function to adjust assignee name for use in CSS (lowercase first letter of the name)
function getFitAssigneesToCSS(assignee) {
    if (!assignee || typeof assignee !== "string") {
      console.warn("Invalid assignee for CSS:", assignee);
      return "x";
    }
    return assignee.charAt(0).toLowerCase();
}
