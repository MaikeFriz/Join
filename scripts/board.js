document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  function addHTMLToTaskContainers(
    todoCardsHTML,
    inProgressCardsHTML,
    awaitingFeedbackCardsHTML,
    doneCardsHTML
  ) {
    let todoCardContainer = document.getElementById("toDoCard");
    let inProgressCardContainer = document.getElementById("inProgressCard");
    let awaitingFeedbackContainer =
      document.getElementById("awaitFeedbackCard");
    let doneCardContainer = document.getElementById("doneCard");

    todoCardContainer.innerHTML = todoCardsHTML;
    inProgressCardContainer.innerHTML = inProgressCardsHTML;
    awaitingFeedbackContainer.innerHTML = awaitingFeedbackCardsHTML;
    doneCardContainer.innerHTML = doneCardsHTML;
  }

  function generateTaskContent(tasks, templateFunction) {
    let taskCardsHTML = "";
    if (!tasks || Object.keys(tasks).length === 0) {
      console.log("No tasks for this category");
    } else {
      let tasksArray = Object.values(tasks);
      for (let taskIndex = 0; taskIndex < tasksArray.length; taskIndex++) {
        let taskContent = tasksArray[taskIndex];
        taskCardsHTML += templateFunction(taskContent);
      }
    }
    return taskCardsHTML;
  }

  const todoContent = generateTaskContent(
    user.assignedTasks.todos,
    todoCardTemplate
  );
  const inProgressContent = generateTaskContent(
    user.assignedTasks.inProgress,
    inProgressCardTemplate
  );
  const awaitingFeedbackContent = generateTaskContent(
    user.assignedTasks.awaitingFeedback,
    awaitingFeedbackCardTemplate
  );
  const doneContent = generateTaskContent(
    user.assignedTasks.done,
    doneCardTemplate
  );

  addHTMLToTaskContainers(
    todoContent,
    inProgressContent,
    awaitingFeedbackContent,
    doneContent
  );
});
