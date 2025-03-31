function getSummaryCount() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    const userId = loggedInUser.userId;
    const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/assignedTasks.json`;

    // Poll the Firebase database every 1 second
    setInterval(() => {
      fetch(BASE_URL)
        .then((response) => response.json())
        .then((assignedTasks) => {
          loggedInUser.assignedTasks = assignedTasks || {};
          getToDoCount(loggedInUser);
          getDoneCount(loggedInUser);
          getUrgentCount(loggedInUser);
          getAllTasksCount(loggedInUser);
          getInprocessCount(loggedInUser);
          getAwaitingCount(loggedInUser);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, 1000); // Reduced interval to 1 second

    getLoggedUsername(loggedInUser);
  } else {
    console.log("Kein Benutzer eingeloggt.");
  }
}

function getToDoCount(loggedInUser) {
  const toDoCountHTML = document.getElementById("toDo-tasks-count");
  toDoCountHTML.innerHTML =
    loggedInUser.assignedTasks && loggedInUser.assignedTasks.toDo
      ? Object.keys(loggedInUser.assignedTasks.toDo).length
      : 0;
}

function getDoneCount(loggedInUser) {
  const doneCountHTML = document.getElementById("done-tasks-count");
  doneCountHTML.innerHTML =
    loggedInUser.assignedTasks && loggedInUser.assignedTasks.done
      ? Object.keys(loggedInUser.assignedTasks.done).length
      : 0;
}

function getUrgentCount(loggedInUser) {
  const urgentCountHTML = document.getElementById("urgent-tasks-count");
  urgentCountHTML.innerHTML = loggedInUser.assignedTasks
    ? Object.keys(loggedInUser.assignedTasks).reduce((urgentCount, key) => {
        return (
          urgentCount +
          Object.values(loggedInUser.assignedTasks[key]).filter(
            (task) => task.priority === "urgent"
          ).length
        );
      }, 0)
    : 0;
}

function getAllTasksCount(loggedInUser) {
  const allTasksCountHTML = document.getElementById("all-tasks-count");
  allTasksCountHTML.innerHTML = loggedInUser.assignedTasks
    ? Object.keys(loggedInUser.assignedTasks).reduce(
        (totalCount, key) =>
          totalCount + Object.keys(loggedInUser.assignedTasks[key]).length,
        0
      )
    : 0;
}

function getInprocessCount(loggedInUser) {
  const inprocessCountHTML = document.getElementById("inprocess-tasks-count");
  inprocessCountHTML.innerHTML =
    loggedInUser.assignedTasks && loggedInUser.assignedTasks.inProgress
      ? Object.keys(loggedInUser.assignedTasks.inProgress).length
      : 0;
}

function getAwaitingCount(loggedInUser) {
  const awaitingCountHTML = document.getElementById("awaiting-tasks-count");
  awaitingCountHTML.innerHTML =
    loggedInUser.assignedTasks && loggedInUser.assignedTasks.awaitingFeedback
      ? Object.keys(loggedInUser.assignedTasks.awaitingFeedback).length
      : 0;
}

function getLoggedUsername(loggedInUser) {
  const loggedUsernameHTML = document.getElementById("logged-username");
  loggedUsernameHTML.innerHTML = loggedInUser.name || "null";
}
