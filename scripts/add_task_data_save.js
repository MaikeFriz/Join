document.addEventListener("DOMContentLoaded", async function () {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  let BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;
  let taskForm = document.getElementById("task_form");

  // Function to determine the ID of the next new task
  async function getNewTaskId() {
    try {
      let response = await fetch(`${BASE_URL}tasks.json`);
      let data = await response.json();
      if (!data) return "task1";
      let taskIds = Object.keys(data);
      if (taskIds.length === 0) return "task1";
      let maxTaskId = taskIds.reduce((max, id) => {
        let numericId = parseInt(id.replace("task", ""), 10);
        return numericId > max ? numericId : max;
      }, 0);
      return `task${maxTaskId + 1}`;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return "task1";
    }
  }

  // Function to add an event listener to the task form for submission
  function addTaskFormListener() {
    taskForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      let taskData = getTaskDetails();
      let newTaskId = await getNewTaskId();
      saveTaskToDatabase(newTaskId, taskData, user.userId);
    });
  }

  // Function to gather task details from the form inputs
  function getTaskDetails() {
    let title = document.getElementById("input_title").value;
    let description = document.getElementById("input_description").value;
    let createdAt = new Date().toISOString();
    let createdBy = user.userId;
    let updatedAt = createdAt;
    let priority = document.querySelector(".priority_buttons_div .active p").textContent.toLowerCase();
    let assignees = getAssignedUsers();
    let label = document.getElementById("category").value;
    let subtasks = getSubtaskList();

    return {
      label: label,
      title: title,
      description: description,
      createdAt: createdAt,
      updatedAt: updatedAt,
      priority: priority,
      createdBy: createdBy,
      assignees: assignees,
      subtasks: subtasks
    };
  }

  // Function to retrieve the list of assigned users
  function getAssignedUsers() {
    for (let assigneeName in assigneesObject) {
      if (assigneesObject.hasOwnProperty(assigneeName)) {
        const lowerCaseName = assigneeName.toLowerCase();
        if (lowerCaseName !== assigneeName) {
          assigneesObject[lowerCaseName] = assigneesObject[assigneeName];
          delete assigneesObject[assigneeName];
        }
      }
    }
    return assigneesObject;
  }
  
  // Function to retrieve the list of subtasks from the DOM
  function getSubtaskList() {
    let subtasks = {};
    let subtasksList = document.querySelectorAll("#display_subtasks div span");
    for (let i = 0; i < subtasksList.length; i++) {
      let subtask = subtasksList[i].textContent;
      subtasks[`subtask${i + 1}`] = true;
    }
    console.log("Subtasks captured:", subtasks); // Debugging subtasks
    return subtasks;
  }

  // Function to save the task in the Firebase database
  function saveTaskToDatabase(taskId, taskData, userId) {
    fetch(`${BASE_URL}tasks/${taskId}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
    .then((response) => response.json())
    .then(() => {
      addTaskToUsertoDo(taskId, userId);
    })
    .catch((error) => {
      console.error("Error saving task:", error);
    });
  }

  // Function to add the task to the user's "toDo" list in the Firebase database
  function addTaskToUsertoDo(taskId, userId) {
    fetch(`${BASE_URL}users/${userId}/assignedTasks/toDo.json`)
      .then((response) => response.json())
      .then((existingTasks) => {
        existingTasks = existingTasks || {};
        existingTasks[taskId] = true;
        return fetch(`${BASE_URL}users/${userId}/assignedTasks/toDo.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(existingTasks),
        });
      })
      .then(() => {
        console.log(`Task ${taskId} added to user ${userId}'s toDo list`);
      })
      .catch((error) => {
        console.error("Error adding task to user:", error);
      });
  }
  
  addTaskFormListener();
});
