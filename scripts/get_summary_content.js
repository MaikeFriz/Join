function getSummaryCount() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));

  if (isGuest) {
    // Load data from localStorage for guests
    let data = JSON.parse(localStorage.getItem("guestKanbanData"));
    if (data && data.users && data.users.user) {
      loggedInUser = data.users.user;
      console.log("Guest mode: Using local data", loggedInUser);
      
      updateSummaryCounts(loggedInUser);
    } else {
      console.log("No guest data found.");
    }
  } else if (loggedInUser) {
    const userId = loggedInUser.userId;
    const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/assignedTasks.json`;

    // Poll the Firebase database every 1 second
    setInterval(() => {
      fetch(BASE_URL)
        .then((response) => response.json())
        .then((assignedTasks) => {
          loggedInUser.assignedTasks = assignedTasks || {};
          updateSummaryCounts(loggedInUser);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, 1000);
  } else {
    console.log("Kein Benutzer eingeloggt.");
  }

  if (loggedInUser) {
    getLoggedUsername(loggedInUser);
  }
}

// Helper function to update all summary counts
function updateSummaryCounts(user) {
  getToDoCount(user);
  getDoneCount(user);
  getUrgentCount(user);
  getAllTasksCount(user);
  getInprocessCount(user);
  getAwaitingCount(user);
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
