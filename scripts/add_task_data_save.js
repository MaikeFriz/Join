document.addEventListener("DOMContentLoaded", async function () {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  let user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (isGuest) {
    let data = JSON.parse(localStorage.getItem("guestKanbanData"));
    user = data.users.user
  }

  if (!user) {
    window.location.href = "./log_in.html";
    return;
  }

  let BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;
  let taskForm = document.getElementById("task_form");

  // Fetches the next available task ID
  async function getNewTaskId() {
    try {
      let response = await fetch(`${BASE_URL}tasks.json`);
      let tasks = await response.json();

      if (isGuest) {
        let data = JSON.parse(localStorage.getItem("guestKanbanData"));
        tasks = data.tasks;
      }
      if (!tasks) return "task1";
      let taskIds = Object.keys(tasks);
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

  // Listens for the form submission to create a task
  function addTaskFormListener() {
    taskForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const taskData = getTaskDetails();
      const newTaskId = await getNewTaskId();
      saveTaskToDatabase(newTaskId, taskData, user.userId);
    });
  }

  // Retrieves all task details from the form
  function getTaskDetails() {
    let title = document.getElementById("input_title").value;
    let description = document.getElementById("input_description").value;
    let createdAt = new Date().toISOString();
    let createdBy = user.userId;
    let updatedAt = createdAt;
    let priority = document.querySelector(".priority_buttons_div .active p").textContent.toLowerCase();
    let assignees = getAssignedUsers();
    let label = document.getElementById("category").value;
    let subtasks = getSubtaskDetails();

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

  // Collects assigned users from the assignees object
  function getAssignedUsers() {
    let assignees = {};
    for (let assigneeName in assigneesObject) {
      if (assigneesObject.hasOwnProperty(assigneeName)) {
        const lowerCaseName = assigneeName.toLowerCase();
        assignees[lowerCaseName] = true;
      }
    }
    return assignees;
  }

  // Collects all subtasks from the subtasks object
  function getSubtaskDetails() {
    let subtasks = {};
    for (let subtaskId in subtasksObject) {
      subtasks[subtaskId] = true;
    }
    return subtasks;
  }

  // Saves the task to the database and performs subsequent actions
  function saveTaskToDatabase(taskId, taskData, userId) {
    saveTaskData(taskId, taskData)
      .then(() => saveSubtasksData(taskId))
      .then(() => addTaskToUserToDoList(taskId, userId))
      .then(() => {
        resetFormFields();
        resetAssigneesAndSubtasks();
        console.log("Task successfully saved and form reset.");
        window.location.href = "./board.html";
      })
      .catch((error) => {
        console.error("Error saving task or subtasks:", error);
      });
  }

  // Resets the form fields after task creation
  function resetFormFields() {
    document.getElementById("input_title").value = "";
    document.getElementById("input_description").value = "";
    const activePriority = document.querySelector(".priority_buttons_div .active");
    if (activePriority) activePriority.classList.remove("active");
    document.getElementById("category").value = "";
    document.getElementById("dropdown_selected").textContent = "Select Category";
    resetAssignees();
  }

  // Resets both assignees and subtasks
  function resetAssigneesAndSubtasks() {
    resetAssignees();
    resetSubtasks();
  }

  // Removes all assignees from the task
  function resetAssignees() {
    for (const userId in assigneesObject) {
      removeAssignee(userId);
    }
    const showAssigneesDiv = document.getElementById("show_assignees");
    showAssigneesDiv.innerHTML = "";
  }

  // Clears all subtasks from the task
  function resetSubtasks() {
    subtasksObject = {};
    const displaySubtasksDiv = document.getElementById("display_subtasks");
    if (displaySubtasksDiv) {
      displaySubtasksDiv.innerHTML = "";
    }
  }

  // Saves the task data to the database
  function saveTaskData(taskId, taskData) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      let data = JSON.parse(localStorage.getItem("guestKanbanData"));
      // Add the new task to the `tasks` object
      data.tasks[taskId] = taskData;
      // Save updated data back to localStorage
      localStorage.setItem("guestKanbanData", JSON.stringify(data));
      console.log("Task added successfully:", data.tasks);

    // Return a resolved Promise to match the expected behavior
    return Promise.resolve(data.tasks);  // Return resolved promise with updated tasks
    } else {
      return fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      }).then((response) => response.json());
    }
  }

  // Saves the subtasks related to the task
  function saveSubtasksData(taskId) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      let data = JSON.parse(localStorage.getItem("guestKanbanData"));

      let existingSubtasks = data.subtasks;
      const updatedSubtasks = prepareSubtasksForDatabase(existingSubtasks, taskId);
      data.subtasks = updatedSubtasks;
      localStorage.setItem("guestKanbanData", JSON.stringify(data));
      console.log("Subtask added successfully:", data.subtasks);
      // Return a resolved promise for consistency
      return Promise.resolve(data.subtasks);
  } else {
      return fetch(`${BASE_URL}subtasks.json`)
      .then((response) => response.json())
      .then((existingSubtasks) => {
        existingSubtasks = existingSubtasks || {};
        const updatedSubtasks = prepareSubtasksForDatabase(existingSubtasks, taskId);
        return overwriteSubtaskCollection(updatedSubtasks);
      });
    }
  }

  // Prepares the subtasks data for saving to the database
  function prepareSubtasksForDatabase(existingSubtasks, taskId) {
    const newSubtasks = { ...existingSubtasks };
    for (let subtaskId in subtasksObject) {
      if (!newSubtasks[subtaskId]) {
        newSubtasks[subtaskId] = {
          ...subtasksObject[subtaskId],
          [taskId]: true,
        };
      }
    }
    return newSubtasks;
  }

  // Overwrites the entire subtasks collection in the database
  function overwriteSubtaskCollection(updatedSubtasks) {
    return fetch(`${BASE_URL}subtasks.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSubtasks),
    });
  }

  // Adds the task to the user's to-do list
  function addTaskToUserToDoList(taskId, userId) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      let data = JSON.parse(localStorage.getItem("guestKanbanData")) || { users: { user: { assignedTasks: { toDo: {} } } } };
      if (!data.users.user.assignedTasks.toDo) {
          data.users.user.assignedTasks.toDo = {};
      }
      data.users.user.assignedTasks.toDo[taskId] = true;
      localStorage.setItem("guestKanbanData", JSON.stringify(data));

      console.log(`Task ${taskId} wurde zu Gast-Benutzer's To-Do-Liste hinzugefügt`);
      return Promise.resolve(data.users.user.assignedTasks.toDo);

  } else {
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
        console.log(`Task ${taskId} added to user ${userId}'s to-do list`);
      })
      .catch((error) => {
        console.error("Error adding task to user:", error);
      });
    }
  }
  addTaskFormListener();
});
