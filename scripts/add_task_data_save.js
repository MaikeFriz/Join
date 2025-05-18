document.addEventListener("DOMContentLoaded", async function () {
  const isGuest = JSON.parse(localStorage.getItem("isGuest"));
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let kanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || {tasks: {}, subtasks: {}, users: {}};

  if (isGuest) {
    let data = JSON.parse(localStorage.getItem("guestKanbanData"));
    user = data && data.users ? data.users.user : null;
  }

  if (!user && !isGuest) {
    window.location.href = "./log_in.html";
    return;
  }

  let BASE_URL = `https://join-36b1f-default-rtdb.europe-west1.firebasedatabase.app/kanbanData/`;
  let taskForm = document.getElementById("task_form");

  // Returns the next available task ID
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
      return "task1";
    }
  }

  // Adds a submit event listener to the task form
  function addTaskFormListener() {
    taskForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const taskData = getTaskDetails();
      const newTaskId = await getNewTaskId();
      const isGuest = JSON.parse(localStorage.getItem("isGuest"));
      const userId = isGuest ? "guest" : user.userId;
      await saveTaskToDatabase(newTaskId, taskData, userId);
    });
  }

  // Collects all task details from the form
  function getTaskDetails() {
    let title = document.getElementById("input_title").value;
    let description = document.getElementById("input_description").value;
    let createdAt = new Date().toISOString();
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    let createdBy = isGuest ? "guest" : user.userId; // <-- Anpassung hier!
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

  // Returns assigned users as an object
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

  // Returns all subtasks as an object
  function getSubtaskDetails() {
    let subtasks = {};
    for (let subtaskId in subtasksObject) {
      subtasks[subtaskId] = true;
    }
    return subtasks;
  }

  // Speichert die Aufgabe und zugehörige Daten, dann setzt das Formular zurück
  async function saveTaskToDatabase(taskId, taskData, userId) {
    try {
      await saveTaskData(taskId, taskData);
      await saveSubtasksData(taskId);
      const urlCategory = getCategoryFromUrl();
      await addTaskToUserCategoryList(taskId, userId, urlCategory);

      const isGuest = JSON.parse(localStorage.getItem("isGuest"));
      if (!isGuest) {
        await waitForTaskSaveOperations(taskId);
      }

      resetFormFields();
      resetAssigneesAndSubtasks();
      window.location.href = "./board.html";
    } catch (error) {
      // Fehlerbehandlung falls nötig
    }
  }

  // Resets the form fields
  function resetFormFields() {
    document.getElementById("input_title").value = "";
    document.getElementById("input_description").value = "";
    const activePriority = document.querySelector(".priority-buttons-div .active");
    if (activePriority) activePriority.classList.remove("active");
    document.getElementById("category").value = "";
    document.getElementById("dropdown_selected").textContent = "Select Category";
    resetAssignees();
  }

  // Resets assignees and subtasks
  function resetAssigneesAndSubtasks() {
    resetAssignees();
    resetSubtasks();
  }

  // Removes all assignees from the task
  function resetAssignees() {
    for (const userId in assigneesObject) {
      removeAssignee(userId);
    }
    const showAssigneesDiv = document.getElementById("show-assignees");
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

  // Saves the task data to the database or localStorage
  function saveTaskData(taskId, taskData) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      // Hole IMMER die aktuellen Daten aus dem localStorage
      kanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || {tasks: {}, subtasks: {}, users: {}};
      kanbanData.tasks[taskId] = taskData;
      localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
      return Promise.resolve(kanbanData.tasks);
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
      // Hole aktuelle Daten
      kanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || {tasks: {}, subtasks: {}, users: {}};
      let existingSubtasks = kanbanData.subtasks;
      const updatedSubtasks = prepareSubtasksForDatabase(existingSubtasks, taskId);
      kanbanData.subtasks = updatedSubtasks;
      localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
      return Promise.resolve(kanbanData.subtasks);
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

  // Prepares the subtasks data for saving
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

  // Adds the task to the user's to-do list (legacy, not used)
  function addTaskToUserToDoList(taskId, userId) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    if (isGuest) {
      let data = JSON.parse(localStorage.getItem("guestKanbanData")) || { users: { user: { assignedTasks: { toDo: {} } } } };
      if (!data.users.user.assignedTasks.toDo) {
          data.users.user.assignedTasks.toDo = {};
      }
      data.users.user.assignedTasks.toDo[taskId] = true;
      localStorage.setItem("guestKanbanData", JSON.stringify(data));
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
      .then(() => {})
      .catch((error) => {});
    }
  }

  // Waits for all pending task save operations to complete
  async function waitForTaskSaveOperations(taskId) {
    try {
        const response = await fetch(`${BASE_URL}tasks/${taskId}/status.json`);
        if (!response.ok) {
            throw new Error(`Error checking task save status. Status: ${response.status}`);
        }
        const status = await response.json();
        if (status && status.pendingSaveOperations > 0) {
            return new Promise(resolve => setTimeout(() => resolve(waitForTaskSaveOperations(taskId)), 1000));
        }
    } catch (error) {
        throw error;
    }
  }

  // Maps URL category parameter to database category
  function mapCategoryParameterToDatabaseCategory(categoryParameter) {
    const categoryMapping = {
        toDoCardsColumn: "toDo",
        inProgressCardsColumn: "inProgress",
        awaitFeedbackCardsColumn: "awaitingFeedback",
        doneCardsColumn: "done"
    };
    return categoryMapping[categoryParameter] || "toDo";
  }

  // Adds the task to the guest user's category list in localStorage
  function addTaskToGuestCategory(taskId, databaseCategory) {
    // Hole aktuelle Daten
    kanbanData = JSON.parse(localStorage.getItem("guestKanbanData")) || {tasks: {}, subtasks: {}, users: {}};
    if (!kanbanData.users) kanbanData.users = {};
    if (!kanbanData.users.guest) kanbanData.users.guest = {};
    if (!kanbanData.users.guest.assignedTasks) kanbanData.users.guest.assignedTasks = {};
    if (!kanbanData.users.guest.assignedTasks[databaseCategory]) kanbanData.users.guest.assignedTasks[databaseCategory] = {};

    kanbanData.users.guest.assignedTasks[databaseCategory][taskId] = true;
    localStorage.setItem("guestKanbanData", JSON.stringify(kanbanData));
    return Promise.resolve(kanbanData.users.guest.assignedTasks[databaseCategory]);
  }

  // Adds the task to the user's category list in the database
  function addTaskToUserCategory(taskId, userId, databaseCategory) {
    return fetch(`${BASE_URL}users/${userId}/assignedTasks/${databaseCategory}.json`)
        .then((response) => response.json())
        .then((existingTasks) => {
            existingTasks = existingTasks || {};
            existingTasks[taskId] = true;
            return fetch(`${BASE_URL}users/${userId}/assignedTasks/${databaseCategory}.json`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(existingTasks),
            });
        })
        .then(() => {})
        .catch((error) => {});
  }

  // Adds the task to the correct user category list (guest or registered)
  function addTaskToUserCategoryList(taskId, userId, categoryParameter) {
    const isGuest = JSON.parse(localStorage.getItem("isGuest"));
    const databaseCategory = mapCategoryParameterToDatabaseCategory(categoryParameter);

    if (isGuest) {
        return addTaskToGuestCategory(taskId, databaseCategory);
    } else {
        return addTaskToUserCategory(taskId, userId, databaseCategory);
    }
  }

  addTaskFormListener();
});
