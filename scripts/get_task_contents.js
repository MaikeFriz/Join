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

function getToDoContent(userDataContent) {
  let toDoCardsHTML = "";
  if (
    !userDataContent.assignedTasks ||
    !userDataContent.assignedTasks.toDo ||
    Object.keys(userDataContent.assignedTasks.toDo).length === 0
  ) {
    console.log("toDo: Keine Aufgaben für diesen User");
  } else {
    let toDo = userDataContent.assignedTasks.toDo;
    let toDoArray = Object.values(toDo);
    for (let toDoIndex = 0; toDoIndex < toDoArray.length; toDoIndex++) {
      let toDoContent = toDoArray[toDoIndex];
      console.log("toDo:", toDoContent);
      toDoCardsHTML += toDoCardTemplate(toDoContent);
    }
  }
  return toDoCardsHTML;
}

function getInProgressContent(userDataContent) {
  let inProgressCardsHTML = "";
  if (
    !userDataContent.assignedTasks ||
    !userDataContent.assignedTasks.inProgress ||
    Object.keys(userDataContent.assignedTasks.inProgress).length === 0
  ) {
    console.log("In Progress: Keine Aufgaben für diesen User");
  } else {
    let inProgress = userDataContent.assignedTasks.inProgress;
    let inProgressArray = Object.values(inProgress);
    for (
      let inProgressIndex = 0;
      inProgressIndex < inProgressArray.length;
      inProgressIndex++
    ) {
      let inProgressContent = inProgressArray[inProgressIndex];
      console.log("In Progress:", inProgressContent);
      inProgressCardsHTML += inProgressCardTemplate(inProgressContent);
    }
  }
  return inProgressCardsHTML;
}

function getAwaitingFeedbackContent(userDataContent) {
  let awaitingFeedbackCardsHTML = "";
  if (
    !userDataContent.assignedTasks ||
    !userDataContent.assignedTasks.awaitingFeedback ||
    Object.keys(userDataContent.assignedTasks.awaitingFeedback).length === 0
  ) {
    console.log("Awaiting Feedback: Keine Aufgaben für diesen User");
  } else {
    let awaitingFeedback = userDataContent.assignedTasks.awaitingFeedback;
    let awaitingFeedbackArray = Object.values(awaitingFeedback);
    for (
      let awaitingFeedbackIndex = 0;
      awaitingFeedbackIndex < awaitingFeedbackArray.length;
      awaitingFeedbackIndex++
    ) {
      let awaitingFeedbackContent =
        awaitingFeedbackArray[awaitingFeedbackIndex];
      console.log("Awaiting Feedback:", awaitingFeedbackContent);
      awaitingFeedbackCardsHTML += awaitingFeedbackCardTemplate(
        awaitingFeedbackContent
      );
    }
  }
  return awaitingFeedbackCardsHTML;
}

function getDoneContent(userDataContent) {
  let doneCardsHTML = "";
  if (
    !userDataContent.assignedTasks ||
    !userDataContent.assignedTasks.done ||
    Object.keys(userDataContent.assignedTasks.done).length === 0
  ) {
    console.log("Done: Keine Aufgaben für diesen User");
  } else {
    let done = userDataContent.assignedTasks.done;
    let doneArray = Object.values(done);
    for (let doneIndex = 0; doneIndex < doneArray.length; doneIndex++) {
      let doneContent = doneArray[doneIndex];
      console.log("Done:", doneContent);
      doneCardsHTML += doneCardTemplate(doneContent);
    }
  }
  return doneCardsHTML;
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
