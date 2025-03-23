

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

function assigneeTemplate(assigneeInitials) {
  return `<div class="assignee">${assigneeInitials}</div>`;
}

function getAssignees(taskContent) {
  let assigneesHTML = "";
  if (taskContent.assignees && taskContent.assignees.length > 0) {
    for (
      let assigneeIndex = 0;
      assigneeIndex < taskContent.assignees.length;
      assigneeIndex++
    ) {
      let assignee = taskContent.assignees[assigneeIndex];
      let assigneeInitials = getAssigneeInitals(assignee);
      assigneesHTML += assigneeTemplate(assigneeInitials);
      console.log("Mitarbeiter:", assignee, assigneeInitials);
    }
  } else {
    assigneesHTML = "<span>Keine Mitarbeiter zugewiesen</span>";
  }
  return assigneesHTML;
}

function getAssigneeInitals(assignee) {
  let assigneeInitials = "";
  let [firstName, lastName] = assignee.split("-");
  let firstLetter = firstName.charAt(0).toUpperCase();
  let lastNameFirstLetter = lastName.charAt(0).toUpperCase();
  assigneeInitials = firstLetter + lastNameFirstLetter;

  return assigneeInitials;
}
