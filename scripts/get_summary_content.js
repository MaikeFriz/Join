// Determines whether the user is a guest or logged-in and updates the UI accordingly
function getSummaryCount() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));

  if (isGuest) {
    updateGuestUser();
  } else if (loggedInUser) {
    updateLoggedInUser(loggedInUser);
  } else {
    console.log("No user logged in.");
  }
}


// Updates the UI and data for the guest user
function updateGuestUser() {
  const data = JSON.parse(localStorage.getItem("guestKanbanData"));
  if (data && data.users && data.users.guest) {
    const guestUser = data.users.guest;

    startUpdateInterval(guestUser, () => {
      return new Promise((resolve) => {
        const updatedData = JSON.parse(localStorage.getItem("guestKanbanData"));
        resolve(updatedData?.users?.guest?.assignedTasks || {});
      });
    });

    getLoggedUsername(guestUser);
  } else {
    console.log("No guest data found.");
  }
}


// Updates the UI and data for logged-in users
function updateLoggedInUser(loggedInUser) {
  const userId = loggedInUser.userId;
  const BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/users/${userId}/assignedTasks.json`;

  startUpdateInterval(loggedInUser, () => {
    return fetch(BASE_URL).then((response) => response.json());
  });

  getLoggedUsername(loggedInUser);
}


// Starts an interval to update the task counters for a given user
function startUpdateInterval(user, fetchDataCallback) {
  setInterval(() => {
    fetchDataCallback()
      .then((updatedData) => {
        user.assignedTasks = updatedData || {};
        updateSummaryCounts(user);
      })
      .catch((error) => console.error("Error updating data:", error));
  }, 1000);
}


// Helper function to update the counts for various task categories
function updateSummaryCounts(user) {
  getToDoCount(user);
  getDoneCount(user);
  getUrgentCount(user);
  getAllTasksCount(user);
  getInprocessCount(user);
  getAwaitingCount(user);
}


// Function to update the count of "To Do" tasks for the logged-in user
function getToDoCount(loggedInUser) {
  const toDoCountHTML = document.getElementById("toDo-tasks-count");
  toDoCountHTML.innerHTML =
    loggedInUser.assignedTasks && loggedInUser.assignedTasks.toDo
      ? Object.keys(loggedInUser.assignedTasks.toDo).length
      : 0;
}


// Function to update the count of "Done" tasks for the logged-in user
function getDoneCount(loggedInUser) {
  const doneCountHTML = document.getElementById("done-tasks-count");
  doneCountHTML.innerHTML =
    loggedInUser.assignedTasks && loggedInUser.assignedTasks.done
      ? Object.keys(loggedInUser.assignedTasks.done).length
      : 0;
}


// Function to update the count of "Urgent" tasks for the logged-in user
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


// Function to update the total count of all tasks assigned to the logged-in user
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


// Function to update the count of "In Progress" tasks for the logged-in user
function getInprocessCount(loggedInUser) {
  const inprocessCountHTML = document.getElementById("inprocess-tasks-count");
  inprocessCountHTML.innerHTML =
    loggedInUser.assignedTasks && loggedInUser.assignedTasks.inProgress
      ? Object.keys(loggedInUser.assignedTasks.inProgress).length
      : 0;
}


// Function to update the count of "Awaiting Feedback" tasks for the logged-in user
function getAwaitingCount(loggedInUser) {
  const awaitingCountHTML = document.getElementById("awaiting-tasks-count");
  awaitingCountHTML.innerHTML =
    loggedInUser.assignedTasks && loggedInUser.assignedTasks.awaitingFeedback
      ? Object.keys(loggedInUser.assignedTasks.awaitingFeedback).length
      : 0;
}


// Function to display the username of the logged-in user in the UI
function getLoggedUsername(loggedInUser) {
  const loggedUsernameHTML = document.getElementById("logged-username");
  loggedUsernameHTML.innerHTML = loggedInUser.name || "null";
}
