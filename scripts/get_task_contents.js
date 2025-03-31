// Function to structure task data for display
function getTaskData(taskContent) {
  const taskData = {
    label: taskContent.label || "Keine Kategorie",
    fitLabelForCSS: (taskContent.label || "Keine Kategorie")
      .toLowerCase()
      .replace(/\s+/g, "-"),
    title: taskContent.title || "Ohne Titel",
    description: taskContent.description || "Keine Beschreibung",
    subtasks: taskContent.subtasks || {},
    totalSubtasks: taskContent.totalSubtasks || 0,
    completedSubtasks: taskContent.completedSubtasks || 0,
    progressPercentage: taskContent.subtaskProgress || 0,
    showProgress: taskContent.showProgress || false,
    priority: taskContent.priority || "keine-priorität",
    taskId: taskContent.taskId,
  };

  return taskData;
}

// Function to get the names of assignees from their IDs, based on the kanban data
function getAssigneesNames(assignees, kanbanData) {
  let assigneesNames = [];

  for (let assigneeId in assignees) {
    if (assignees.hasOwnProperty(assigneeId)) {
      const assigneeName =
        kanbanData.users[assigneeId]?.name || "Unbekannter Benutzer";
      assigneesNames.push(assigneeName);
      console.log(`Assignee ID: ${assigneeId}, Assignee Name: ${assigneeName}`);
    }
  }
  return assigneesNames;
}

// Function to extract the initials of an assignee from their full name
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
    return "x"; // Fallback value for invalid input
  }

  return assignee.charAt(0).toLowerCase();
}

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
}
