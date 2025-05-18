let BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;
let taskForm = document.getElementById("task_form");


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


  function addTaskFormListener() {
    taskForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const taskData = getTaskDetails();
      const newTaskId = await getNewTaskId();
      saveTaskToDatabase(newTaskId, taskData, user.userId);
    });
  }


  function getTaskDetails() {
    let title = document.getElementById("input_title").value;
    let description = document.getElementById("input_description").value;
    let createdAt = new Date().toISOString();
    let createdBy = user.userId;
    let updatedAt = createdAt;
    let priority = document.querySelector(".priority-buttons-div .active p").textContent.toLowerCase();
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


  function getSubtaskDetails() {
    let subtasks = {};
    for (let subtaskId in subtasksObject) {
      subtasks[subtaskId] = true;
    }
    return subtasks;
  }


  function saveTaskToDatabase(taskId, taskData, userId) {
    saveTaskData(taskId, taskData)
      .then(() => saveSubtasksData(taskId))
      .then(() => addTaskToUserToDoList(taskId, userId))
      .then(() => waitForTaskSaveOperations(taskId))
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


  function resetFormFields() {
    document.getElementById("input_title").value = "";
    document.getElementById("input_description").value = "";
    const activePriority = document.querySelector(".priority-buttons-div .active");
    if (activePriority) activePriority.classList.remove("active");
    document.getElementById("category").value = "";
    document.getElementById("dropdown_selected").textContent = "Select Category";
    resetAssignees();
  }


  function resetAssigneesAndSubtasks() {
    resetAssignees();
    resetSubtasks();
  }


  function resetAssignees() {
    for (const userId in assigneesObject) {
      removeAssignee(userId);
    }
    const showAssigneesDiv = document.getElementById("show-assignees");
    showAssigneesDiv.innerHTML = "";
  }


  function resetSubtasks() {
    subtasksObject = {};
    const displaySubtasksDiv = document.getElementById("display_subtasks");
    if (displaySubtasksDiv) {
      displaySubtasksDiv.innerHTML = "";
    }
  }


  function saveTaskData(taskId, taskData) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      let data = JSON.parse(localStorage.getItem("guestKanbanData"));
      data.tasks[taskId] = taskData;
      localStorage.setItem("guestKanbanData", JSON.stringify(data));
      console.log("Task added successfully:", data.tasks);
      return Promise.resolve(data.tasks);
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


  function saveSubtasksData(taskId) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      let data = JSON.parse(localStorage.getItem("guestKanbanData"));

      let existingSubtasks = data.subtasks;
      const updatedSubtasks = prepareSubtasksForDatabase(existingSubtasks, taskId);
      data.subtasks = updatedSubtasks;
      localStorage.setItem("guestKanbanData", JSON.stringify(data));
      console.log("Subtask added successfully:", data.subtasks);
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


  function overwriteSubtaskCollection(updatedSubtasks) {
    return fetch(`${BASE_URL}subtasks.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSubtasks),
    });
  }


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


  async function waitForTaskSaveOperations(taskId) {
    try {
      const response = await fetch(`${BASE_URL}tasks/${taskId}/status.json`);
      if (!response.ok) {
        throw new Error(`Error checking task save status. Status: ${response.status}`);
      }
      const status = await response.json();
      if (status && status.pendingSaveOperations > 0) {
        console.log(`Waiting for ${status.pendingSaveOperations} pending task save operations to complete...`);
        return new Promise(resolve => setTimeout(() => resolve(waitForTaskSaveOperations(taskId)), 1000));
      }
      console.log("All task save operations completed.");
    } catch (error) {
      console.error(`Error while waiting for task save operations: ${error.message}`);
      throw error;
    }
  }
  addTaskFormListener();
});
