
// Function to generate HTML for assignees based on their names
function getAssignees(taskContent) {
    let assigneesHTML = "";
  
    if (taskContent.assigneesNames && taskContent.assigneesNames.length > 0) {
      for (let assignee of taskContent.assigneesNames) {
        if (typeof assignee !== "string") {
          console.warn("Invalid assignee name:", assignee);
          continue; // Skip invalid entries
        }
        let assigneeInitials = getAssigneeInitals(assignee);
        let firstLetterLowerCase = getFitAssigneesToCSS(assignee);
        assigneesHTML += assigneeTemplate(assigneeInitials, firstLetterLowerCase);
        console.log("Assignee:", assignee, assigneeInitials);
      }
    } else {
      assigneesHTML = "<span>!!!</span>";
    }
  
    return assigneesHTML; 
  }
  
  // Function to retrieve the names of all assignees for a task
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
  
  // Function to extract the initials of an assignee from their full name
  function getAssigneeInitals(assignee) {
    if (!assignee || typeof assignee !== "string") {
      console.warn("Invalid assignee:", assignee);
      return "??"; // Fallback initials for invalid input
    }
  
    let [firstName = "", lastName = ""] = assignee.split(" ");
    let firstLetter = firstName.charAt(0).toUpperCase() || "?";
    let lastNameFirstLetter = lastName.charAt(0).toUpperCase() || "?";
  
    return firstLetter + lastNameFirstLetter;
  }
  
  // Function to adjust assignee name for use in CSS (lowercase first letter)
  function getFitAssigneesToCSS(assignee) {
    if (!assignee || typeof assignee !== "string") {
      console.warn("Invalid assignee for CSS:", assignee);
      return "x"; 
    }
  
    return assignee.charAt(0).toLowerCase();
  }