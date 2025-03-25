// Function to add HTML content to task containers for each status
function addHTMLToTaskContainers(toDoCardsHTML, inProgressCardsHTML, awaitingFeedbackCardsHTML, doneCardsHTML) {
  let toDoCardContainer = document.getElementById("toDoCard");
  let inProgressCardContainer = document.getElementById("inProgressCard");
  let awaitingFeedbackContainer = document.getElementById("awaitFeedbackCard");
  let doneCardContainer = document.getElementById("doneCard");

  // Append the respective task HTML content to the containers
  toDoCardContainer.innerHTML += toDoCardsHTML;
  inProgressCardContainer.innerHTML += inProgressCardsHTML;
  awaitingFeedbackContainer.innerHTML += awaitingFeedbackCardsHTML;
  doneCardContainer.innerHTML += doneCardsHTML;
}

// Function to extract and format task data (label, title, description)
function getTaskData(taskContent) {
  const label = taskContent.label || "Keine Kategorie"; // Default to "No Category"
  const fitLabelForCSS = label.toLowerCase().replace(/\s+/g, "-"); // Format label for CSS use
  const title = taskContent.title || "Untitled Task"; // Default to "Untitled Task"
  const description = taskContent.description || "Keine Beschreibung"; // Default to "No Description"
  return { label, fitLabelForCSS, title, description };
}

// Function to get the names of assignees from their IDs, based on the kanban data
function getAssigneesNames(assignees, kanbanData) {
  let assigneesNames = [];
  
  // Loop through each assignee and retrieve their name from the kanban data
  for (let assigneeId in assignees) {
    if (assignees.hasOwnProperty(assigneeId)) {
      const assigneeName = kanbanData.users[assigneeId]?.name || "Unbekannter Benutzer"; // Default to "Unknown User"
      assigneesNames.push(assigneeName);
      console.log(`Assignee ID: ${assigneeId}, Assignee Name: ${assigneeName}`);
    }
  }
  return assigneesNames; // Return an array of assignee names
}

// Function to extract the initials of an assignee from their full name
function getAssigneeInitals(assignee) {
  let assigneeInitials = "";
  let [firstName, lastName] = assignee.split(" "); // Split name into first and last name
  let firstLetter = firstName.charAt(0).toUpperCase(); // Get first letter of the first name
  let lastNameFirstLetter = lastName.charAt(0).toUpperCase(); // Get first letter of the last name
  assigneeInitials = firstLetter + lastNameFirstLetter; // Combine initials

  return assigneeInitials; // Return the initials
}

// Function to adjust assignee name for use in CSS (lowercase first letter)
function getFitAssigneesToCSS(assignee){
  let firstLetterLowerCase = assignee.charAt(0).toLowerCase(); // Get the first letter of the assignee in lowercase
  return firstLetterLowerCase; // Return it for CSS styling
}

// Function to generate HTML for assignees based on their names
function getAssignees(taskContent) {
  let assigneesHTML = "";

  // If there are assignees, generate HTML for each one
  if (taskContent.assigneesNames && taskContent.assigneesNames.length > 0) {
    for (let assigneeIndex = 0; assigneeIndex < taskContent.assigneesNames.length; assigneeIndex++) {
      let assignee = taskContent.assigneesNames[assigneeIndex];
      let assigneeInitials = getAssigneeInitals(assignee); // Get assignee initials
      let firstLetterLowerCase = getFitAssigneesToCSS(assignee); // Get the lowercase first letter for CSS
      assigneesHTML += assigneeTemplate(assigneeInitials, firstLetterLowerCase); // Generate the HTML template for assignee
      console.log("Assignee:", assignee, assigneeInitials);
    }
  } else {
    assigneesHTML = "<span>!!!</span>"; // If no assignees, display a placeholder
  }

  return assigneesHTML; // Return the generated HTML for assignees
}

// Function to create an HTML template for displaying assignee initials
function assigneeTemplate(assigneeInitials, firstLetterLowerCase) {
  return `<div class="assignee-initials ${firstLetterLowerCase}">${assigneeInitials}</div>`;
}
