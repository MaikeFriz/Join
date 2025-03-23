
function addHTMLToTaskContainers(toDoCardsHTML, inProgressCardsHTML, awaitingFeedbackCardsHTML, doneCardsHTML) {
  let toDoCardContainer = document.getElementById("toDoCard");
  let inProgressCardContainer = document.getElementById("inProgressCard");
  let awaitingFeedbackContainer = document.getElementById("awaitFeedbackCard");
  let doneCardContainer = document.getElementById("doneCard");

  toDoCardContainer.innerHTML += toDoCardsHTML;
  inProgressCardContainer.innerHTML += inProgressCardsHTML;
  awaitingFeedbackContainer.innerHTML += awaitingFeedbackCardsHTML;
  doneCardContainer.innerHTML += doneCardsHTML;
}

function getAssigneesNames(assignees, kanbanData) {
  let assigneesNames = [];
  for (let assigneeId in assignees) {
    if (assignees.hasOwnProperty(assigneeId)) {
      const assigneeName = kanbanData.users[assigneeId]?.name || "Unbekannter Benutzer";
      assigneesNames.push(assigneeName);
      console.log(`Assignee ID: ${assigneeId}, Assignee Name: ${assigneeName}`);
    }
  }
  return assigneesNames;
}

function getAssigneeInitals(assignee) {
  let assigneeInitials = "";
  let [firstName, lastName] = assignee.split(" ");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName.charAt(0).toUpperCase();
  assigneeInitials = firstLetter + lastNameFirstLetter;

  return assigneeInitials;
}

function getFitAssigneesToCSS(assignee){
  let firstLetterLowerCase = assignee.charAt(0).toLowerCase();
  return firstLetterLowerCase;
}

function getAssignees(taskContent) {
  let assigneesHTML = "";
  if (taskContent.assigneesNames && taskContent.assigneesNames.length > 0) {
    for (
      let assigneeIndex = 0; assigneeIndex < taskContent.assigneesNames.length; assigneeIndex++ ) {
      let assignee = taskContent.assigneesNames[assigneeIndex];
      let assigneeInitials = getAssigneeInitals(assignee);
      let firstLetterLowerCase = getFitAssigneesToCSS(assignee);
      assigneesHTML += assigneeTemplate(assigneeInitials, firstLetterLowerCase);
      console.log("Mitarbeiter:", assignee, assigneeInitials);
    }
  } else {
    assigneesHTML = "<span>!!!</span>";
  }
  return assigneesHTML;
}

function assigneeTemplate(assigneeInitials, firstLetterLowerCase) {
  return `<div class="assignee-initials ${firstLetterLowerCase}">${assigneeInitials}</div>`;
}